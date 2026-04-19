import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/** Resolves `/cart` to `/cart/:userId` so links do not need the real id in JSX. */
export default function CartRedirect() {
  const user = useSelector((state) => state.user.userData);
  if (!user?._id) return <Navigate to="/Cart" replace />;
  return <Navigate to={`/cart/${user._id}`} replace />;
}
