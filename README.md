# Task Tracker Canister

**Task Tracker Canister** is a decentralized task management system built using the Internet Computer (IC) platform. This project allows users to create, manage, update, and track tasks with a clear structure, making it a useful tool for personal task management or team collaboration.

It leverages **REST APIs** combined with **TypeScript**, **Azle**, **Express**, and the **Internet Computer Protocol** to ensure decentralized computation and data storage, bringing increased efficiency and speed to task management.

## Features

### Task Management

- **Create Tasks**: Users can add new tasks with details such as title, description, category, priority, and deadline.
- **Retrieve Tasks**: Fetch all tasks or specific tasks by task ID.
- **Update Tasks**: Modify task details, such as updating its description or priority.
- **Complete Tasks**: Mark tasks as completed.
- **Delete Tasks**: Remove tasks from the system.

## Technology Stack

- **TypeScript**: Type-safe JavaScript for easier code management.
- **Azle**: A framework for developing canisters on the Internet Computer using TypeScript.
- **Express**: Minimal web framework for building REST APIs.
- **Internet Computer**: Decentralized cloud infrastructure for scalable web applications.

## Installation

To set up and run the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/task-tracker-canister.git

2. **Install dependencies: Navigate to the project folder and install Node.js packages**:
      ```bash
      cd task-tracker-canister
      npm install
      ```

3. **Start the Internet Computer locally: Use DFX to start the local Internet Computer network**: 
      ```bash
      dfx start --host 127.0.0.1:8000 --clean --background
      ```

4. **Deploy the canister: Deploy the canister code to the local IC instance**:
      ```bash
      dfx deploy
      ```

## Usage

### Accessing the Canister

Once the canister is deployed, you can make API requests to interact with the task tracker. Follow these steps to get the URL and start using it:

1. **Get the deployed canister's ID**:
      ```bash
      dfx canister id task_tracker
      ```

2. **Replace the canister ID in the following URL format**:

   ```bash
   http://<CANISTER_ID>.localhost:8000
   ```

    **Example CANISTER_ID (bkyz2-fmaaa-aaaaa-qaaaq-cai)**
    ```
    http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:8000
    ```

## API Endpoints

### 1. Create a Task

- **Method**: `POST`
- **Endpoint**: `/tasks`
- **Description**: Creates a new task.

  **Request Body**:
  ```json
  {
    "title": "Complete IC project",
    "description": "Finalize the Internet Computer project",
    "category": "work",
    "priority": "high",
    "deadline": "2023-12-31T23:59:59Z"
  }

**Example**
  ```bash
  curl -X POST http://<CANISTER_ID>.localhost:8000/tasks -H "Content-Type: application/json" -d '{"title": "Complete IC project", "description": "Finalize the Internet Computer project", "category": "work", "priority": "high", "deadline": "2023-12-31T23:59:59Z"}'
  ```

### 2. Retrieve All Tasks

- **Method**: `GET`
- **Endpoint**: `/tasks`
- **Description**: Retrieves all tasks.

**Example**
  ```bash
  curl -X GET http://<CANISTER_ID>.localhost:8000/tasks
  ```

### 3. Retrieve a Task by ID

- **Method**: `GET`
- **Endpoint**: `/tasks/:id`
- **Description**: Retrieves a specific task by its ID.

**Example**
  ```bash
  curl -X GET http://<CANISTER_ID>.localhost:8000/tasks/<TASK_ID>
  ```

### 4. Update a Task by ID

- **Method**: `PUT`
- **Endpoint**: `/tasks/:id`
- **Description**: Updates a task by its ID.

  **Request Body**:
  ```json
  {
    "description": "Updated task description",
    "priority": "medium"
  }
  ```

  **Example**
  ```bash
  curl -X PUT http://<CANISTER_ID>.localhost:8000/tasks/<TASK_ID>  -H "Content-Type: application/json"  -d '{"description": "Updated task description", "priority": "medium"}'
  ```

### 5. Mark a Task as Completed

- **Method**: `PUT`
- **Endpoint**: `/tasks/:id/complete`
- **Description**: Marks a task as completed.

  **Example**
  ```bash
  curl -X PUT http://<CANISTER_ID>.localhost:8000/tasks/<TASK_ID>/complete
  ```

### 6. Delete a Task by ID

- **Method**: `DELETE`
- **Endpoint**: `/tasks/:id`
- **Description**: Deletes a task by its ID.

  **Example**
  ```bash
  curl -X DELETE http://<CANISTER_ID>.localhost:8000/tasks/<TASK_ID>
  ```

## Contributions

I welcome contributions to this project! If you’d like to get involved, please follow these steps:

1. Fork the repository.
2. Create a new branch for your changes.
3. Make your modifications.
4. Submit a pull request.
