import { v4 as uuidv4 } from 'uuid';
import { Server, StableBTreeMap, ic } from 'azle';
import express, { Request, Response, NextFunction } from 'express';

/**
 * `tasksStorage` - it's a key-value datastructure that is used to store tasks.
 * {@link StableBTreeMap} is used for storing tasks with the same benefits as described earlier (survives upgrades, efficient lookups).
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

// Initialize the tasks storage map with memory id 0.
const tasksStorage = StableBTreeMap<string, Task>(0);

const app = express();
app.use(express.json());

/**
 * Error handling middleware
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.message);
    res.status(500).json({ error: err.message });
});

/**
 * Utility function to get the current date from the IC timestamp.
 */
function getCurrentDate(): Date {
    const timestamp = Number(ic.time());
    return new Date(timestamp / 1000_000); // Convert from nanoseconds to milliseconds
}

/**
 * Validates task input data.
 */
function validateTaskInput(task: Partial<Task>): string[] {
    const errors: string[] = [];
    if (!task.title || typeof task.title !== 'string') {
        errors.push('Title is required and must be a string.');
    }
    if (!task.description || typeof task.description !== 'string') {
        errors.push('Description is required and must be a string.');
    }
    if (!task.category || typeof task.category !== 'string') {
        errors.push('Category is required and must be a string.');
    }
    if (!['low', 'medium', 'high'].includes(task.priority)) {
        errors.push('Priority must be either low, medium, or high.');
    }
    if (!task.deadline || isNaN(new Date(task.deadline).getTime())) {
        errors.push('Deadline must be a valid date.');
    }
    return errors;
}

/**
 * Helper function to fetch a task by ID.
 */
function getTaskById(taskId: string): Task | null {
    const taskOpt = tasksStorage.get(taskId);
    return 'None' in taskOpt ? null : taskOpt.Some;
}

/**
 * Create a new task
 */
app.post("/tasks", (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validateTaskInput(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const task: Task = {
            id: uuidv4(),
            createdAt: getCurrentDate(),
            status: 'pending', // Default status is pending
            updatedAt: null,
            ...req.body
        };

        tasksStorage.insert(task.id, task);
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
});

/**
 * Get all tasks
 */
app.get("/tasks", (req: Request, res: Response) => {
    res.json(tasksStorage.values());
});

/**
 * Get a task by ID
 */
app.get("/tasks/:id", (req: Request, res: Response) => {
    const taskId = req.params.id;
    const task = getTaskById(taskId);
    if (!task) {
        return res.status(404).send(`Task with id=${taskId} not found`);
    }
    res.json(task);
});

/**
 * Update a task by ID
 */
app.put("/tasks/:id", (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const task = getTaskById(taskId);
        if (!task) {
            return res.status(404).send(`Task with id=${taskId} not found`);
        }

        const errors = validateTaskInput(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const updatedTask: Task = {
            ...task,
            ...req.body,
            updatedAt: getCurrentDate(),
        };

        tasksStorage.insert(task.id, updatedTask);
        res.json(updatedTask);
    } catch (error) {
        next(error);
    }
});

/**
 * Delete a task by ID
 */
app.delete("/tasks/:id", (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const deletedTask = tasksStorage.remove(taskId);
        if ('None' in deletedTask) {
            return res.status(404).send(`Task with id=${taskId} not found`);
        }
        res.json(deletedTask.Some);
    } catch (error) {
        next(error);
    }
});

/**
 * Mark a task as completed
 */
app.put("/tasks/:id/complete", (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const task = getTaskById(taskId);
        if (!task) {
            return res.status(404).send(`Task with id=${taskId} not found`);
        }

        task.status = 'completed';
        task.updatedAt = getCurrentDate();
        tasksStorage.insert(task.id, task);
        res.json(task);
    } catch (error) {
        next(error);
    }
});

/**
 * Start the server and handle any startup errors
 */
export default Server(() => {
    return app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
});
