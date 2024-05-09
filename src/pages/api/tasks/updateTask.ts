import dbConnect from '@/libs/dbConnect'
import Task from '@/models/Task'
import { NextApiRequest, NextApiResponse } from 'next'

interface IUpdatedFields {
    title?: string
    isDone?: boolean
}

export default async function updateTask(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    await dbConnect()

    try {
        const { item, newTitle, isDone } = req.body

        let updatedFields: IUpdatedFields = {}

        if(newTitle !== undefined) {
            updatedFields.title = newTitle
        }

        if(isDone !== undefined) {
            updatedFields.isDone = isDone
        }

        const task = await Task.findByIdAndUpdate(item, updatedFields, { new: true })

        if (!task) {
            return res.status(404).json({ message: 'Task not found' })
        }

        res.status(200).json({ message: 'Task has been updated', updatedTask: task })
    } catch (error) {
        res.status(500).json({ message: 'Server error: An error occurred while processing your request.' })
    }
}
