export const handelFileUpload = async (req, res, next) => {
  let fileList = [];

  const url = req.protocol + "://" + req.get("host");

  for (var i = 0; i < req.files?.length; i++) {
    fileList.push(url + "/uploads/" + req.files[i].filename);
  }
  try {
    res.status(200).json(fileList);
  } catch (err) {
    next(err);
  }
};
