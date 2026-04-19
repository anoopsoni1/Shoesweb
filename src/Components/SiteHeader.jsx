import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaRegHeart, FaShoppingBag, FaRegUserCircle } from "react-icons/fa";
import { clearUser } from "../Feature/Slicetwo";
import { useTheme } from "../context/ThemeContext.jsx";

const API_USER = "https://shoesbackend-4.onrender.com/api/v1/user";

/**
 * Sticky site navigation used across checkout, cart, list, etc.
 *
 * @param {object} props
 * @param {() => void | Promise<void>} [props.onLogout] — If set, called instead of the default logout (API + clearUser + /login).
 * @param {import("react").ReactNode} [props.middleSlot] — Optional center content (e.g. List search).
 * @param {import("react").ReactNode} [props.extraActions] — Extra controls after cart (e.g. mobile menu).
 * @param {import("react").ReactNode} [props.brandAddon] — Shown after the SoleMate logo (e.g. icon on Home hero).
 * @param {"default" | "onImage"} [props.tone] — `onImage` = light text for hero backgrounds.
 * @param {string} [props.maxWidthClass]
 * @param {boolean} [props.showDashboardLink] — Show account link when logged in (default true).
 */
export default function SiteHeader({
  onLogout,
  middleSlot,
  extraActions,
  brandAddon,
  tone = "default",
  maxWidthClass = "max-w-7xl",
  showDashboardLink = true,
}) {
  const { isDark } = useTheme();
  const user = useSelector((s) => s.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartHref = user?._id ? "/cart" : "/Cart";

  const runLogout = async () => {
    if (onLogout) {
      await Promise.resolve(onLogout());
      return;
    }
    try {
      await axios.post(`${API_USER}/logout`, {}, { withCredentials: true });
    } catch {
      /* still sign out locally */
    }
    dispatch(clearUser());
    navigate("/login");
  };

  const onImage = tone === "onImage";

  const shell = onImage
    ? "sticky top-0 z-40 border-b border-white/15 bg-black/30 backdrop-blur-md"
    : isDark
      ? "sticky top-0 z-40 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-md"
      : "sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-md";

  /* Drive text/icon colors from the same `isDark` as the shell so we never get
     white-on-white if `html.dark` and ThemeContext ever disagree. */
  const logoClass = onImage
    ? "text-white drop-shadow-sm"
    : isDark
      ? "text-white"
      : "text-zinc-900";

  const iconBtn = onImage
    ? "p-2.5 rounded-full bg-white/15 text-white hover:bg-white/25 transition"
    : isDark
      ? "p-2.5 rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition"
      : "p-2.5 rounded-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200 transition";

  return (
    <header className={shell}>
      <nav
        className={`${maxWidthClass} mx-auto flex flex-wrap items-center gap-3 px-4 sm:px-6 py-3 ${
          middleSlot ? "" : "justify-between"
        }`}
      >
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/" className={`text-xl font-semibold tracking-tight ${logoClass}`}>
            SoleMate
          </Link>
          {brandAddon}
        </div>

        {middleSlot ? (
          <div className="flex-1 min-w-0 w-full sm:w-auto order-3 sm:order-none flex justify-stretch sm:justify-center">
            {middleSlot}
          </div>
        ) : null}

        <div
          className={`flex items-center gap-2 sm:gap-3 shrink-0 ${
            middleSlot ? "ml-auto sm:ml-0" : ""
          }`}
        >
          <Link to="/wishlist" className={iconBtn} aria-label="Wishlist">
            <FaRegHeart className="text-lg" />
          </Link>
          <Link to={cartHref} className={iconBtn} aria-label="Cart">
            <FaShoppingBag className="text-lg" />
          </Link>
          {user ? (
            <>
              <button
                type="button"
                onClick={runLogout}
                className={
                  onImage
                    ? "hidden sm:inline-flex px-4 py-2 text-sm font-semibold rounded-sm bg-red-600 text-white hover:bg-red-700 transition"
                    : "hidden sm:inline-flex px-4 py-2 text-sm font-semibold rounded-sm bg-red-600 text-white hover:bg-red-700 transition"
                }
              >
                Logout
              </button>
              {showDashboardLink && (
                <Link to="/dashboard" className={iconBtn} aria-label="Account">
                  <FaRegUserCircle className="text-lg" />
                </Link>
              )}
            </>
          ) : (
            <Link to="/login" className={iconBtn} aria-label="Sign in">
              <FaRegUserCircle className="text-lg" />
            </Link>
          )}
          {extraActions}
        </div>
      </nav>
    </header>
  );
}
