# To-Do List Backend

## Processo de Desenvolvimento

-   [1. Resumo do projeto](#1-resumo-do-projeto)
-   [2. Planejamento](#2-planejamento)
    -   [Tabela](#tabela)
    -   [Descrição](#descrição)
-   [3. Instalações e Configurações](#instalações-e-configurações)
-   [4. Servidor: Express](#4-servidor-express)
-   [5. Query Builder: Knex](#5-query-builder-knex)

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
