import mongoose from "mongoose";

export async function mongooseConnect() {
  const uri = process.env.MONGODB_URI!;

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    return mongoose
      .connect(uri, {})
      .then(() => {
        console.log("connnected to mongoDB");
      })
      .catch((err) => console.log("impossible to connect to mongoDB"));
  }
}
