import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] flex items-center gap-2 rounded-full px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium shadow-lg border bg-white/90 text-slate-900 dark:bg-slate-900/90 dark:text-slate-100 dark:border-slate-700 backdrop-blur hover:scale-[1.03] transition"
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <FaSun className="text-amber-400" /> : <FaMoon />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
