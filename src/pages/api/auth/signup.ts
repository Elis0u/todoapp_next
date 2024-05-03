import User from '@/models/User'
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import dbConnect from '@/libs/dbConnect'

export default async function signup(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method !== 'POST') {
        res.status(405).end()
        return
    }

    await dbConnect()

    const { email, username, password } = req.body

    if (password.length < 8) {
        res.status(400).json({ message: 'Error! Password must be at least 8 characters' })
        return
    }

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(422).json({ message: 'Email already in use.' })
            return
        }

        const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10)
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const createdUser = await User.create({ email, username, password: hashedPassword })

        const userResponse = { ...createdUser.toObject(), password: undefined }
        res.status(200).json(userResponse)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}
