import Task, { ITask } from '@/models/Task'
import dbConnect from '@/libs/dbConnect'
import type { NextApiRequest, NextApiResponse } from 'next'
import User from '@/models/User'
import { getServerSession } from "next-auth/next"
import NextAuth from '../auth/[...nextauth]'
import { Session } from 'next-auth'


interface CustomUser {
    name: string
    email: string
    image?: string
}

interface CustomSession extends Session {
    user: CustomUser
}

export default async function addTask(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method Not Allowed: Only POST requests are accepted at this endpoint.' })
        return
    }

    await dbConnect()

    const session = await getServerSession(req, res, NextAuth) as CustomSession

    try {
        const email = session?.user.email
        const userId = await User.findOne({ email })
        const newTaskData: Partial<ITask> = {
            title: req.body.title,
            userId: userId
        };
        await Task.create({ title: req.body.title, userId: userId })
        res.status(200).json(newTaskData)
    } catch (error) {
        res.status(500).json({ message: 'Server error: An error occurred while processing your request.' })
    }
}