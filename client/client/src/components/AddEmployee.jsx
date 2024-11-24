import React, { useState } from "react";
import PropTypes from "prop-types";
import { addEmployee } from "../services/employeeService";

const AddEmployee = ({ onClose, onAdd }) => {
  const designations = ["Developer", "Designer", "Tester", "HR"];
  const courses = ["BTECH", "MTECH"];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    course: [],
    gender: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile" && value !== "" && !/^\d*$/.test(value)) return;
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
        ? [...prev.course, value]
        : prev.course.filter((course) => course !== value),
    }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const data = new FormData();
      for (const key in formData) {
        if (key === "course") {
          formData.course.forEach((course) => data.append("course", course));
        } else {
          data.append(key, formData[key]);
        }
      }
      if (image) {
        data.append("image", image);
      }
      const result = await addEmployee(data);
      setSuccess("Employee added successfully!");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        designation: "",
        course: [],
        gender: "",
      });
      setImage(null);
      onAdd && onAdd(result.employee);
    } catch (error) {
      setError(
        error.response?.data?.error?.message || "Failed to add employee"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg mx-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
      <h2 className="text-2xl font-bold mb-6">Add Employee</h2>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-gray-700 mb-1">Mobile *</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            maxLength={15}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Designation */}
        <div>
          <label className="block text-gray-700 mb-1">Designation *</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Designation</option>
            {designations.map((designation) => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>
        </div>

        {/* Course */}
        <div>
          <label className="block text-gray-700 mb-1">Course *</label>
          <div className="flex flex-wrap">
            {courses.map((course) => (
              <label key={course} className="flex items-center mr-4 mb-2">
                <input
                  type="checkbox"
                  name="course"
                  value={course}
                  checked={formData.course.includes(course)}
                  onChange={handleCourseChange}
                  className="mr-2"
                />
                {course}
              </label>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-700 mb-1">Gender *</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
                required
                className="mr-2"
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
                required
                className="mr-2"
              />
              Female
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Other"
                checked={formData.gender === "Other"}
                onChange={handleChange}
                required
                className="mr-2"
              />
              Other
            </label>
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block text-gray-700 mb-1">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Adding..." : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

AddEmployee.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func,
};

export default AddEmployee;
