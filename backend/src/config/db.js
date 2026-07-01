const mongose=require("mongoose")


function connectToDb(){
    mongose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("server is connected to mongo db");
    })
    .catch(err=>{
        console.log("Error in connecting to DB");
        console.log(err);
        process.exit(1);
    })
}
module.exports=connectToDb;