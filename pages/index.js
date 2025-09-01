import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);

  // Fetch school images from API
  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch("/api/showSchools");
        const data = await res.json();
        const imgs = data
          .map((s) => s.image)
          .filter((img) => img && img.trim() !== "");
        setImages(imgs);
      } catch (e) {
        console.error(e);
      }
    }
    fetchImages();
  }, []);

  // Auto slide every 4 seconds
  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images]);

  return (
    <div className="font-sans">
      {/* Hero Section with Slider */}
      <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background images */}
        {images.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${img.startsWith("/") ? img : "/" + img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Hero content */}
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            School Directory
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-md">
            Find and showcase schools with ease. Add, browse, and explore institutions.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/addSchool"
              className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg shadow hover:opacity-90"
            >
              ➕ Add School
            </Link>
            <Link
              href="/showSchools"
              className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:opacity-90"
            >
              📖 View Schools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
