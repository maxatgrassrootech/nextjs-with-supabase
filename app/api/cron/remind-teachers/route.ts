import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Calculate the upcoming Sunday
    const today = new Date();
    const daysUntilSunday = (7 - today.getDay()) % 7;
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + daysUntilSunday);
    const dateString = nextSunday.toISOString().split("T")[0];

    // 2. Fetch the schedule for that Sunday
    const { data: schedule, error: scheduleError } = await supabase
      .from("schedules")
      .select("*")
      .eq("Date", dateString)
      .single();

    if (scheduleError || !schedule) {
      console.error(
        "Error fetching schedule or no schedule found:",
        scheduleError
      );
      return NextResponse.json(
        { message: "No schedule found for this Sunday" },
        { status: 404 }
      );
    }

    // 3. Define students and extract teacher assignments
    const students = [
      "Dana",
      "Benjamin",
      "Christina",
      "MaxLee",
      "Raymond",
      "Boyan1",
      "Boyan2",
      "Muduo1",
      "Muduo2",
      "Audrey1",
      "Audrey2",
    ];

    const assignments = students.map((student) => ({
      student,
      teacher: schedule[student],
    }));

    // 4. Identify teachers to email (filter out non-teachers)
    const teachersToContact = new Set<string>();
    const invalidTeachers = [
      "by himself",
      "Parent requested off",
      null,
      "",
      "undefined",
    ];

    assignments.forEach(({ teacher }) => {
      if (teacher && !invalidTeachers.includes(teacher)) {
        teachersToContact.add(teacher);
      }
    });

    if (teachersToContact.size === 0) {
      return NextResponse.json({
        message: "No teachers to contact for this Sunday",
      });
    }

    // 5. Fetch email addresses for these teachers
    const { data: members, error: membersError } = await supabase
      .from("members")
      .select("display_name, published_email_address")
      .in("display_name", Array.from(teachersToContact));

    if (membersError) {
      console.error("Error fetching members:", membersError);
      return NextResponse.json(
        { message: "Error fetching teacher emails" },
        { status: 500 }
      );
    }

    const emailAddresses = members
      .map((m) => m.published_email_address)
      .filter((email) => email); // Filter out null/empty emails

    if (emailAddresses.length === 0) {
      return NextResponse.json({ message: "No valid email addresses found" });
    }

    // 6. Construct the email content
    const assignmentsListHtml = assignments
      .map(
        ({ student, teacher }) =>
          `<li><strong>${student}:</strong> ${
            teacher || "No teacher assigned"
          }</li>`
      )
      .join("");

    const emailHtml = `
      <h2>Teaching Schedule for Sunday, ${dateString}</h2>
      <p>Here is the schedule for the upcoming Sunday:</p>
      <ul>
        ${assignmentsListHtml}
      </ul>
      <p>Please check your assignment. Thank you!</p>
    `;

    // 7. Send emails
    // We send individual emails to preserve privacy and improve deliverability,
    // but the content is the same.
    const emailPromises = emailAddresses.map((email) =>
      resend.emails.send({
        from: "onboarding@resend.dev", // Update this if you have a custom domain
        to: email,
        subject: `Teaching Schedule Reminder: ${dateString}`,
        html: emailHtml,
      })
    );

    await Promise.all(emailPromises);

    return NextResponse.json({
      message: "Emails sent successfully",
      recipients: emailAddresses.length,
      date: dateString,
    });
  } catch (error) {
    console.error("Unexpected error in cron job:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
