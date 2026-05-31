export default function About() {
  return (
    <section className="py-20">
      <h1 className="text-4xl font-bold">About Me</h1>

      <p className="mt-6 text-lg text-gray-600">
        I'm a frontend developer focused on building fast and scalable web applications
        using React, Angular and TypeScript.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold">Frontend</h3>
          <p>React, Next.js, Angular</p>
        </div>

        <div>
          <h3 className="font-semibold">Languages</h3>
          <p>TypeScript, JavaScript</p>
        </div>

        <div>
          <h3 className="font-semibold">UI</h3>
          <p>Tailwind, CSS, Responsive Design</p>
        </div>

        <div>
          <h3 className="font-semibold">Other</h3>
          <p>Performance Optimization, SEO</p>
        </div>
      </div>
    </section>
  );
}
