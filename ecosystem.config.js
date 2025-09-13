module.exports = {
  apps: [
    {
      name: "next-app",
      script: "cmd",
      args: "/c npm run start",
      cwd: "C:\\inetpub\\wwwroot\\silver",
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};