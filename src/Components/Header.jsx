import { useTheme } from "../context/ThemeContext.jsx";

function Header() {
  const { isDark } = useTheme();
  const muted = isDark ? "text-zinc-400" : "text-zinc-600";

  return (
    <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-16 dark:border-zinc-800 dark:bg-zinc-950 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mx-auto mb-6 inline-flex rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300">
          Our story
        </p>
        <h2 className="text-2xl font-bold leading-snug text-zinc-900 dark:text-zinc-50 sm:text-3xl lg:text-4xl">
          We are driven. We build with people who expect more from their footwear—
          comfort that lasts and design that moves with you.
        </h2>
        <p className={`mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg ${muted}`}>
          Every collection is curated so you can step in with confidence: quality
          materials, honest pricing, and silhouettes that work from commute to weekend.
        </p>
      </div>
    </section>
  );
}

export default Header;
