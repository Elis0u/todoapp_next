import dbConnect from "@/libs/dbConnect";
import Task from "@/models/Task";
import { NextApiRequest, NextApiResponse } from "next";

export default async function deleteTask(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    await dbConnect()

    try {
        const taskId = req.body.item;
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task has been deleted" });
    } catch (error) {
        res.status(500).json({ message: 'Server error: An error occurred while processing your request.' });
    }
}