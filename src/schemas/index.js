import * as yup from "yup";

export const facilitySchema = yup.object().shape({
  name: yup.string().required().min(4).label("Name"),
  address: yup.string().required().min(4).label("Address"),
  city: yup.string().required().min(4).label("City"),
  //state:  Yup.array().min(1, 'Please select a State').label("State"),
  zip: yup.string().required().min(4).label("Zip code"),
  numOfUnits: yup
    .number()
    .positive()
    .integer()
    .required()
    .label("Number of unts"),
  images: yup.array().min(1, "Please supply an image"),
});
