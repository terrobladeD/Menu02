module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "123456",
    DB: "menudb2",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };

  // this is the db in aws
  // module.exports = {
  //   HOST: "3.26.131.96",
  //   USER: "remoteuser",
  //   PASSWORD: "Qaz980423,",
  //   DB: "menudb",
  //   dialect: "mysql",
  //   pool: {
  //     max: 5,
  //     min: 0,
  //     acquire: 30000,
  //     idle: 10000
  //   }
  // };
  