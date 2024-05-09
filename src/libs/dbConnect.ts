import mongoose from 'mongoose'

const MONGO_URL = process.env.MONGO_URL as string

export default async function dbConnect() {
    try {
        await mongoose.connect(MONGO_URL)
    } catch (error) {
        console.error('Error while connecting.', error)
    }
}