import Task from '@/models/Task'
import dbConnect from '@/libs/dbConnect'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession, Session } from 'next-auth'
import Nextauth from '../auth/[...nextauth]'
import User from '@/models/User'

interface CustomUser {
    name: string
    email: string
    image?: string
}

interface CustomSession extends Session {
    user: CustomUser
}

export default async function readTask(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    await dbConnect()

    try {
        const session = await getServerSession(req, res, Nextauth) as CustomSession

        if (!session || !session.user) {
            return res.status(401).json({ message: "Unauthorized: No session or user information available." })
        }

        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return res.status(404).json({ message: "User not found: No user associated with the provided email." })
        }

        const tasks = await Task.find({ userId: user._id })
        res.status(200).json(tasks)
    } catch (error) {
        res.status(500).json({ message: 'Server error: An error occurred while processing your request.' })
    }
}
