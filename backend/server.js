import app from "./app.js";
import mongoose from "mongoose";
//db connection

const connectDb = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connection successfull");
    }
    catch(err){
        console.error("Couldn't connect to db");
        console.log(err);
        process.exit(1);
    }
}


app.listen(process.env.PORT, () => {
    console.log(`server initiated at port ${process.env.PORT}`);
    connectDb();
});
