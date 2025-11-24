import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MembersPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { data: members, error } = await supabase
    .from("members")
    .select(
      "id, name, chinese_name, phone_number, published_email_address, linked_email_address, display_name"
    );

  if (error) {
    console.error("Error fetching members:", error);
    return <p>Error fetching members. Please try again later.</p>;
  }

  // Get column headers from the first member object, excluding 'id'
  const columns = [
    "name",
    "chinese_name",
    "phone_number",
    "published_email_address",
    "linked_email_address",
    "display_name",
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Members</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-300 border-b">
              {columns.map((column) => (
                <th
                  key={column}
                  className="text-left py-3 px-4 font-semibold text-sm border border-gray-200 capitalize"
                >
                  {column.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {members?.map((member: any, index: number) => (
              <tr
                key={member.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-green-200`}
              >
                {columns.map((column) => (
                  <td
                    key={column}
                    className="text-left py-3 px-4 border border-gray-200"
                  >
                    {member[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
