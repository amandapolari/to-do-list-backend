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
    status: number;
};

export type TUsersTasks = {
    user_id: string;
    task_id: string;
};
