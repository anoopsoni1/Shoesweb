import React, { useState } from "react";

export default function AddressPage() {
  const [form, setForm] = useState({
    recipientName: "",
    phone: "",
    label: "home",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.line1 || !form.city || !form.country) {
      setMessage("❌ Please fill all required fields.");
      return;
    }

    try {
      // Send to backend
      const res = await fetch("http://localhost:5000/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage("✅ Address saved successfully!");
      setForm({
        recipientName: "",
        phone: "",
        label: "home",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        isDefault: false,
      });
    } catch (err) {
      setMessage("❌ Error saving address.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg w-full bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <h2 className="text-xl font-semibold">Add New Address</h2>

        <input
          name="recipientName"
          value={form.recipientName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border p-2 rounded"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border p-2 rounded"
        />

        <select
          name="label"
          value={form.label}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="home">Home</option>
          <option value="work">Work</option>
          <option value="other">Other</option>
        </select>

        <input
          name="line1"
          value={form.line1}
          onChange={handleChange}
          placeholder="Address Line 1"
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="line2"
          value={form.line2}
          onChange={handleChange}
          placeholder="Address Line 2 (optional)"
          className="w-full border p-2 rounded"
        />

        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          className="w-full border p-2 rounded"
        />

        <input
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          placeholder="Postal Code"
          className="w-full border p-2 rounded"
        />

        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country"
          required
          className="w-full border p-2 rounded"
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={handleChange}
          />
          <span>Set as default address</span>
        </label>

        {message && <p className="text-sm">{message}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Save Address
        </button>
      </form>
    </div>
  );
}
