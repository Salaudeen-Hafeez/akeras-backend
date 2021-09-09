import joi from '@hapi/joi';

// Validate the new user data
const userValidation = (data) => {
  const schema = joi.object({
    name: joi.string().min(6).required(),
    username: joi.string().required(),
    email: joi.string().required().email(),
    password: joi.string().min(6).required(),
  });

  const verified = schema.validate(data);
  return verified;
};

// Validate the user login data
const loginValidation = (data) => {
  const schema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().min(6).required(),
  });
  const verified = schema.validate(data);
  return verified;
};

// Validate the package data
const parcelValidation = (data) => {
  const schema = joi.object({
    username: joi.string().required(),
    name: joi.string().required(),
    location: joi.string().required(),
    destination: joi.string().required(),
    sender: joi.string().max(15).required(),
    reciever: joi.string().max(15).required(),
    frajile: joi.string().required(),
  });
  const verified = schema.validate(data);
  return verified;
};

const _userValidation = userValidation;
export { _userValidation as userValidation };
const _loginValidation = loginValidation;
export { _loginValidation as loginValidation };
const _parcelValidation = parcelValidation;
export { _parcelValidation as parcelValidation };
