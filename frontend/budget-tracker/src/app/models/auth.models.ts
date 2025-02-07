export interface AuthResponse {
    token: string;
}

export interface User {
    name?: string,
    email: string
    password: string;
}