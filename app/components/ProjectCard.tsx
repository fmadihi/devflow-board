export default function ProjectCard({ project }: any) {
  return (
    <div className="border rounded-xl p-6">
      <h2 className="text-xl font-semibold">
        {project.title}
      </h2>

      <p className="mt-2 text-gray-600">
        {project.description}
      </p>

      <div className="flex gap-2 mt-3">
        {project.tech.map((t: string) => (
          <span
            key={t}
            className="text-sm bg-gray-200 px-2 py-1 rounded"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        <a href={project.demo}>Demo</a>
        <a href={project.github}>Github</a>
      </div>
    </div>
  );
}
