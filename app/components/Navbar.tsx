import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6 border-b">
      <h1 className="text-xl font-bold">Fatemeh Madihi.dev</h1>

      <div className="flex gap-6">
        <Link href="/">Home</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/experiments">Experiments</Link>
        <Link href="/blog">Blog</Link>
      </div>
    </nav>
  );
}
