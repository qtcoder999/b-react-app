const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy("/provisionManager", {
      target: "http://10.5.245.166:8080",
      changeOrigin: true,
      secure: false,
      logLevel: "debug"
    })
  );
  app.use(
    proxy("/submit", {
      target: "http://10.5.245.166:9090/",
      changeOrigin: true,
      secure: false,
      logLevel: "debug"
    })
  );
};
