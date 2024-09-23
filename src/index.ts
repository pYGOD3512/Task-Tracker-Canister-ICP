import { v4 as uuidv4 } from 'uuid';
import { Server, StableBTreeMap, ic } from 'azle';
import express from 'express';

/**
 * `tasksStorage` - it's a key-value datastructure that is used to store tasks.
 * {@link StableBTreeMap} is used for storing tasks with the same benefits as described earlier (survives upgrades, efficient lookups).
 * Breakdown of the `StableBTreeMap(string, Task)` datastructure:
 * - the key of map is a `taskId`
 * - the value is the task itself `Task` that is related to a given key (`taskId`)
 *
 * Constructor values:
 * 1) 0 - memory id where to initialize the map.
 */

/**
 * Represents a task in the Task Tracker system.
 */
class Task {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    deadline: Date;
    status: 'pending' | 'completed';
    createdAt: Date;
    updatedAt: Date | null;
}

const tasksStorage = StableBTreeMap<string, Task>(0);

export default Server(() => {
    const app = express();
    app.use(express.json());

    // Create a new task
    app.post("/tasks", (req, res) => {
        const task: Task = {
            id: uuidv4(),
            createdAt: getCurrentDate(),
            status: 'pending',  // Default status is pending
            updatedAt: null,
            ...req.body
        };
        tasksStorage.insert(task.id, task);
        res.json(task);
    });

    // Get all tasks
    app.get("/tasks", (req, res) => {
        res.json(tasksStorage.values());
    });

    // Get a task by ID
    app.get("/tasks/:id", (req, res) => {
        const taskId = req.params.id;
        const taskOpt = tasksStorage.get(taskId);
        if ("None" in taskOpt) {
            res.status(404).send(`The task with id=${taskId} not found`);
        } else {
            res.json(taskOpt.Some);
        }
    });

    // Update a task by ID
    app.put("/tasks/:id", (req, res) => {
        const taskId = req.params.id;
        const taskOpt = tasksStorage.get(taskId);
        if ("None" in taskOpt) {
            res.status(400).send(`Couldn't update task with id=${taskId}. Task not found`);
        } else {
            const task = taskOpt.Some;
            const updatedTask = {
                ...task,
                ...req.body,
                updatedAt: getCurrentDate()
            };
            tasksStorage.insert(task.id, updatedTask);
            res.json(updatedTask);
        }
    });

    // Delete a task by ID
    app.delete("/tasks/:id", (req, res) => {
        const taskId = req.params.id;
        const deletedTask = tasksStorage.remove(taskId);
        if ("None" in deletedTask) {
            res.status(400).send(`Couldn't delete task with id=${taskId}. Task not found`);
        } else {
            res.json(deletedTask.Some);
        }
    });

    // Mark a task as completed
    app.put("/tasks/:id/complete", (req, res) => {
        const taskId = req.params.id;
        const taskOpt = tasksStorage.get(taskId);
        if ("None" in taskOpt) {
            res.status(400).send(`Couldn't mark task with id=${taskId} as completed. Task not found`);
        } else {
            const task = taskOpt.Some;
            task.status = 'completed';
            task.updatedAt = getCurrentDate();
            tasksStorage.insert(task.id, task);
            res.json(task);
        }
    });

    return app.listen();
});

// Function to get the current date from the IC timestamp
function getCurrentDate() {
    const timestamp = new Number(ic.time());
    return new Date(timestamp.valueOf() / 1000_000);
}
