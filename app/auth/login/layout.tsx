export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // no navbar, no footer
}
