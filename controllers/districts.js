import District from "../models/Disticts.js";


export const postDistricts = async (req, res, next) => {

  const data = new District(req.body);

  try {
    await data.save();

    res.status(200).json({ message: "success", result: true });
  } catch (err) {
    next(err);
  }
};

export const getDistricts = async (req, res, next) => {
  try {
    const d = await District.find();
    res.status(200).json(d);
  } catch (err) {
    next(err);
  }



}
export const getDistrictsById = async (req, res, next) => {
  let perams = req.params.id
  try {
    const d = await District.find({ _id: perams });


    res.status(200).json(d);
  } catch (err) {
    next(err);
  }
}

export const updateDistricts = async (req, res, next) => {

  let photo = req.body.photo;
  let details = req.body.details



  try {
    const updatedDistricts = await District.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { details, photo } },
      { new: true }
    );
    res.status(200).json({ success: true, message: "successfully updated", updatedDistricts });
  } catch (err) {
    next(err);
  }
};


