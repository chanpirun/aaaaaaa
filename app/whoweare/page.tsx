"use client";

import Image from "next/image";

const leaders = [
  {
    name: "Bradley Jensen MURG",
    role: "Executive Director",
    img: "/Bradley Jensen MURG.jpg",
    focus:
      "Steers cross-disciplinary research strategy for measurable impact.",
    stats: [
      "15+ Years Leadership",
      "Global Research Partnerships",
      "Innovation Driven Growth",
    ],
  },
];

const founders = [
  {
    name: "Ratana Soth",
    role: "Director",
    img: "/Ratana Soth.jpg",
    description:
      "Builds high-performing teams that deliver breakthrough solutions.",
    focus:
      "Focused on operational excellence, strategy alignment and team growth.",
  },
  {
    name: "Neil Ian Uy",
    role: "Consultant",
    img: "/Neil Ian Uy.jpg",
    description:
      "Guides strategic research decisions and stakeholder engagement.",
    focus:
      "Helps translate innovation into practical, high-value outcomes.",
  },
];

export default function WhoWeArePage() {
  return (
    <main className="bg-[#f8f7ff] text-slate-900">

      {/* HERO */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-indigo-600 font-medium tracking-[0.3em] uppercase text-sm">
            About Radice
          </span>

          <h1 className="mt-7 text-5xl md:text-7xl font-bold tracking-tight">
            Who We Are
          </h1>

          <p className="mt-8 max-w-3xl mx-auto text-lg md:text-xl leading-9 text-slate-600">
            At RaDiCe, we are a dynamic hub of innovation and exploration,
            dedicated to transforming research and development through
            collaboration, creativity and measurable impact.
          </p>
        </div>
      </section>

      {/* EXECUTIVE */}
      <section className="bg-slate-950 text-white py-32">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-flex rounded-full bg-indigo-500/15 px-5 py-2 text-xs tracking-[0.3em] uppercase text-indigo-200">
              Executive Team
            </span>

            <h2 className="mt-8 text-5xl md:text-6xl font-semibold tracking-tight">
              Leadership Built For Impact
            </h2>

            <p className="mt-6 text-slate-300 leading-8">
              Meet the executive leadership guiding RaDiCe with strategic
              vision, innovation and sustainable research outcomes.
            </p>
          </div>

          {leaders.map((person) => (
            <div
              key={person.name}
              className="
                relative overflow-hidden rounded-[40px]
                border border-white/10
                bg-gradient-to-br from-slate-900 to-slate-800
                p-10 md:p-14
                shadow-[0_50px_120px_rgba(0,0,0,.35)]
              "
            >
              <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
              <div className="absolute -right-10 bottom-0 h-60 w-60 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">

                <div>
                  <div className="overflow-hidden rounded-[34px] border border-white/10">
                    <Image
                      src={person.img}
                      alt={person.name}
                      width={800}
                      height={900}
                      className="h-[520px] w-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <span className="
                    inline-flex px-5 py-3 rounded-full
                    bg-white/5 border border-white/10
                    text-xs uppercase tracking-[0.28em]
                    text-indigo-200 
                  ">
                    {person.role}
                  </span>

                  <h3 className="mt-7 text-5xl font-semibold">
                    {person.name}
                  </h3>

                  <p className="mt-7 text-slate-300 text-lg leading-9">
                    {person.focus}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-5 mt-10">
                    {person.stats.map((item) => (
                      <div
                        key={item}
                        className="
                          rounded-3xl bg-white/5 border border-white/10
                          p-6 flex items-start gap-4
                        "
                      >
                        <div className="w-3 h-3 rounded-full bg-indigo-400 mt-2" />
                        <p className="text-slate-300">{item}</p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DIRECTOR + CONSULTANT */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="
              inline-flex rounded-full
              bg-white border border-slate-200
              px-5 py-2 text-xs uppercase
              tracking-[0.28em] text-slate-600
            ">
              Leadership Partners
            </span>

            <h2 className="mt-8 text-5xl md:text-6xl font-semibold tracking-tight">
              Experts Shaping Our Vision
            </h2>

            <p className="mt-6 text-slate-600 leading-8">
              Their experience bridges strategy, execution and measurable
              impact helping RaDiCe grow strong research ecosystems.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            {founders.map((person) => (
              <div
                key={person.name}
                className="
                  group relative overflow-hidden rounded-[34px]
                  bg-white/90 backdrop-blur-xl
                  border border-slate-200
                  shadow-[0_20px_70px_rgba(15,23,42,.08)]
                  hover:-translate-y-3
                  hover:shadow-[0_35px_90px_rgba(15,23,42,.14)]
                  transition-all duration-500
                "
              >
                <div className="
                  absolute inset-x-0 top-0 h-40
                  bg-gradient-to-r
                  from-indigo-500/10
                  via-violet-500/10
                  to-transparent
                " />

                <div className="p-6 pb-0 relative z-10">
                  <div className="overflow-hidden rounded-[28px] relative">

                    <Image
                      src={person.img}
                      alt={person.name}
                      width={700}
                      height={800}
                      className="
                        h-[430px] w-full object-cover
                        group-hover:scale-105
                        transition duration-700
                      "
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

                    <div className="absolute top-6 left-6">
                      <span className="
                        px-5 py-2 rounded-full
                        bg-white/90 backdrop-blur-md
                        shadow-lg
                        text-sm uppercase font-bold
                        tracking-[0.25em]
                        text-indigo-700
                      ">
                        {person.role}
                      </span>
                    </div>

                  </div>
                </div>

                <div className="p-8 pt-7 relative z-10">

                  <h3 className="text-3xl font-semibold tracking-tight">
                    {person.name}
                  </h3>

                  <p className="mt-5 text-slate-600 leading-8">
                    {person.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm">
                      Research Strategy
                    </span>

                    <span className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm">
                      Innovation
                    </span>

                    <span className="px-4 py-2 rounded-full bg-violet-50 text-violet-700 text-sm">
                      Leadership
                    </span>
                  </div>

                  <div className="
                    mt-8 rounded-3xl
                    bg-slate-100 border border-slate-100
                    p-6
                  ">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-black">
                      Focus Area
                    </p>

                    <p className="mt-4 text-slate-700 leading-8">
                      {person.focus}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}