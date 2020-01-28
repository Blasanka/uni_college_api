const functions = require("firebase-functions");
const app = require("express")();

const cors = require("cors");
app.use(cors());

const {
  getAllStudents,
  postOneStudent,
  uploadStudentImage,
  updateStudentImage,
  getStudent,
  deleteStudent
} = require("./handlers/students");
const {
  login,
  addUserDetails,
  getAuthenticatedUser
} = require("./handlers/users");
const FBAuth = require("./util/fbAuth");

// student routes
app.get("/students", getAllStudents);
app.post("/student", postOneStudent);
app.post("/student/image", uploadStudentImage);
app.post("/student/update_image", updateStudentImage);
app.get("/student/:studentId", getStudent);
app.delete("/student/:studentId", FBAuth, deleteStudent);

// users handle route
app.post("/login", login);
app.get("/user", FBAuth, getAuthenticatedUser);

// This is the api url patter when we use export.api -> https:baseurl.com/api/
exports.api = functions.region("asia-east2").https.onRequest(app);
