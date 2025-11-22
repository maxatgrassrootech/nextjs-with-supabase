"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, Suspense } from "react";

type Member = {
  id: number;
  name: string;
  chinese_name: string;
  phone_number: string;
  published_email_address: string;
  linked_email_address: string;
};

function MembersTable({
  members,
  onSelectMember,
}: {
  members: Member[];
  onSelectMember: (member: Member) => void;
}) {
  return (
    <table className="table-auto border-collapse border border-gray-300 w-full">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">Click to Link</th>
          <th className="border border-gray-300 px-4 py-2">Name</th>
          <th className="border border-gray-300 px-4 py-2">Chinese Name</th>
          <th className="border border-gray-300 px-4 py-2">Phone Number</th>
          <th className="border border-gray-300 px-4 py-2">Published Email</th>
          <th className="border border-gray-300 px-4 py-2">Linked Email</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2 text-center">
              <input
                type="radio"
                name="selectedMember"
                onChange={() => onSelectMember(member)}
              />
            </td>
            <td className="border border-gray-300 px-4 py-2">{member.name}</td>
            <td className="border border-gray-300 px-4 py-2">
              {member.chinese_name}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {member.phone_number}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {member.published_email_address}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {member.linked_email_address}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function UserEmailDisplay({ email }: { email: string | null }) {
  if (!email) return null;
  return (
    <div>
      <p>Your email address: {email}</p>
    </div>
  );
}

function MemberLinker() {
  const [members, setMembers] = useState<Member[]>([]);
  const [linkedMember, setLinkedMember] = useState<Member | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndMembers = async () => {
      setLoading(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const email = user?.email ?? null;
      setUserEmail(email);

      if (email) {
        // Check if user is already linked
        const { data: linkedData, error: linkedError } = await supabase
          .from("members")
          .select(
            "id, name, chinese_name, phone_number, published_email_address, linked_email_address"
          )
          .eq("linked_email_address", email)
          .limit(1)
          .single();

        if (linkedData) {
          setLinkedMember(linkedData);
        } else {
          // Fetch unlinked members
          const { data, error } = await supabase
            .from("members")
            .select(
              "id, name, chinese_name, phone_number, published_email_address, linked_email_address"
            )
            .is("linked_email_address", null);

          if (error) {
            console.error("Error fetching members:", error);
          } else {
            setMembers(data as Member[]);
          }
        }
      }
      setLoading(false);
    };

    fetchUserAndMembers();
  }, []);

  const handleLinkMember = async () => {
    console.log("handleLinkMember called");
    console.log("Selected Member:", selectedMember);
    // Log the id specifically to make sure it's there
    console.log("Selected Member ID:", selectedMember?.id);
    console.log("User Email:", userEmail);

    if (!selectedMember || !userEmail) {
      console.log(
        "Exiting handleLinkMember: selectedMember or userEmail is missing."
      );
      return;
    }

    // Ensure we have an ID before proceeding
    if (!selectedMember.id) {
      console.error("Selected member is missing an ID.");
      alert("Error: Selected member has no ID.");
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("members")
      .update({ linked_email_address: userEmail })
      .eq("id", selectedMember.id)
      .select();

    console.log("Supabase update response:", { data, error });

    if (error) {
      alert(`Failed to link member: ${error.message}`);
      console.error("Supabase error:", error);
    } else {
      // Check if the update actually returned any data
      if (data && data.length > 0) {
        alert("Member linked successfully!");
        console.log("Update successful, returned data:", data);
        setLinkedMember(data[0]); // Use the returned data to be sure
        setMembers([]); // Clear the list of unlinked members
        setSelectedMember(null);
      } else {
        alert(
          "Failed to link member. The update did not return any data, which may indicate a permissions issue or that the row was not found."
        );
        console.log("Update seemed to succeed but returned no data.");
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <UserEmailDisplay email={userEmail} />
      {linkedMember ? (
        <div>
          <h2>You are already linked to the following member:</h2>
          <p>Name: {linkedMember.name}</p>
          <p>Chinese Name: {linkedMember.chinese_name}</p>
          <p>Phone: {linkedMember.phone_number}</p>
          <p>Published Email: {linkedMember.published_email_address}</p>
        </div>
      ) : (
        <>
          <p>Please link yourself with one of the following members:</p>
          <MembersTable members={members} onSelectMember={setSelectedMember} />
          {selectedMember && (
            <div className="mt-4">
              <button
                onClick={handleLinkMember}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Link me to an existing member
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EditScheduleForm() {
  const [sundays, setSundays] = useState<string[]>([]);
  const [students, setStudents] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<string[]>([
    "Faye",
    "Jocelyn",
    "by himself",
    "Ling-Ling",
    "Jarrett",
    "Jianglin",
    "MaxLi",
    "Boyan's parent",
    "Xinghua",
    "Yvonne",
    "Youyou",
    "Shuyan",
    "Yong",
    "Sophie",
    "Tricia",
    "Qingli",
    "Muduo's parent",
    "Audrey's parent",
    "Fei Ying",
    "Parent requested off",
  ]);
  const [selectedSunday, setSelectedSunday] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [oldTeacher, setOldTeacher] = useState<string>("");
  const [newTeacher, setNewTeacher] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Generate Sundays
    const sundaysList = [];
    // Use UTC to avoid timezone issues
    let currentDate = new Date(Date.UTC(2025, 10, 23)); // November is month 10
    const endDate = new Date(Date.UTC(2026, 11, 31)); // December is month 11

    // Find the first Sunday on or after the start date
    while (currentDate.getUTCDay() !== 0) {
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    // Add all subsequent Sundays until the end date
    while (currentDate <= endDate) {
      sundaysList.push(currentDate.toISOString().split("T")[0]);
      currentDate.setUTCDate(currentDate.getUTCDate() + 7);
    }
    setSundays(sundaysList);

    // Fetch students from a predefined list or another source
    setStudents([
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
    ]);
  }, []);

  useEffect(() => {
    const fetchOldTeacher = async () => {
      if (selectedSunday && selectedStudent) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("schedules")
          .select(selectedStudent)
          .eq("Date", selectedSunday)
          .single();

        if (data) {
          setOldTeacher((data as any)[selectedStudent]);
        } else {
          setOldTeacher("");
        }
      }
    };

    fetchOldTeacher();
  }, [selectedSunday, selectedStudent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const { data, error } = await supabase
      .from("schedules")
      .update({ [selectedStudent]: newTeacher })
      .eq("Date", selectedSunday);

    if (error) {
      setMessage(`Error updating schedule: ${error.message}`);
    } else {
      setMessage("Schedule updated successfully!");
      // Refresh old teacher value
      const { data: updatedData } = await supabase
        .from("schedules")
        .select(selectedStudent)
        .eq("Date", selectedSunday)
        .single();
      if (updatedData) {
        setOldTeacher((updatedData as any)[selectedStudent]);
      }
    }
  };

  return (
    <div className="p-4 border rounded-md max-w-md mx-auto my-8 bg-gray-100">
      <h2>Edit Schedule</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Sunday:</label>
          <select
            value={selectedSunday}
            onChange={(e) => setSelectedSunday(e.target.value)}
            required
          >
            <option value="">Select a Sunday</option>
            {sundays.map((sunday) => (
              <option key={sunday} value={sunday}>
                {sunday}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Student:</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            required
          >
            <option value="">Select a Student</option>
            {students.map((student) => (
              <option key={student} value={student}>
                {student}
              </option>
            ))}
          </select>
        </div>
        {selectedSunday && selectedStudent && (
          <div>
            <p>Old Teacher: {oldTeacher}</p>
          </div>
        )}
        <div>
          <label>New Teacher:</label>
          <select
            value={newTeacher}
            onChange={(e) => setNewTeacher(e.target.value)}
            required
          >
            <option value="">Select a Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher} value={teacher}>
                {teacher}
              </option>
            ))}
          </select>
        </div>
        <button className="border p-2 mt-2 hover:bg-gray-500" type="submit">
          Update Schedule
        </button>
      </form>
      {message && <p>{message}</p>}
      <div className="h-32">&nbsp;</div>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-1 p-4">
      <Suspense fallback={<p>Loading...</p>}>
        <MemberLinker />
      </Suspense>
      <EditScheduleForm />
    </div>
  );
}
