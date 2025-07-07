import mongoose from  'mongoose'

export async function connectDB(){
    try {
        const db_uri = process.env.MONGO_URI
        if(!db_uri){
            throw new Error("Connection String missing")
        }
        await mongoose.connect(db_uri)
        console.log("DB connected Successfully")
    } catch (error) {
        console.error(error)
    }
}