import joi from '@hapi/joi';

const userValidation = (data) => {
  const schema = joi.object({
    name: joi.string().min(6).required(),
    username: joi.string().min(6).required(),
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
  });

  const verified = schema.validate(data);
  return verified;
};

const loginValidation = (data) => {
  const schema = joi.object({
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
  });
  const verified = schema.validate(data);
  return verified;
};

const parcelValidation = (data) => {
  const schema = joi.object({
    username: joi.string().min(6).required(),
    name: joi.string().min(6).required(),
    location: joi.string().min(6).required(),
    destination: joi.string().min(6).required(),
    sender: joi.string().max(11).required(),
    reciever: joi.string().max(11).required(),
    frajile: joi.string(),
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
