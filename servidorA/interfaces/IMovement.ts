export interface ICreateMovement {
    authorizationNumber: string;
    movementDate: Date;
    accountFrom: string;
    accountTo: string;
    destinationBank: string;
    currency: string;
    amount: number;
}

export interface IMovement extends ICreateMovement {
    status: string;
}