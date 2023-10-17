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
