export default function Research() {
  return (
    <section className="w-full bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        
        {/* IMAGE */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
            alt="research"
            className="rounded-lg shadow-lg"
          />
          <p className="mt-4 text-center text-lg font-semibold">FinTech</p>
        </div>

        {/* TEXT */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            RESEARCH & <br /> DEVELOPMENT
          </h2>

          <p className="text-gray-300 mb-6">
            We explore cutting-edge technologies including artificial intelligence,
            blockchain, and data science to build innovative financial solutions
            and digital ecosystems.
          </p>

          <button className="px-6 py-3 border-2 border-white hover:bg-white hover:text-black transition">
            VIEW
          </button>
        </div>

      </div>
    </section>
  );
}