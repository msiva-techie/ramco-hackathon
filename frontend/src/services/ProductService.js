import axios from "axios";

export const getProducts = async data => {
  try {
    let response = await axios.post("http://localhost:3001/products", {});
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getResult = async data => {
  try {
    // console.log("data...", data);
    // let direction = `${data.latitude} ${data.longitude}`;
    // let parts = direction.split(/[^\d\w]+/);
    // let lat = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
    // let lng = ConvertDMSToDD(parts[4], parts[5], parts[6], parts[7]);
    // DD = d + (min/60) + (sec/3600)
    // console.log("latitude...", lat);
    // console.log("longitude...", lng);
    let response = await axios.post("http://localhost:8085/result", {
      //   latitude: 13.085561,
      //   longitude: 80.208929,
      latitude: data.latitude,
      longitude: data.longitude,
      product: data.productName,
      quantity: data.count
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};
