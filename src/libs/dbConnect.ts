import mongoose from 'mongoose'

const MONGO_URL = process.env.MONGO_URL as string

export default async function dbConnect() {
    try {
        await mongoose.connect(MONGO_URL)
        console.log('Connected to db.')
    } catch (error) {
        console.log('Error while connecting.', error)
    }
}