import { useSelector } from "react-redux";
import { ShoppingBag, CreditCard, MapPin, Truck } from "lucide-react";

function Checkout() {
  const cart = useSelector((state) => state.cart.cartitem);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <div className="bg-[url('./bg12.jpg')] bg-cover bg-center">
    <div className="max-w-6xl mx-auto p-6 ">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
        <ShoppingBag className="w-7 h-7 text-white" />
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       
        <div className="lg:col-span-2 space-y-6">
          <div className=" outline-2 outline-amber-100 shadow-lg bg-white rounded-2xl p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-indigo-600" /> Shipping Address
            </h2>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none sm:col-span-2"
              />
              <input
                type="text"
                placeholder="Street Address"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none sm:col-span-2"
              />
              <input
                type="text"
                placeholder="City"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <select className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none sm:col-span-2">
                <option>India</option>
                <option>USA</option>
                <option>UK</option>
              </select>
            </form>
          </div>

          {/* Payment */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-indigo-600" /> Payment Method
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" className="accent-indigo-600" />
                <span>Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" className="accent-indigo-600" />
                <span>Credit / Debit Card</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" className="accent-indigo-600" />
                <span>UPI / Net Banking</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-white shadow-lg rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-indigo-600" /> Order Summary
          </h2>

          <div className="space-y-4 border-b pb-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × ₹{item.price}
                  </p>
                </div>
                <p className="font-semibold text-gray-800">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* Place Order */}
          <button className="w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">
            Place Order
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Checkout;
