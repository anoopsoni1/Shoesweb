import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Secondheader = () => {
  const nav = useNavigate()
  const payal = useNavigate()
  const handlelo = ()=>{
   payal("/login")
  }

  const handle = ()=>{
   nav("/cart")
  }
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 ">
      <div className=" mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">SoleMate</h1>

        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-black">Home</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={handlelo} className="text-sm text-gray-700 hover:text-black">Login</button>
          <button onClick={handle} className="bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800">
            Cart
          </button>
        </div>
      </div>
    </header>
  );
};

export default Secondheader;
 