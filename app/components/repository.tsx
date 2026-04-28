import { Calendar, Search, User } from "lucide-react";

export default function Repository() {
  const projects = [
    {
      title: "Distributed Sensor Network for Urban Monitoring",
      desc: "A comprehensive study on deploying low-cost environmental sensors across metropolitan areas.",
      author: "Dr. Elena Rossi",
      date: "Oct 12, 2023",
      tags: ["Research","IoT","Sustainability"],
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    },
    {
      title: "RaDiCe WMS: Core Architecture Redesign",
      desc: "Optimizing system performance and implementing scalable architecture for inventory tracking.",
      author: "Marco Silva",
      date: "Sep 28, 2023",
      tags: ["Development","Database"],
      image:
        "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    },
    {
      title: "Machine Learning in Logistics Optimization",
      desc: "Using AI models to optimize warehouse routing and reduce operational costs.",
      author: "Sarah Chen",
      date: "Aug 15, 2023",
      tags: ["AI","Logistics"],
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
  ];

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-[#faf8ff] to-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="
            inline-flex
            px-5 py-2 rounded-full
            bg-indigo-50 text-indigo-700
            text-xs uppercase tracking-[0.28em]
          ">
            Knowledge Repository
          </span>

          <h2 className="mt-8 text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
            Explore Research & Projects
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-slate-600">
            Discover publications, innovations and research initiatives
            shaping the future through collaboration and impact.
          </p>
        </div>



        {/* Search */}
        <div className="mb-16">
          <div className="
            flex items-center gap-4
            bg-white/80 backdrop-blur-xl
            border border-slate-200
            rounded-2xl px-6 py-5
            shadow-[0_15px_50px_rgba(15,23,42,.06)]
            hover:shadow-[0_20px_60px_rgba(15,23,42,.09)]
            transition
          ">
            <Search className="h-6 w-6 text-slate-500" />

            <input
              type="text"
              placeholder="Search research, projects, or authors..."
              className="
                flex-1 bg-transparent
                outline-none
                text-slate-700
                placeholder:text-slate-400
              "
            />

            <button className="
              px-5 py-2 rounded-xl
              bg-indigo-900 text-white
              text-sm font-medium
              hover:scale-105
              transition
            ">
              Search
            </button>
          </div>
        </div>



        {/* Top bar */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-semibold text-slate-900">
            Latest Publications
          </h3>

          <span className="
            px-4 py-2 rounded-full
            bg-orange-100
            text-sm text-slate-600 font-bold
          ">
            {projects.length} Projects
          </span>
        </div>



        {/* Cards */}
        <div className="space-y-8">
          {projects.map((p,i)=>(
            <div
              key={i}
              className="
                group
                relative overflow-hidden
                rounded-[30px]
                border border-slate-200
                bg-white
                shadow-[0_20px_60px_rgba(15,23,42,.06)]
                hover:-translate-y-2
                hover:shadow-[0_30px_90px_rgba(15,23,42,.12)]
                transition-all duration-500
              "
            >

              {/* gradient glow */}
              <div className="
                absolute top-0 left-0
                h-40 w-full
                bg-gradient-to-r
                from-indigo-500/5
                via-violet-500/5
                to-transparent
              "/>


              <div className="relative z-10 grid md:grid-cols-[320px_1fr] gap-8 p-7">

                {/* Image */}
                <div className="overflow-hidden rounded-3xl">
                  <img
                    src={p.image}
                    alt=""
                    className="
                      h-[240px] w-full object-cover
                      group-hover:scale-110
                      transition duration-700
                    "
                  />
                </div>



                {/* Content */}
                <div className="flex flex-col justify-center">

                  {/* Tags */}
<div className="flex flex-wrap gap-3 mb-5">
  {p.tags.map((tag, idx) => {
    const colors = [
      "bg-indigo-50 text-indigo-700 border border-indigo-100",
      "bg-violet-50 text-violet-700 border border-violet-100",
      "bg-emerald-50 text-emerald-700 border border-emerald-100",
      "bg-amber-50 text-amber-700 border border-amber-100",
      "bg-sky-50 text-sky-700 border border-sky-100",
      "bg-rose-50 text-rose-700 border border-rose-100",
    ];

    return (
      <span
        key={idx}
        className={`
          px-4 py-2 rounded-full
          text-xs font-medium
          ${colors[idx % colors.length]}
          hover:scale-105
          hover:-translate-y-1
          transition-all duration-300
        `}
      >
        {tag}
      </span>
    );
  })}
</div>


                  <h4 className="
                    text-3xl font-semibold
                    tracking-tight text-slate-900
                    group-hover:text-indigo-700
                    transition
                  ">
                    {p.title}
                  </h4>


                  <p className="
                    mt-5 text-slate-600
                    leading-8
                  ">
                    {p.desc}
                  </p>



                  <div className="
                    mt-7 flex flex-wrap items-center
                    gap-5 text-sm text-slate-500
                  ">
                    <span className="inline-flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-500" />
                      {p.author}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      {p.date}
                    </span>
                  </div>



                  {/* hover link */}
                  <div className="mt-8">
                    <button className="
                      group/link
                      inline-flex items-center gap-3
                      font-medium text-indigo-700
                    ">
                      Open Publication

                      <span className="
                        group-hover/link:translate-x-2
                        transition
                      ">
                        →
                      </span>

                    </button>
                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}