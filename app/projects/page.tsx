import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";


export default function Home() {
  return (
    <section className="py-20">

      <h1 className="text-5xl font-bold">
        Frontend Developer
      </h1>

      <p className="mt-6 text-gray-600">
        I build modern web applications using React, Angular and TypeScript.
      </p>

      <h2 className="text-3xl font-semibold mt-16">
        Featured Projects
      </h2>

      <div className="grid md:grid-cols-2 gap-8 mt-10">
        {projects.map((p:any) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>

    </section>
  );
}
