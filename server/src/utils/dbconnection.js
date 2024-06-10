import mongoose from 'mongoose';
const db = process.env.mongoDB_url || "mongodb+srv://cloudvandana:cloudvandana@cluster0.kwfrpcs.mongodb.net/Email_Finder_and_Email_Verification?retryWrites=true&w=majority&appName=Cluster0PORT=6000";

const connectDB = async () => {
    try {
        console.log(db)
        await mongoose.connect(db);
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB;