import React, { useState } from "react"; // Ensure useState is imported
import PropTypes from "prop-types";
import { updateEmployee } from "../services/employeeService";

const EditEmployee = ({ employee, onClose, onUpdate }) => {
  const designations = ["Developer", "Designer", "Tester", "HR"];
  const courses = ["BTECH", "MTECH"];

  const [formData, setFormData] = useState({
    name: employee.name || "",
    email: employee.email || "",
    mobile: employee.mobile || "",
    designation: employee.designation || "",
    course: Array.isArray(employee.course) ? employee.course : [],
    gender: employee.gender || "",
    image: employee.image || "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile" && value !== "" && !/^\d+$/.test(value)) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      course: checked
        ? prev.course.includes(value)
          ? prev.course
          : [...prev.course, value]
        : prev.course.filter((course) => course !== value),
    }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.mobile.length < 10) {
      setError("Mobile number must be at least 10 digits");
      return;
    }

    const uniqueCourses = [...new Set(formData.course)];

    try {
      setLoading(true);
      const data = new FormData();
      for (const key in formData) {
        if (key === "course") {
          uniqueCourses.forEach((course) => data.append("course", course));
        } else {
          data.append(key, formData[key]);
        }
      }
      if (image) {
        data.append("image", image);
      }
      await updateEmployee(employee._id, data);
      setSuccess("Employee updated successfully!");
      setTimeout(() => {
        onUpdate();
        onClose();
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-8 rounded-xl shadow-2xl max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">Edit Employee</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 text-lg font-bold"
        >
          ×
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-200 border border-red-400 text-red-800 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-200 border border-green-400 text-green-800 px-4 py-2 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1">
            Mobile *
          </label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
            required
            maxLength={15}
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1">
            Designation *
          </label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
            required
          >
            <option value="">Select Designation</option>
            {designations.map((designation) => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1">
            Course *
          </label>
          <div className="flex flex-wrap gap-4">
            {courses.map((course) => (
              <label key={course} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="course"
                  value={course}
                  checked={formData.course.includes(course)}
                  onChange={handleCourseChange}
                  className="rounded focus:ring-blue-300"
                />
                {course}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1">
            Gender *
          </label>
          <div className="flex gap-6">
            {["Male", "Female", "Other"].map((gender) => (
              <label key={gender} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={handleChange}
                  required
                  className="rounded focus:ring-blue-300"
                />
                {gender}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1">
            Image
          </label>
          {formData.image ? (
            <img
              src={`http://localhost:5001/${formData.image}`}
              alt={formData.name}
              className="w-24 h-24 rounded-full object-cover mb-2"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-800 mb-2">
              {formData.name.charAt(0).toUpperCase()}
            </div>
          )}
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          />
          {image && (
            <div className="mt-2">
              <p className="text-gray-700">New Image Preview:</p>
              <img
                src={URL.createObjectURL(image)}
                alt="New Preview"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

EditEmployee.propTypes = {
  employee: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditEmployee;
