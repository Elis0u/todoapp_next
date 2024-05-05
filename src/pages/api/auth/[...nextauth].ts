import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@/libs/dbConnect'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
// import DiscordProvider from 'next-auth/providers/discord'

// const scopes = ['identify'].join(' ')

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

                if (!email || !password){
                    throw new Error('Please enter an email or password')
                }

                const user = await User.findOne({ email: email })

                const passwordMatch = await bcrypt.compare(password, user.password)

                if(!user || !passwordMatch) {
                    throw new Error('Please retry')
                }

                return { id: user._id.toString(), name: user.username, email: user.email }

            },
        }),
        // DiscordProvider({
        //     clientId: process.env.DISCORD_CLIENT_ID || '',
        //     clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
        //     authorization: {params: {scope: scopes}},
        // }),
    ],
    callbacks: {
        async jwt({token, user, session}) {
            if (user) {
                return {
                    ...token,
                    id: user.id
                }
            }
            return token
        },
        async session({session, token, user}) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id
                }
            }
            return session
        }
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
})