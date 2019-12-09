import appConfig from "../config/appConfig";
import axios from "axios";

export const APIConst = {
  checkIfDomainIsValid: `${appConfig.maintenanceBaseUrl}provisionManager/customer/GSUITE/`,
  submitOrder: `${appConfig.maintenanceBaseUrl}submit`
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
    url: "http://demo6914374.mockable.io/submit",
    data: payload
  });
};
