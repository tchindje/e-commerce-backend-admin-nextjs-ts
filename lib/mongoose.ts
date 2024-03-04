import mongoose from "mongoose";

export async function mongooseConnect() {
  const uri = process.env.MONGODB_URI!;

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    return mongoose
      .connect(uri, {})
      .then(() => {
        console.log("Connnected to mongoDB sucessfully.");
      })
      .catch((err) => console.log("Impossible to connect to mongoDB."));
  }
}
