import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function SignIn() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showError, setShowError] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
            callbackUrl: `${window.location.origin}/`
        })

        if (!result?.error) {
            router.push('/')
        } else {
            setShowError(true)
        }
    }

    return (
        <>
            <div className='flex flex-col gap-5 text-center text-white max-w-xl mx-auto'>
                <h2 className='uppercase font-bold text-2xl'>Login</h2>
                <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                    <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {showError &&
                        <>
                            <div className='w-100 text-red-600 text-center mb-3'>Invalid email and/or password</div>
                        </>
                    }
                    <button className='bg-primary text-third btn-skew' type="submit">
                        <span className='block skew-inverse'>
                            Login
                        </span>
                    </button>
                </form>
                <div className='h-px bg-slate-300'></div>
                <p>
                    Don&apos;t have an account ? <Link href="/register" className="text-primary"> Sign up</Link>
                </p>
                {/* <div className='text-center text-white'>or login with provider</div>
                <button className='bg-discord text-white btn-skew w-full' onClick={() => signIn('discord', { callbackUrl: `${window.location.origin}/` })}>
                    <span className='block skew-inverse'>
                        Login with discord
                    </span>
                </button> */}
            </div>
        </>
    )
}