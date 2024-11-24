import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  course: {
    type: [String],
    required: true,
    enum: ['BCA', 'MCA', 'BSC'], // Restrict courses to BCA, MCA, BSC
    validate: {
      validator: function(v) {
        return Array.isArray(v) && new Set(v).size === v.length;
      },
      message: 'Courses must be unique.',
    },
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String, // Store relative image path
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Employee', employeeSchema);
