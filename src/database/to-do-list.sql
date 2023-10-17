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
        FOREIGN KEY (task_id) REFERENCES tasks (id) ON UPDATE CASCADE ON DELETE CASCADE
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

-- DELETE FROM users_tasks WHERE task_id='t001'