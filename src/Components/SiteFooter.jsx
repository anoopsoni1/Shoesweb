import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { PiShieldStarFill } from "react-icons/pi";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { BsSubstack } from "react-icons/bs";
import { useTheme } from "../context/ThemeContext.jsx";

function SiteFooter() {
  const user = useSelector((state) => state.user.userData);
  const { isDark } = useTheme();

  const shell = isDark
    ? "border-t border-zinc-800 bg-zinc-950 text-zinc-200"
    : "border-t border-zinc-200 bg-zinc-50 text-zinc-800";
  const card = isDark ? "text-zinc-300" : "text-zinc-800";
  const heading = isDark ? "text-zinc-100" : "text-zinc-900";
  const link = isDark
    ? "text-zinc-400 hover:text-white hover:underline"
    : "text-zinc-700 hover:text-zinc-950 hover:underline";

  return (
    <footer className={`mt-auto ${shell}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <div className="flex flex-col gap-3">
            <PiShieldStarFill
              size={28}
              className={isDark ? "text-indigo-400" : "text-indigo-600"}
            />
            <h2 className={`text-lg sm:text-xl font-semibold ${heading}`}>
              Comfort that lasts
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${card}`}>
              Premium materials and solid construction so every step feels
              supported, day after day.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <MdOutlineDocumentScanner
              size={28}
              className={isDark ? "text-indigo-400" : "text-indigo-600"}
            />
            <h2 className={`text-lg sm:text-xl font-semibold ${heading}`}>
              Style with purpose
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${card}`}>
              Clean silhouettes and performance details so you look sharp on
              the street or at the gym.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <BsSubstack
              size={28}
              className={isDark ? "text-indigo-400" : "text-indigo-600"}
            />
            <h2 className={`text-lg sm:text-xl font-semibold ${heading}`}>
              Stay in the loop
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${card}`}>
              New drops and offers land here first. Follow us for launch
              reminders and styling ideas.
            </p>
          </div>
        </div>

        <hr
          className={`my-8 sm:my-10 ${
            isDark ? "border-zinc-800" : "border-zinc-200"
          }`}
        />

        <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-10">
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
            <ul className={`flex flex-col gap-2.5 text-sm font-medium ${card}`}>
              <Link to="/SignIn" className={link}>
                Register / Sign in
              </Link>
              <Link to="/dashboard" className={link}>
                Account
              </Link>
              <Link to="/orders" className={link}>
                My orders
              </Link>
              <Link to="/list" className={link}>
                Shop
              </Link>
            </ul>

            <ul className={`flex flex-col gap-2.5 text-sm font-medium ${card}`}>
              {user ? (
                <Link to="/chat" className={link}>
                  FAQ / Help
                </Link>
              ) : (
                <Link to="/login" className={link}>
                  FAQ / Help
                </Link>
              )}
              <Link to="/contact" className={link}>
                Contact us
              </Link>
              <span className={isDark ? "text-zinc-600" : "text-zinc-800"}>
                Shipping & returns
              </span>
              <span className={isDark ? "text-zinc-600" : "text-zinc-800"}>
                Careers
              </span>
            </ul>
          </div>

          <p
            className={`text-center sm:text-right text-xs sm:text-sm font-semibold ${
              isDark ? "text-zinc-500" : "text-zinc-800"
            }`}
          >
            &copy; {new Date().getFullYear()} SoleMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
