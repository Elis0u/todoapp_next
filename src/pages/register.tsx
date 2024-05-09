import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function RegisterPage() {
    const router = useRouter()
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ username, setUsername ] = useState('')
    const [ showError, setShowError ] = useState(false)

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, username, password })
        })

        if (res.ok) {
            router.push('/login')
        } else {
            console.error('Erreur lors de l’enregistrement')
            setShowError(true)
        }
    }


    return (
        <>
            <div className='flex flex-col gap-5 text-center text-white max-w-xl mx-auto'>
                <h2 className='text-center text-white text-2xl'>Register</h2>
                <form className='flex flex-col gap-5' onSubmit={handleFormSubmit}>
                    <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {showError &&
                        <>
                            <div className='w-100 text-red-600 text-center mb-3'>Error, please try again</div>
                        </>
                    }
                    <button className='bg-primary text-third btn-skew' type="submit">
                        <span className='block skew-inverse'>
                            Register
                        </span>
                    </button>
                </form>
                <p>
                    You have an already account ? <Link href="/login" className="text-primary"> Sign in</Link>
                </p>
            </div>
        </>
    )
}