const ENV_NAME = {
  PROD: "PROD",
  QA: "QA",
  DEV: "DEV"
};

const Environment = {
  [ENV_NAME.PROD]: {
    maintenanceBaseUrl: ".......", // needs to be changed before prod deployment
    baseAssetsUrl: "........"
  },
  [ENV_NAME.QA]: {
    maintenanceBaseUrl: "http://125.16.74.78/",
    baseAssetsUrl: "http://125.16.74.78/"
  },
  [ENV_NAME.DEV]: {
    maintenanceBaseUrl: "http://localhost:4555/",
    baseAssetsUrl: "http://localhost:4555/"
  }
};

const bootstrapEnv = () => {
  // console.log("Project Environment : ");
  // console.log(process.env.APP_ENV)
  // console.log(Environment[process.env.REACT_APP_ENV || ENV_NAME.DEV]);
  return Environment[process.env.REACT_APP_ENV || ENV_NAME.DEV];
};
export default bootstrapEnv();
