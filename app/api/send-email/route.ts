import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { userEmail, oldTeacher, newTeacher, student, date } = await req.json();
  const supabase = await createClient();

  const getEmail = async (name: string) => {
    if (!name || ["by himself", "Parent requested off"].includes(name)) {
      return null;
    }
    const { data, error } = await supabase
      .from("members")
      .select("published_email_address")
      .eq("display_name", name)
      .single();
    if (error || !data) {
      console.error(`Could not find email for ${name}:`, error);
      return null;
    }
    return data.published_email_address;
  };

  const oldTeacherEmail = await getEmail(oldTeacher);
  const newTeacherEmail = await getEmail(newTeacher);

  const emailsToSend = [
    { to: userEmail, subject: "Schedule Change Confirmation" },
    { to: oldTeacherEmail, subject: "Update on Your Teaching Schedule" },
    { to: newTeacherEmail, subject: "You Have a New Teaching Assignment" },
  ];

  const emailPromises = emailsToSend
    .filter((email) => email.to)
    .map((email) =>
      resend.emails.send({
        from: "onboarding@resend.dev",
        to: email.to as string,
        subject: email.subject,
        html: `<p>The schedule for ${student} on ${date} has been changed from ${oldTeacher} to ${newTeacher}.</p>`,
      })
    );

  try {
    await Promise.all(emailPromises);
    return new Response(
      JSON.stringify({ message: "Emails sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending emails:", error);
    return new Response(JSON.stringify({ message: "Failed to send emails" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
