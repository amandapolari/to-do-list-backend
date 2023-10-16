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

![table-site-dbdiagram-io](./images/to-do-list-backend.png)

### Descrição

[🔼](#processo-de-desenvolvimento)

Posteriormente utilizei o [Google Sheets](https://docs.google.com/spreadsheets/d/1bNO4TJ3oJtJqxPGkd8Q2vRyw_-Q51BWHV0UiJJUd2gE/edit?usp=sharing) para descrever mais detalhes sobre cada coluna das tabelas:

![table-google-sheets](./images/table-google-sheets.png)

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

