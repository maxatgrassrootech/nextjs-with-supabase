import { Suspense } from "react";

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading notes…</div>}>
      {children}
    </Suspense>
  );
}
