import { useState } from 'react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { ITask } from '@/models/Task'
import { getSession, useSession } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

interface HomeProps {
    tasks: ITask[]
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const cookies = ctx.req ? ctx.req.headers.cookie : undefined
    const res = await fetch('http://localhost:3000/api/tasks/readTask', {
        headers: {
            cookie: cookies || ""
        }
    })

    const session = await getSession(ctx)
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    if (!res.ok) {
        return { props: { tasks: [] } }
    }

    const tasks = await res.json()
    return { props: { tasks } }
}

export default function Home({ tasks }: HomeProps) {
    const [taskList, setTaskList] = useState(tasks || [])
    const [title, setTitle] = useState<string>('');
    const { data: session } = useSession()

    const fetchTasks = async (): Promise<void> => {
        try {
            const response = await fetch('http://localhost:3000/api/tasks/readTask')
            const tasks: ITask[] = await response.json()
            setTaskList(tasks)
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        const email = session?.user?.email
        e.preventDefault()
        try {
            await fetch('http://localhost:3000/api/tasks/addTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, email }),
            })

            await fetchTasks()
            setTitle('')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className='flex flex-col gap-5 text-center text-white max-w-xl mx-auto'>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <button className='bg-primary text-third p-2 rounded' type="submit">
                        <span>
                            <FontAwesomeIcon icon={faPlus} />
                        </span>
                    </button>
                </form>
                <ul>
                    {taskList.length > 0 ? (
                        taskList.map((task: ITask) => (
                            <li key={task._id}>{task.title} - {task.isDone ? "Done" : "Not Done"}</li>
                        ))
                    ) : (
                        <li>No tasks to display</li>
                    )}
                </ul>
            </div>

        </>
    )
}
