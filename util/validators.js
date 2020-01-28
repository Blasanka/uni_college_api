const isEmpty = string => {
  if (string.trim() === "") return true;
  else return false;
};

const isEmail = email => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email.match(emailRegEx)) return true;
  else return false;
};

exports.validateSignUpData = data => {
  const errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty!";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address!";
  }

  if (isEmpty(data.password)) errors.password = "Must not be empty!";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords must match";
  if (isEmpty(data.handle)) errors.handle = "Must not be empty";

  // if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = data => {
  const errors = {};

  if (isEmpty(data.email)) errors.email = "Must not be empty!";
  else if (!isEmail(data.email)) errors.email = "Must be valid email address!";

  if (isEmpty(data.password)) errors.password = "Must not be empty";

  // if (Object.keys(errors).length > 0) return res.status(400).json(errors);
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.reduceUserDetails = data => {
  let userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) != "http") {
      userDetails.website = `http://${data.website}`;
    } else userDetails.website = data.website;
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};

exports.validateAddStudentData = data => {
  const errors = {};

  if (isEmpty(data.fullname)) errors.fullname = "Must not be empty!";
  if (isEmpty(data.nic)) errors.nic = "Must not be empty";
  if (isEmpty(data.index)) errors.index = "Must not be empty!";
  if (isEmpty(data.department)) errors.department = "Must not be empty";
  if (isEmpty(data.address)) errors.address = "Must not be empty!";
  if (isEmpty(data.mobile_number)) errors.mobile_number = "Must not be empty";
  if (isEmpty(data.parents_number))
    errors.parents_number = "Must not be empty!";
  if (isEmpty(data.dob)) errors.dob = "Must not be empty";
  if (isEmpty(data.gender)) errors.gender = "Must not be empty";
  if (isEmpty(data.religion)) errors.religion = "Must not be empty";

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty!";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address!";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
