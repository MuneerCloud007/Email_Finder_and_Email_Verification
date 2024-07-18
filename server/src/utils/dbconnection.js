import mongoose from 'mongoose';
// const db = "mongodb+srv://cloudvandana:cloudvandana@cluster0.kwfrpcs.mongodb.net/Email_Finder_and_Email_Verification?retryWrites=true&w=majority&appName=Cluster0PORT=6000";
const db="mongodb://127.0.0.1:27017/Email_Verification?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2"
const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB;