import mongoose, { Schema, Types, Document } from 'mongoose'

export interface ITask extends Document {
    title: string;
    userId: Types.ObjectId;
    isDone: boolean;
}

const TaskSchema: Schema<ITask> = new Schema({
    title: {
        type: String,
        required: [ true, 'Please provide an username' ],
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    isDone: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export default mongoose.models.Task || mongoose.model('Task', TaskSchema)
