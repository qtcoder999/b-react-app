const ENV_NAME = {
  PROD: "PROD",
  QA: "QA",
  DEV: "development"
};

const Environment = {
  [ENV_NAME.PROD]: {
    verificationBaseUrl: "http://10.5.245.166:8080/", // needs to be changed before prod deployment
    sumbitBaseUrl: "http://10.5.245.166:9090/",
    baseAssetsUrl: "http://10.5.245.166:8080/"
  },
  [ENV_NAME.QA]: {
    verificationBaseUrl: "http://10.5.245.166:8080/",
    sumbitBaseUrl: "http://10.5.245.166:9090/",
    baseAssetsUrl: "http://10.5.245.166:8080/"
  },
  [ENV_NAME.DEV]: {
    verificationBaseUrl: "http://10.5.245.166:8080/",
    sumbitBaseUrl: "http://10.5.245.166:9090/",
    baseAssetsUrl: "http://10.5.245.166:8080/"
  }
};

const bootstrapEnv = () => {
  // console.log("Project Environment : ");
  // console.log(process.env.APP_ENV)
  console.log(process.env);
  return Environment[process.env.REACT_APP_ENV || ENV_NAME.DEV];
};
export default bootstrapEnv();
