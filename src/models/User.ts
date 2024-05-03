import mongoose, { Schema } from 'mongoose'

interface IUser {
    email: string;
    username: string;
    password: string;
}

const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: [ true, 'Please provide an username' ],
    },
    email: {
        type: String,
        required: [ true, 'Please provide an email address' ],
        match: [ /^\S+@\S+\.\S+$/, 'Please provide a valid email address' ]
    },
    password: {
        type: String,
        required: [ true, 'Please provide a password' ],
        minLength: [ 8, 'Password must be at least 8 characters long' ]
    }
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', UserSchema)
