import appConfig from "../config/appConfig";
import axios from "axios";

export const APIConst = {
  checkIfDomainIsValid: `${appConfig.verificationBaseUrl}provisionManager/customer/GSUITE/`,
  submitOrder: `${appConfig.sumbitBaseUrl}submit`
};

export const checkIfDomainIsValid = domain => {
  return axios({
    method: "get",
    url: APIConst.checkIfDomainIsValid + domain
  });
};

export const submitOrder = payload => {
  return axios({
    method: "post",
    url: APIConst.submitOrder,
    data: payload
  });
};
