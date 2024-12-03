import { $Enums } from '@prisma/client';

export type BaseResponse = {
    message: string;
    data: object | null;
};

export type JwtPayload = {
    sub: number;
    role: $Enums.Role;
};

export type UserEntity = {
    id: number;
    role: $Enums.Role;
};
