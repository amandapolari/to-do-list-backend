# To-Do List Backend

## Processo de Desenvolvimento

-   [1. Resumo do projeto](#1-resumo-do-projeto)
-   [2. Planejamento](#2-planejamento)
    -   [Tabela](#tabela)
    -   [Descrição](#descrição)
-   [3. Instalações e Configurações](#instalações-e-configurações)
-   [4. Servidor: Express](#4-servidor-express)
-   [5. Query Builder: Knex](#5-query-builder-knex)
-   [6. Endpoints](#6-endpoints)
    -   [Get all users](#get-all-users)
        -   [Get all users | get user by id](#get-all-users--get-user-by-id)
    -   [Create user](#create-user)
    -   [Get all tasks](#get-all-tasks)
        -   [Get all tasks | Get task by title | Get task by description](#get-all-tasks--get-task-by-title--get-task-by-description)

## 1. Resumo do projeto

[🔼](#processo-de-desenvolvimento)

Este projeto consiste no desenvolvimento de uma API voltada para a gestão de tarefas em uma empresa. O objetivo principal é criar um back-end para uma aplicação de gestão de tarefas, permitindo o cadastro de membros da equipe e o registro das tarefas.

## 2. Planejamento

### Tabela

[🔼](#processo-de-desenvolvimento)

Inicialmente projetei uma **tabela** no site [dbdiagram.io](https://dbdiagram.io/d/to-do-list-backend-652dad15ffbf5169f0ce3bc3) planejando as relações entre as ententidades.

![table-site-dbdiagram-io](./src/images/to-do-list-backend.png)

### Descrição

[🔼](#processo-de-desenvolvimento)

Posteriormente utilizei o [Google Sheets](https://docs.google.com/spreadsheets/d/1bNO4TJ3oJtJqxPGkd8Q2vRyw_-Q51BWHV0UiJJUd2gE/edit?usp=sharing) para descrever mais detalhes sobre cada coluna das tabelas:

![table-google-sheets](./src/images/table-google-sheets.png)

## Instalações e Configurações

Configurar `.gitignore`

```
node_modules
.env
build
.DS_Store
* .db
package-lock.json
```

Criar `package.json`:

```bash
npm init -y
```

Configurar `package.json`:

```json
{
    "name": "to-do-list-backend",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "start": "tsc && node ./build/index.js",
        "dev": "ts-node-dev src/index.ts"
    },
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "@types/cors": "^2.8.14",
        "@types/express": "^4.17.17",
        "@types/knex": "^0.16.1",
        "@types/node": "^20.5.7",
        "ts-node-dev": "^2.0.0",
        "typescript": "^5.2.2"
    },
    "dependencies": {
        "cors": "^2.8.5",
        "express": "^4.18.2",
        "knex": "^3.0.1",
        "sqlite3": "^5.1.6"
    }
}
```

Instalar `package.json`:

```bash
npm i
```

Criar `tsconfig.json`:

```bash
npx tsc --init
```

Configurar `tsconfig.json`:

```json
{
    "compilerOptions": {
        "target": "es2016",
        "module": "commonjs",
        "rootDir": "./src",
        "outDir": "./build",
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true,
        "sourceMap": true,
        "noImplicitAny": true,
        "removeComments": true
    }
}
```

## 4. Servidor: Express

[🔼](#processo-de-desenvolvimento)

`src/index.ts`

```ts
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`);
});

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
```

`Terminal`

```bash
npm run dev
```

`Postman`

```json
// Request:
// GET /ping

// Response:
// status 200 OK
{
    "message": "Pong!"
}
```

## 5. Query Builder: Knex

[🔼](#processo-de-desenvolvimento)

Criar pasta para organizar arquivos do banco de dados:

`src/database`

Criar arquivos de configuração para banco de dados:

`src/database/to-do-list.db`

`src/database/to-do-list.sql`

Criar, popular e conectar as tabelas com a extensão `MySQL`:

`to-do-list.sql`

```sql
-- Active: 1697501723071@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );

CREATE TABLE
    tasks (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TEXT DATETIME DEFAULT (
            strftime(
                '%d-%m-%Y %H:%M:%S',
                'now',
                'localtime'
            )
        ) NOT NULL,
        status INTEGER DEFAULT (0) NOT NULL
    );

CREATE TABLE
    users_tasks (
        user_id TEXT NOT NULL,
        task_id TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (task_id) REFERENCES tasks (id)
    );

INSERT INTO
    users (id, name, email, password)
VALUES (
        'u001',
        'Lily',
        'lily@gmail.com',
        'lily123'
    ), (
        'u002',
        'Atlas',
        'atlas@gmail.com',
        'atlas123'
    );

INSERT INTO
    tasks (id, title, description)
VALUES (
        't001',
        'html',
        'Criar estrutura html do site'
    ), (
        't002',
        'style',
        'Estilizar header do site'
    ), (
        't003',
        'test',
        'Realizar teste de usabilidade'
    ), (
        't004',
        'deploy',
        'Hospedar site na Vercel'
    );

INSERT INTO
    users_tasks (user_id, task_id)
VALUES ('u001', 't001'), ('u002', 't002'), ('u001', 't003'), ('u002', 't003');

SELECT * FROM users;

SELECT * FROM tasks;

SELECT * FROM users_tasks;

DROP TABLE users;

DROP TABLE tasks;

DROP TABLE users_tasks;
```

Criar arquivo de conexão e configuração do `Knex`

`src/database/knex.ts`

```ts
import knex from 'knex';

export const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './src/database/to-do-list.db',
    },
    useNullAsDefault: true,
    pool: {
        min: 0,
        max: 1,
        afterCreate: (conn: any, cb: any) => {
            conn.run('PRAGMA foreign_keys = ON', cb);
        },
    },
});
```

Refatorando o endpoint de ping do `index.ts` para utilizar o `knex` e testar a conexão:

```ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './database/knex';

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`);
});

app.get('/ping', async (req: Request, res: Response) => {
    try {
        const result = await db('users');
        res.status(200).send({ message: 'Pong!', result });
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
```

`Postman`

```json
// Request:
// GET /ping

// Response:
// status 200 OK
{
    "message": "Pong!",
    "result": [
        {
            "id": "u001",
            "name": "Lily",
            "email": "lily@gmail.com",
            "password": "lily123"
        },
        {
            "id": "u002",
            "name": "Atlas",
            "email": "atlas@gmail.com",
            "password": "atlas123"
        }
    ]
}
```

`index.ts`

Após obter o resultado desejado, deixar as configurações de query builder e desfazer o retorno de users no endpoint de ping:

```ts
(...)
app.get('/ping', async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: 'Pong!' });
    } catch (error) {
(...)
```

## 6. Endpoints

### Get all users

#### Get all users | get user by id

[🔼](#processo-de-desenvolvimento)

`index.ts`

```ts
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
```

#### Funcionalidade 1: Visualizar todos os usuários

Esta requisição retorna todos os usuários cadastrados no sistema:

`Postman`

```json
// Request:
// GET /users

// Response:
// status 200 OK
[
    {
        "id": "u001",
        "name": "Lily",
        "email": "lily@gmail.com",
        "password": "lily123"
    },
    {
        "id": "u002",
        "name": "Atlas",
        "email": "atlas@gmail.com",
        "password": "atlas123"
    }
]
```

#### Funcionalidade 2: Visualizar usuários selecionados

Esta requisição retorna os usuários que possuem nomes correspondentes à busca requisitada por query params:

`Postman`

```json
// Request:
// GET /users?q=lily

// Response:
// status 200 OK
[
    {
        "id": "u001",
        "name": "Lily",
        "email": "lily@gmail.com",
        "password": "lily123"
    }
]
```

### Create user

[🔼](#processo-de-desenvolvimento)

`types.ts`

```ts
export type TUsers = {
    id: string;
    name: string;
    email: string;
    password: string;
};

export type TTasks = {
    id: string;
    title: string;
    description: string;
    created_at: string | any;
    status: boolean | number;
};

export type TUsersTasks = {
    user_id: string;
    task_id: string;
};
```

`validations.ts`

```ts
import { TUsers, TTasks, TUsersTasks } from './types';
import { Response } from 'express';

// 📌 Precisa ser uma string
export const isString = (
    element: string,
    nameElement: string,
    res: Response
): void => {
    if (typeof element !== 'string') {
        res.statusCode = 400;
        throw new Error(`${nameElement} precisa ser uma string`);
    }
};

// 📌 Precisa ser um number
export const isNumber = (
    element: string | number | undefined | null,
    nameElement: string,
    res: Response
): void => {
    if (typeof element !== 'number') {
        res.statusCode = 400;
        throw new Error(`${nameElement} precisa ser um número`);
    }
};

// 📌 Não pode estar em branco
export const isNotEmpty = (
    element: string | number | undefined | null,
    nameElement: string,
    res: Response
) => {
    if (element === undefined || element === null) {
        res.statusCode = 400;
        throw new Error(`${nameElement} não pode ficar vazio`);
    }
    const inputNoSpaces = String(element).trim();
    if (inputNoSpaces === '') {
        res.statusCode = 400;
        throw new Error(`${nameElement} não pode ficar vazio`);
    }
};

// 📌 Precisa ser único
// ESSE SÓ VERIFICA ID
export const isUniqueId = (
    element: string | number | undefined | null,
    nameElement: string,
    array: TUsers[] | TTasks[],
    res: Response
) => {
    const elementExists = array.find((item) => item.id === element);
    if (elementExists !== undefined) {
        res.statusCode = 400;
        throw new Error(`${nameElement} já cadastrado`);
    }
};

// 📌 Precisa ser único
// ESSE SÓ VERIFICA E-MAIL
export const isUniqueEmail = (
    element: string | number | undefined | null,
    nameElement: string,
    array: TUsers[],
    res: Response
) => {
    const elementExists = array.find((item) => item.email === element);
    if (elementExists !== undefined) {
        res.statusCode = 400;
        throw new Error(`${nameElement} já cadastrado`);
    }
};

//  📌 Precisa ter uma quantidade mínima de caracteres
export const checkMinimumLength = (
    element: string,
    nameElement: string,
    minimumQuantity: number,
    res: Response
) => {
    if (element.length < Number(minimumQuantity)) {
        res.statusCode = 400;
        throw new Error(
            `O ${nameElement} precisa ter no mínimo ${minimumQuantity} caracteres`
        );
    }
};

// => ID
// 📌 Precisa iniciar com um string específica (u ou prod)
export const checkPrefixId = (
    element: string,
    nameElement: string,
    prefix: string,
    res: Response
) => {
    if (!element.startsWith(prefix)) {
        res.statusCode = 400;
        throw new Error(`O ${nameElement} precisa iniciar com "${prefix}"`);
    }
};

// => EMAIL
// 📌 Precisa ter um @gmail | @hotmail | @outlook
export const checkEmail = (
    element: string,
    nameElement: string,
    res: Response
) => {
    const regex = /@(gmail|hotmail|outlook)\.com$/;
    if (!regex.test(element)) {
        res.statusCode = 400;
        throw new Error(
            `O ${nameElement} precisa ser do tipo "gmail", "hotmail" ou "outlook" `
        );
    }
};

// => PASSWORD
// 📌 Deve possuir pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial.
export const checkPassword = (
    element: string,
    nameElement: string,
    res: Response
) => {
    if (
        !element.match(
            // /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).+$/
            /^.{6,}$/
        )
    ) {
        res.statusCode = 400;
        throw new Error(
            // `O ${nameElement} deve possuir pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial`
            `O ${nameElement} deve possuir pelo menos 6 caracteres`
        );
    }
};

// => FUNÇÕES
// 📌 Verificar existência
export const checkElementExists = (
    element: string,
    nameElement: string,
    array: TUsers[] | TTasks[],
    res: Response
) => {
    const elementExists = array.find((item) => item.id === element);
    if (elementExists === undefined) {
        res.statusCode = 400;
        throw new Error(`O ${nameElement} não existe`);
    }
};
```

`index.ts`

```ts
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
```

`Postman`

```json
// Request:
// POST /users
// body JSON
{
    "id": "u003",
    "name": "Verity",
    "email": "verity@gmail.com",
    "password": "verity123"
}

// Response:
// status 201 CREATED
{
    "message": "User criado com sucesso",
    "user": {
        "id": "u003",
        "name": "Verity",
        "email": "verity@gmail.com",
        "password": "verity123"
    }
}
```

### Delete user by id

[🔼](#processo-de-desenvolvimento)

`index.ts`

```ts
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
```

`Postman`

```json
// Request:
// path params = :id
// DELETE /users/u004

// Response:
// status 200 ok
{
    "message": "User deletado com sucesso"
}
```

### Get all tasks

#### Get all tasks | Get task by title | Get task by description

[🔼](#processo-de-desenvolvimento)

`index.ts`

```ts
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
```

#### Funcionalidade 1

`Postman`

```json
// Request:
// GET /tasks

// Response:
// status 200 OK
[
    {
        "id": "t001",
        "title": "html",
        "description": "Criar estrutura html do site",
        "created_at": "16-10-2023 21:18:25",
        "status": 0
    },
    {
        "id": "t002",
        "title": "style",
        "description": "Estilizar header do site",
        "created_at": "16-10-2023 21:18:25",
        "status": 0
    },
    {
        "id": "t003",
        "title": "test",
        "description": "Realizar teste de usabilidade",
        "created_at": "16-10-2023 21:18:25",
        "status": 0
    },
    {
        "id": "t004",
        "title": "deploy",
        "description": "Hospedar site na Vercel",
        "created_at": "16-10-2023 21:18:25",
        "status": 0
    }
]
```

#### Funcionalidade 2

`Postman`

```json
// Request:
// GET /tasks?q=style

// Response:
// status 200 OK
[
    {
        "id": "t002",
        "title": "style",
        "description": "Estilizar header do site",
        "created_at": "16-10-2023 21:18:25",
        "status": 0
    }
]
```

#### Funcionalidade 3

`Postman`

```json
// Request:
// GET /tasks?q=criar

// Response:
// status 200 OK
[
    {
        "id": "t001",
        "title": "html",
        "description": "Criar estrutura html do site",
        "created_at": "16-10-2023 21:18:25",
        "status": 0
    }
]
```
