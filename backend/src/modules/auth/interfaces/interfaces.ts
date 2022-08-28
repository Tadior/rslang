export interface JWTResponce {
    message: string;
    token: string;
    refreshToken?: string;
    userId: string;
    name: string;
}

export interface IUserSignIn {
    id: string;
    name?: string;
    email: string;
    password?: string;
}

export interface IPayload {
    email: string;
    userId: string;
}
