// pages/addSchool.jsx
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AddSchool() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState(null);

const onSubmit = async (data) => {
  try {
    setLoading(true);
    setMsg("");

    // Remove file from payload before sending
    const { image, ...rest } = data;

    const res = await fetch("/api/addSchool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rest),
    });

    const out = await res.json();
    if (!res.ok) throw new Error(out.error || "Failed to add");

    setMsg("✅ School added successfully!");
    setPreview(null);
    reset();
  } catch (e) {
    setMsg(`❌ ${e.message}`);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white shadow-xl hover:shadow-2xl rounded-2xl p-8 transition-shadow duration-300">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center drop-shadow-md">
          Add a New School
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          encType="multipart/form-data"
        >
          {/* Name */}
          <div>
            <label className="block font-semibold text-gray-700">
              Name*
              <input
                {...register("name", { required: true })}
                placeholder="School Name"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition-transform duration-200"
              />
            </label>
            {errors.name && <span className="text-red-500 text-sm">Required</span>}
          </div>

          {/* Address */}
          <div>
            <label className="block font-semibold text-gray-700">
              Address*
              <input
                {...register("address", { required: true })}
                placeholder="Street, Area"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition-transform duration-200"
              />
            </label>
            {errors.address && <span className="text-red-500 text-sm">Required</span>}
          </div>

          {/* City */}
          <div>
            <label className="block font-semibold text-gray-700">
              City*
              <input
                {...register("city", { required: true })}
                placeholder="City"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition-transform duration-200"
              />
            </label>
            {errors.city && <span className="text-red-500 text-sm">Required</span>}
          </div>

          {/* State */}
          <div>
            <label className="block font-semibold text-gray-700">
              State*
              <input
                {...register("state", { required: true })}
                placeholder="State"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition-transform duration-200"
              />
            </label>
            {errors.state && <span className="text-red-500 text-sm">Required</span>}
          </div>

          <div>
            <label className="block font-semibold text-gray-700">
              Website*
              <input
                {...register("website", { required: true })}
                placeholder="Website"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition-transform duration-200"
              />
            </label>
            {errors.website && <span className="text-red-500 text-sm">Required</span>}
          </div>

{/* Board */}
<div>
  <label className="block font-semibold text-gray-700">
    Board*
    <select
      {...register("board", { required: true })}
      className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition-transform duration-200"
    >
      <option value="">Select Board</option>
      <option value="CBSE">CBSE</option>
      <option value="ICSE">ICSE</option>
      <option value="IB">IB</option>
      <option value="Cambridge">Cambridge</option>
      <option value="State Board">State Board</option>
    </select>
  </label>
  {errors.board && (
    <span className="text-red-500 text-sm">Please select a board</span>
  )}
</div>


          {/* Contact */}
          <div>
            <label className="block font-semibold text-gray-700">
              Contact*
              <input
                type="tel"
                {...register("contact", {
                  required: true,
                  pattern: /^[0-9]{7,15}$/,
                })}
                placeholder="e.g. 9876543210"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition-transform duration-200"
              />
            </label>
            {errors.contact && (
              <span className="text-red-500 text-sm">Enter digits (7–15)</span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold text-gray-700">
              Email*
              <input
                type="email"
                {...register("email_id", {
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                })}
                placeholder="contact@school.com"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition-transform duration-200"
              />
            </label>
            {errors.email_id && (
              <span className="text-red-500 text-sm">Invalid email</span>
            )}
          </div>

<div className="md:col-span-2">
  <label className="block font-semibold text-gray-700 mb-2">
    School Image
  </label>
  <div className="flex items-center gap-4">
    <label className="cursor-pointer bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition">
      📷 Upload Image
      <input
        type="file"
        accept="image/*"
        {...register("image")}
        onChange={(e) => {
          if (e.target.files[0]) {
            setPreview(URL.createObjectURL(e.target.files[0]));
          }
        }}
        className="hidden"
      />
    </label>
    {preview && (
      <img
        src={preview}
        alt="Preview"
        className="h-20 w-20 rounded-lg object-cover shadow-md"
      />
    )}
  </div>
</div>


          {/* Submit */}
          <div className="md:col-span-2 flex justify-center">
            <button
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition disabled:bg-gray-400"
            >
              {loading ? "Saving…" : "Add School"}
            </button>
          </div>
        </form>

        {/* Success / Error Message */}
        {msg && (
          <p
            className={`mt-6 text-center font-medium ${
              msg.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
