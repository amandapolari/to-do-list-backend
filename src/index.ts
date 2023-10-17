import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './database/knex';
import { checkMinimumLength, isNotEmpty, isString } from './validations';
import { TUsers } from './types';

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`);
});

// => TEST:
app.get('/ping', async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: 'Pong!' });
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

// => Get all users:
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
