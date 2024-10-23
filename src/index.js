
import dotenv from 'dotenv';
import connectDB from './db.index.js';

dotenv.config({
    path: "./env"
})

connectDB()

// const app = express()

// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("Errors", (error) => {
//            console.log("ERRS", error);
//            throw error
//         });
// //        application listening ------------
//        app.listen(process.env.PORT, () => {
//          console.log(`Server Started At PORT 8000 ${process.env.PORT}`);
         
//        })
//     } catch (error) {
//         console.error("Error", error);
//         throw error
//     }
// } )()


    