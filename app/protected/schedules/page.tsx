import { createClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";

export default async function SchedulesPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
  const { data: rows } = await supabase
    .from("schedules")
    .select()
    .gte("Date", today) // Add this line to filter for dates greater than or equal to today
    .order("Date", { ascending: true });

  return (
    <div>
      {(rows ?? []).map((schedule: any) => (
        <div key={schedule.id}>
          <h2>
            {" "}
            {schedule.Date} &nbsp;
            {schedule.Dana} &nbsp;
            {schedule.Benjamin} &nbsp;
            {schedule.Christina} &nbsp;
            {schedule.MaxLee} &nbsp;
            {schedule.Raymond} &nbsp;
            {schedule.Boyan1} &nbsp;
            {schedule.Boyan2} &nbsp;
            {schedule.Muduo1} &nbsp;
            {schedule.Muduo2} &nbsp;
            {schedule.Audrey1} &nbsp;
            {schedule.Audrey2} &nbsp;
          </h2>
        </div>
      ))}
    </div>
  );
}
