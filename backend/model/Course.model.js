import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  id: Number,
  name: String,
  title: String,
  price: Number,
  category: String,
  image: String,
  bookUrl: String
});

// Maps to "courses" collection
const Course = mongoose.model("Courses", CourseSchema);

export default Course;
