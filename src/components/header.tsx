import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
    const { data: session } = useSession()
    console.log(session)
    return (
        <header className="flex items-center justify-between py-4 px-4">
            <h1 className="text-primary text-2xl font-bold">TODOAPP</h1>
            <div className="flex items-center gap-2">
                {session ? (
                    <>
                        <p className="text-white mr-4">{session?.user?.name}</p>
                        {session?.user?.image && (
                            <div className="rounded-full overflow-hidden h-10 w-10 mr-4">
                                <Image
                                    src={session?.user?.image}
                                    alt="User Profile Image"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            </div>
                        )}
                        <button onClick={() => signOut()} className="text-white bg-red-500 px-4 py-2 rounded btn-skew">
                            <div className='skew-inverse text-third font-bold uppercase'>
                                Logout
                            </div>
                        </button>
                    </>
                ) : (
                    <Link href="/login" className="bg-primary text-third px-8 btn-skew">
                        <span className='block skew-inverse'>
                            Login
                        </span>
                    </Link>
                )}
            </div>
        </header>
    )
}
