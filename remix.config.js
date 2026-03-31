/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  // Add this line to fix the ESM warning and server crash:
  serverDependenciesToBundle: [/^@material\/web.*/, /^lit.*/, /^@lit.*/],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};
