import { SuccessResponse } from "./success-response";

export interface LoginResponse extends SuccessResponse {
    token: string;
    isAdmin: boolean;
}