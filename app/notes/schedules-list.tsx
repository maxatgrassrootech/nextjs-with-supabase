import { createClient } from "@/lib/supabase/server";

export default async function SchedulesList() {
  const supabase = await createClient();
  const { data: notes } = await supabase.from("notes").select();
  const { data: rows } = await supabase
    .from("schedules")
    .select()
    .order("Date", { ascending: true });

  return (
    <>
      <div>
        <h1>Notes created by Max Li</h1>
        <pre>{JSON.stringify(notes, null, 2)}</pre>
      </div>

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
    </>
  );
}
