import { useState } from 'react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { ITask } from '@/models/Task'
import { getSession, useSession } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faPenToSquare, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'

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
    const [taskList, setTaskList] = useState(tasks || []);
    const [title, setTitle] = useState<string>('');
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [updatedTitle, setUpdatedTitle] = useState<string>("");
    const { data: session } = useSession();

    const fetchTasks = async (): Promise<void> => {
        try {
            const response = await fetch('http://localhost:3000/api/tasks/readTask');
            const tasks: ITask[] = await response.json();
            setTaskList(tasks);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        const email = session?.user?.email;
        e.preventDefault();
        try {
            await fetch('http://localhost:3000/api/tasks/addTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, email }),
            });

            await fetchTasks();
            setTitle('');
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async (item: ITask['_id']) => {
        try {
            await fetch('http://localhost:3000/api/tasks/deleteTask', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ item }),
            });
            await fetchTasks();
        } catch (error) {
            console.error(error);
        }
    }

    const handleUpdateTitle = (taskId: string, currentTitle: string) => {
        setEditingTaskId(taskId);
        setUpdatedTitle(currentTitle);
    }

    const handleSubmitUpdate = async (e: React.FormEvent<HTMLFormElement>, taskId: string) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:3000/api/tasks/updateTask', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ item: taskId, newTitle: updatedTitle }),
            });
            await fetchTasks();
            setEditingTaskId(null);
            setUpdatedTitle("");
        } catch (error) {
            console.error(error);
        }
    }

    const handleToggleIsDone = async (taskId: string, isDone: boolean) => {
        try {
            await fetch('http://localhost:3000/api/tasks/updateTask', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ item: taskId, isDone: !isDone }),
            });
            await fetchTasks();
        } catch (error) {
            console.error(error);
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
                <ul className='flex flex-col gap-3'>
                    {taskList.length > 0 ? (
                        taskList.map((task: ITask) => (
                            <li key={task._id} className={`border border-third rounded p-3 flex justify-between items-center hover:bg-third ${task.isDone ? 'done-task' : ''}`}>
                                <div className='flex items-center gap-3'>
                                    <span className=' flex items-center cursor-pointer border p-2 rounded hover:bg-zinc-600' onClick={() => handleToggleIsDone(task._id, task.isDone)}>
                                        {task.isDone ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faXmark} />}
                                    </span>
                                    {editingTaskId === task._id ? (
                                        <form onSubmit={(e) => handleSubmitUpdate(e, task._id)}>
                                            <input type="text" placeholder="title" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} />
                                            <button className='bg-primary text-third p-2 rounded' type="submit">update</button>
                                        </form>
                                    ) : (
                                        <span className={task.isDone ? 'done-title' : ''}>{task.title}</span>
                                    )}
                                </div>
                                {editingTaskId === task._id ? (
                                    <>
                                        <span className='text-red-600 cursor-pointer' onClick={() => setEditingTaskId(null)}><FontAwesomeIcon icon={faXmark} /></span>
                                    </>
                                ) : (
                                    <>
                                        <div className='flex gap-3 items-center'>
                                            <span className='text-white cursor-pointer flex items-center' onClick={() => handleUpdateTitle(task._id, task.title)}><FontAwesomeIcon icon={faPenToSquare} /></span>
                                            <span className='text-red-600 cursor-pointer flex items-center' onClick={() => handleDelete(task._id)}><FontAwesomeIcon icon={faTrash} /></span>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))
                    ) : (
                        <li>No tasks to display</li>
                    )}
                </ul>
            </div>
        </>
    )
}
