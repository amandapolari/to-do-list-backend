import { Response } from 'express';

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
