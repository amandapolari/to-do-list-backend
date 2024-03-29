import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './database/knex';
import {
    checkMinimumLength,
    checkPrefixId,
    isNotEmpty,
    isNumber,
    isString,
} from './validations';
import { TTasks, TTasksWithUsers, TUsers, TUsersTasks } from './types';

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`);
});

// ==> enpoints para: users

// => Get all users | Get user by id
app.get('/users', async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.q as string | undefined;
        if (!searchTerm) {
            const result = await db('users');
            res.status(200).send(result);
        } else {
            const result = await db('users').where(
                'name',
                'LIKE',
                `%${searchTerm}%`
            );
            res.status(200).send(result);
        }
    } catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// => Create user
app.post('/users', async (req: Request, res: Response) => {
    try {
        const { id, name, email, password } = req.body;

        // => validações
        // id
        isNotEmpty(id, 'id', res);
        isString(id, 'id', res);
        checkMinimumLength(id, 'id', 4, res);
        const [idAlreadyExists]: TUsers[] | undefined = await db('users').where(
            { id }
        );
        if (idAlreadyExists) {
            res.status(400);
            throw new Error('O "id" não está disponível');
        }

        // name
        isNotEmpty(name, 'name', res);
        isString(name, 'name', res);
        checkMinimumLength(name, 'name', 2, res);

        // email
        isNotEmpty(email, 'email', res);
        isString(email, 'email', res);
        const [emailAlreadyExists]: TUsers[] | undefined = await db(
            'users'
        ).where({ email });
        if (emailAlreadyExists) {
            res.status(400);
            throw new Error('O "email" não está disponível');
        }

        // password
        isNotEmpty(password, 'password', res);
        isString(password, 'password', res);
        checkMinimumLength(password, 'password', 4, res);

        // => funcionalidades:
        const newUser: TUsers = {
            id,
            name,
            email,
            password,
        };
        await db('users').insert(newUser);
        res.status(201).send({
            message: 'User criado com sucesso',
            user: newUser,
        });
    } catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// => Delete user by id
app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id;

        const [idAlreadyExists]: TUsers[] | undefined = await db('users').where(
            { id: idToDelete }
        );
        if (!idAlreadyExists) {
            res.status(404);
            throw new Error('O "id" fornecido não está cadastrado no sistema');
        }

        await db('users').del().where({ id: idToDelete });
        res.status(200).send({
            message: 'User deletado com sucesso',
        });
    } catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// ==> enpoints para: tasks

// => Get all tasks | Get task by title | Get task by description
app.get('/tasks', async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.q as string | undefined;
        if (!searchTerm) {
            const result = await db('tasks');
            res.status(200).send(result);
        } else {
            const result = await db('tasks')
                .where('title', 'LIKE', `%${searchTerm}%`)
                .orWhere('description', 'LIKE', `%${searchTerm}%`);
            res.status(200).send(result);
        }
    } catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// => Create task
app.post('/tasks', async (req: Request, res: Response) => {
    try {
        const { id, title, description } = req.body;

        // validações:
        // id
        isNotEmpty(id, 'id', res);
        isString(id, 'id', res);
        checkMinimumLength(id, 'id', 4, res);
        checkPrefixId(id, 'id', 't', res);
        const [idAlreadyExists]: TTasks[] | undefined = await db('tasks').where(
            { id }
        );
        if (idAlreadyExists) {
            res.status(400);
            throw new Error('O "id" não está disponível');
        }

        // title
        isNotEmpty(title, 'title', res);
        isString(title, 'title', res);
        checkMinimumLength(title, 'title', 2, res);

        // description
        isNotEmpty(description, 'description', res);
        isString(description, 'description', res);
        checkMinimumLength(description, 'description', 2, res);

        // lógica:
        const newTask = {
            id,
            title,
            description,
        };
        await db('tasks').insert(newTask);

        const [insertedTask] = await db('tasks').where({ id });

        res.status(201).send({
            message: 'Task criada com sucesso',
            task: insertedTask,
        });
    } catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// => Edit task by id
app.put('/tasks/:id', async (req: Request, res: Response) => {
    try {
        // capturando dados:
        const idToEdit = req.params.id;
        const newId = req.body.id;
        const newTitle = req.body.title;
        const newDescription = req.body.description;
        const newCreatedAt = req.body.createdAt;
        const newStatus = req.body.status;

        // validações:

        // task
        const [task]: TTasks[] | undefined[] = await db('tasks').where({
            id: idToEdit,
        });
        if (!task) {
            res.status(404);
            throw new Error('O id fornecido não está registrado no sistema');
        }

        // id
        if (newId !== undefined) {
            isString(newId, 'newId', res);
            checkMinimumLength(newId, 'newId', 4, res);
            checkPrefixId(newId, 'newId', 't', res);
            const [idAlreadyExists]: TTasks[] | undefined = await db(
                'tasks'
            ).where({ id: idToEdit });
            if (idAlreadyExists) {
                res.status(400);
                throw new Error('O "id" não está disponível');
            }
        }

        // title
        if (newTitle !== undefined) {
            isString(newTitle, 'newTitle', res);
            checkMinimumLength(newTitle, 'newTitle', 2, res);
        }

        // description
        if (newDescription !== undefined) {
            isString(newDescription, 'newDescription', res);
            checkMinimumLength(newDescription, 'newDescription', 2, res);
        }
        // createdAt
        if (newCreatedAt !== undefined) {
            isString(newCreatedAt, 'newCreatedAt', res);
        }

        // status
        if (newStatus !== undefined) {
            isNumber(newStatus, 'newStatus', res);
        }

        // lógica:
        const newTask: TTasks = {
            id: newId || task.id,
            title: newTitle || task.title,
            description: newDescription || task.description,
            created_at: newCreatedAt || task.created_at,
            status: isNaN(newStatus) ? task.status : newStatus,
        };
        await db('tasks').update(newTask).where({ id: idToEdit });

        res.status(200).send({
            message: 'Task atualizada com sucesso',
            task: newTask,
        });
    } catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// => Delete task by id
app.delete('/tasks/:id', async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id;

        const [idAlreadyExists]: TTasks[] | undefined = await db('tasks').where(
            { id: idToDelete }
        );
        if (!idAlreadyExists) {
            res.status(404);
            throw new Error('O "id" fornecido não está cadastrado no sistema');
        }

        await db('users_tasks').del().where({ task_id: idToDelete });
        await db('tasks').del().where({ id: idToDelete });
        res.status(200).send({
            message: 'Task deletada com sucesso',
        });
    } catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// => Add user to task by id
app.post(
    '/tasks/:taskId/users/:userId',
    async (req: Request, res: Response) => {
        try {
            const taskId = req.params.taskId;
            const userId = req.params.userId;

            // => validações:

            // taskId
            checkPrefixId(taskId, 'taskId', 't', res);
            isNotEmpty(taskId, 'taskId', res);
            checkMinimumLength(taskId, 'taskId', 4, res);
            const [idTaskAlreadyExists]: TTasks[] | undefined = await db(
                'tasks'
            ).where({ id: taskId });
            if (!idTaskAlreadyExists) {
                res.status(400);
                throw new Error(
                    'O "taskId" fornecido não está cadastrado no sistema'
                );
            }

            // userId
            checkPrefixId(userId, 'userId', 'u', res);
            isNotEmpty(userId, 'userId', res);
            checkMinimumLength(userId, 'userId', 4, res);
            const [idUserAlreadyExists]: TUsers[] | undefined = await db(
                'users'
            ).where({ id: userId });
            if (!idUserAlreadyExists) {
                res.status(400);
                throw new Error(
                    'O "userId" fornecido não está cadastrado no sistema'
                );
            }

            // Verificar se o usuário já recebeu a tarefa
            const [existingUserTask]: TUsersTasks[] | undefined = await db(
                'users_tasks'
            ).where({ user_id: userId, task_id: taskId });

            if (existingUserTask) {
                res.status(400);
                throw new Error('O usuário já recebeu essa tarefa');
            }

            // lógica:
            const newUserTask: TUsersTasks = {
                user_id: userId,
                task_id: taskId,
            };
            await db('users_tasks').insert(newUserTask);
            res.status(201).send({
                message: 'User atribuído à tarefa com sucesso',
                user: newUserTask,
            });
        } catch (error) {
            console.log(error);
            if (req.statusCode === 200) {
                res.status(500);
            }
            if (error instanceof Error) {
                res.send(error.message);
            } else {
                res.send('Erro inesperado');
            }
        }
    }
);

// => Remove user from task by id
app.delete(
    '/tasks/:taskId/users/:userId',
    async (req: Request, res: Response) => {
        try {
            const taskId = req.params.taskId;
            const userId = req.params.userId;

            // => validações

            // taskId
            checkPrefixId(taskId, 'taskId', 't', res);
            isNotEmpty(taskId, 'taskId', res);
            checkMinimumLength(taskId, 'taskId', 4, res);
            const [idTaskAlreadyExists]: TTasks[] | undefined = await db(
                'tasks'
            ).where({ id: taskId });
            if (!idTaskAlreadyExists) {
                res.status(400);
                throw new Error(
                    'O "taskId" fornecido não está cadastrado no sistema'
                );
            }

            // userId
            checkPrefixId(userId, 'userId', 'u', res);
            isNotEmpty(userId, 'userId', res);
            checkMinimumLength(userId, 'userId', 4, res);
            const [idUserAlreadyExists]: TUsers[] | undefined = await db(
                'users'
            ).where({ id: userId });
            if (!idUserAlreadyExists) {
                res.status(400);
                throw new Error(
                    'O "userId" fornecido não está cadastrado no sistema'
                );
            }

            // lógica:
            await db('users_tasks')
                .del()
                .where({ user_id: userId })
                .andWhere({ task_id: taskId });
            res.status(200).send({
                message: 'User removido da tarefa com sucesso',
            });
        } catch (error) {
            console.log(error);
            if (req.statusCode === 200) {
                res.status(500);
            }
            if (error instanceof Error) {
                res.send(error.message);
            } else {
                res.send('Erro inesperado');
            }
        }
    }
);

// => Get tasks with users
app.get('/tasks/users', async (req: Request, res: Response) => {
    try {
        // Resgatando todas as tasks:
        const tasks: TTasks[] = await db('tasks');
        // console.log(tasks);

        // Preparando um array para receber o resultado dos dois "for":
        const result: TTasksWithUsers[] = [];

        // Percorrendo a lista de "users_tasks" (identificada nesse caso como "tasks"), afim de obter o "id do usuário" (identificada como "users_tasks" nesse caso), que é o responsável pela task:
        for (let task of tasks) {
            const responsibles = [];
            const users_tasks: TUsersTasks[] = await db('users_tasks').where({
                task_id: task.id,
            });
            // console.log(users_tasks);

            // Com o "user_task" (que é o id do usuário responsável pela task), vou consultar a tabela "users" para obter mais detalhes como "name", "email", ... :
            for (let user_task of users_tasks) {
                const [user]: TUsers[] = await db('users').where({
                    id: user_task.user_id,
                });
                // console.log(user);

                responsibles.push(user);
            }

            // Modelando resutado para colocar dentro do array "result":
            const newTaskWithUsers: TTasksWithUsers = {
                ...task,
                responsibles,
            };
            result.push(newTaskWithUsers);
        }
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});
