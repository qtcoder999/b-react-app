const proxy = require("http-proxy-middleware");
module.exports = function(app) {
  app.use(proxy("/provisionManager", { target: "http://10.5.245.166:8080" }));
};
