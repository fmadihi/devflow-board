import Navbar from "./components/Navbar";
import "./globals.css";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="max-w-6xl mx-auto px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
export const metadata = {
  title: "Your Name | Frontend Developer",
  description: "React and Angular developer building modern web apps.",
};
