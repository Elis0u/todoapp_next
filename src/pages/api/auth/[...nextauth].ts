import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@/libs/dbConnect'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import DiscordProvider from 'next-auth/providers/discord'

const scopes = ['identify'].join(' ')

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'Votre email' },
                password: { label: 'Password', type: 'password', placeholder: 'Votre mot de passe' },
            },
            async authorize(credentials, req) {
                await dbConnect()

                const email = credentials?.email as string
                const password = credentials?.password as string

                const user = await User.findOne({ email: email })

                if (user && await bcrypt.compare(password, user.password)) {
                    return { id: user._id, name: user.username, email: user.email }
                }

                return null
            },
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID || '',
            clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
            authorization: {params: {scope: scopes}},
        }),
    ],

    pages: {
        signIn: '/login',
    },
})