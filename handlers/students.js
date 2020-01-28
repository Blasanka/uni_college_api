const { admin, db } = require("../util/admin");

const firebaseConfig = require("../util/config");

const { validateAddStudentData } = require("../util/validators");

exports.getAllStudents = (req, res) => {
  db.collection("students")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let students = [];
      data.forEach(doc => {
        let docData = doc.data();
        students.push({
          studentId: doc.id,
          fullname: docData.fullname,
          nic: docData.nic,
          index: docData.index,
          department: docData.department,
          address: docData.address,
          email: docData.email,
          mobile_number: docData.mobile_number,
          parents_number: docData.parents_number,
          dob: docData.dob,
          gender: docData.gender,
          religion: docData.religion,
          imageUrl: docData.imageUrl,
          createdBy: docData.createdBy,
          userHandle: docData.userHandle,
          createdAt: docData.createdAt
        });
      });
      return res.json(students);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.postOneStudent = (req, res) => {
  const newStudent = {
    fullname: req.body.fullname,
    nic: req.body.nic,
    index: req.body.index,
    department: req.body.department,
    address: req.body.address,
    email: req.body.email,
    mobile_number: req.body.mobile_number,
    parents_number: req.body.parents_number,
    dob: req.body.dob,
    gender: req.body.gender,
    religion: req.body.religion,
    imageUrl: req.body.imageUrl,
    createdAt: new Date().toISOString()
  };

  const { valid, errors } = validateAddStudentData(newStudent);

  if (!valid) return res.status(400).json(errors);

  db.collection("students")
    .add(newStudent)
    .then(doc => {
      const resStudent = newStudent;
      resStudent.studentId = doc.id;
      return res.json(resStudent);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong!" });
    });
};

exports.getStudent = (req, res) => {
  let studentData = {};
  db.doc(`/students/${req.params.studentId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Student not found!" });
      }
      studentData = doc.data();
      studentData.studentId = doc.id;
      return res.json(studentData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.deleteStudent = (req, res) => {
  const document = db.doc(`/students/${req.params.studentId}`);

  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Student not found!" });
      }
      if (req.user.handle !== doc.data().userHandle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Student deleted successfully!" });
    })
    .catch(err => {
      res.status(500).json({ error: err.code });
    });
};

//Upload a student profile image
exports.uploadStudentImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  let imageFileName;
  let imageToBeUploaded;

  const busboy = new BusBoy({ headers: req.headers });
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname);
    console.log(filename);
    console.log(mimetype);
    const fileSplitted = filename.split(".");
    const imageExtension = fileSplitted[fileSplitted.length - 1];
    imageFileName = `${Math.round(Math.random() * 10000000)}.${imageExtension}`;
    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket(firebaseConfig.storageBucket)
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        return imageUrl;
      })
      .then(url => {
        return res.json({ imageUrl: url });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

exports.updateStudentImage = (req, res) => {
  const imageUrl = {
    imageUrl: req.body.imageUrl
  };

  db.doc(`students/${req.body.studentId}`)
    .update({ imageUrl })
    .then(() => {
      return res.json({ message: "Image uploaded succesfully!" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong!" });
    });
};
