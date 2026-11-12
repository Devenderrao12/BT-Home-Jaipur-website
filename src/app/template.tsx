// A template re-mounts on every navigation, which replays this CSS-only fade/slide-in.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
