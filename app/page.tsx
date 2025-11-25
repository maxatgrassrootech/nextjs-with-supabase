import { createClient } from "@/lib/supabase/server";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";

async function SchedulesList() {
  const supabase = await createClient();
  const headers = [
    "Date",
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

  const today = new Date().toISOString().slice(0, 10);
  const { data: rows } = await supabase
    .from("schedules")
    .select(`id,${headers.join(",")}`)
    .gte("Date", today)
    .order("Date", { ascending: true });

  return (
    <div className="w-full p-5">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-300 border-b">
            {headers.map((header) => (
              <th
                key={header}
                className="text-left py-3 px-4 font-semibold text-sm border border-gray-200"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {(rows ?? []).map((schedule: any, index: number) => (
            <tr
              key={schedule.id}
              className={`${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              } hover:bg-green-200`}
            >
              {headers.map((header) => (
                <td
                  key={header}
                  className="text-left py-3 px-4 border border-gray-200"
                >
                  {schedule[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <Suspense>
          <SchedulesList />
        </Suspense>
        {/* <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero />
          <main className="flex-1 flex flex-col gap-6 px-4">
            <h2 className="font-medium text-xl mb-4">Next steps</h2>
            {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
          </main>
        </div> */}

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>Created by Max Li for Philly Ministry of CBCGB with love</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
