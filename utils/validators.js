module.exports.validateRegisterInput = (
  userName,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (userName.trim() === "") {
    errors.userName = "User Name Must Not be Empty";
  }

  if (email.trim() === "") {
    errors.email = "Email Must Not be Empty";
  } else {
    const regex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regex)) {
      errors.email = "Email must valid email address";
    }
  }
  if (password === "") {
    errors.password = "Password must be provided";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Password Must match";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (userName, password) => {
  const errors = {};
  if (userName.trim() === "") {
    errors.userName = "Username must be provided";
  }
  if (password.trim() === "") {
    errors.password = "Password must be provided";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
