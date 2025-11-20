import { createClient } from "@/lib/supabase/server";

export default async function NotesPage() {
  const supabase = await createClient();
  const { data: notes } = await supabase.from("notes").select();

  return (
    <div>
      <h1>Notes created by Max Li</h1>
      <pre>{JSON.stringify(notes, null, 2)}</pre>
    </div>
  );
}
