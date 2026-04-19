import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Paragraph() {
  const shoe = [
    { img: "./Front01.jpg", name: "Nike Dunk High", price: "1500", new: "New" },
    {
      img: "./Front02.jpeg",
      name: "WILBEN Women's Trekking Shoe — WS9143 Black",
      price: "1400",
      new: "New",
    },
    {
      img: "./Front03.jpg",
      name: "adidas STEP N PACE — Black",
      price: "1300",
      new: "New",
    },
    {
      img: "./Front04.jpeg",
      name: "Men's Walking Shoes — cushioned stride",
      price: "1200",
      new: "New",
    },
    {
      img: "./Front05.jpeg",
      name: "Running & everyday — lightweight build",
      price: "1000",
      new: "New",
    },
    { img: "./Front06.jpg", name: "Men's Casual Shoes", price: "1500", new: "New" },
  ];

  return (
    <section className="border-t border-zinc-200 bg-zinc-50 py-14 dark:border-zinc-800 dark:bg-zinc-950 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Featured
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              We are bold.
            </h2>
            <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
              Bold design and dependable comfort—each pair is picked to look sharp on
              the street and feel great when you are on the move.
            </p>
            <Link
              to="/list"
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 transition hover:gap-3 dark:text-amber-400"
            >
              Browse all shoes
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <p className="select-none text-5xl font-black leading-none tracking-tighter text-zinc-200 dark:text-zinc-800 sm:text-7xl lg:text-8xl">
            SNEAKERS
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shoe.map((sh, i) => (
            <Link
              key={i}
              to="/list"
              className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-amber-300/60 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-500/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${sh.img})` }}
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-100">
                  {sh.new}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <p className="line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {sh.name}
                </p>
                <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
                  ₹{sh.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Paragraph;
