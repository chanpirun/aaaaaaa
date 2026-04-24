export default function Repository() {
  const projects = [
    {
      title: "Distributed Sensor Network for Urban Monitoring",
      desc: "A comprehensive study on deploying low-cost environmental sensors across metropolitan areas.",
      author: "Dr. Elena Rossi",
      date: "Oct 12, 2023",
      tags: ["Research", "IoT", "Sustainability"],
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    },
    {
      title: "RaDiCe WMS: Core Architecture Redesign",
      desc: "Optimizing system performance and implementing a scalable architecture for inventory tracking.",
      author: "Marco Silva",
      date: "Sep 28, 2023",
      tags: ["Development", "Database"],
      image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    },
    {
      title: "Machine Learning in Logistics Optimization",
      desc: "Using AI models to optimize warehouse routing and reduce operational costs.",
      author: "Sarah Chen",
      date: "Aug 15, 2023",
      tags: ["AI", "Logistics"],
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
  ];

  return (
    <section className="w-full px-6 py-20 bg-[#f9f6f4]">
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">RaDiCe Repository</h2>
          <p className="text-gray-500 mt-2">
            Discover projects and researches within RaDiCe.
          </p>
        </div>

        {/* Search */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search projects, research, or authors..."
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>

        {/* Section header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Latest Projects</h3>
          <span className="text-sm text-gray-500">
            {projects.length} items
          </span>
        </div>

        {/* Cards */}
        <div className="space-y-6">
          {projects.map((p, i) => (
            <div
              key={i}
              className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
            >
              {/* Image */}
              <img
                src={p.image}
                alt=""
                className="w-40 h-24 object-cover rounded-lg"
              />

              {/* Content */}
              <div className="flex-1">
                {/* Tags */}
                <div className="flex gap-2 mb-1">
                  {p.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 px-2 py-1 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h4 className="font-semibold text-lg">
                  {p.title}
                </h4>

                {/* Description */}
                <p className="text-sm text-gray-500 mt-1">
                  {p.desc}
                </p>

                {/* Meta */}
                <div className="text-xs text-gray-400 mt-2 flex gap-4">
                  <span>👤 {p.author}</span>
                  <span>📅 {p.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}