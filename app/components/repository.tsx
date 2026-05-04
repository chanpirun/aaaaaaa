import ProjectList from "@/components/project-list";
import { publicProjects } from "@/data/projects";

export default function Repository() {
  return (
    <section className="bg-linear-to-b from-[#faf8ff] to-white px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="inline-flex rounded-full bg-indigo-50 px-5 py-2 text-xs uppercase tracking-[0.28em] text-indigo-700">
            Knowledge Repository
          </span>

          <h2 className="mt-8 text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Explore Research & Projects
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Discover publications, innovations and research initiatives shaping
            the future through collaboration and impact.
          </p>
        </div>

        <ProjectList projects={publicProjects} />
      </div>
    </section>
  );
}
