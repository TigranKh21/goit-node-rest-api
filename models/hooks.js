export const handleSaveError = (error, data, next) => {
  const { name, code } = error;
  error.status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  console.log(error.message);
  next();
};

export const setUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidatiors = true;
  next();
};
