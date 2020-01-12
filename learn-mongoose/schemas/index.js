const mongoose = require("mongoose");

module.exports = () => {
  const connect = () => {
    if (process.env.NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }

    mongoose.connect(
      "mongodb://@localhost:27017/admin",
      {
        dbName: "nodejs"
      },
      error => {
        if (eror) {
          console.log("error", error);
        } else {
          console.log("success");
        }
      }
    );
  };
  connect();
  mongoose.connection.on("error", error => {
    console.error("error", error);
  });
  mongoose.connection.on("disconnected", () => {
    console.error("disconnected");
    connect();
  });

  require("./user");
  require("./comment");
};
