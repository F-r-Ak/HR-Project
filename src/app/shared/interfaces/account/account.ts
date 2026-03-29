import { Lookup, SharedProperties } from '../shared/shared';

export interface AccountDto extends Lookup, Partial<SharedProperties> {
    Email: string;
    Password: string;
    RoleId: string;
    Username: string;
}
export interface LoginDto extends Lookup, Partial<SharedProperties> {
    Email: string;
    Password: string;
}

export interface RegisterDto extends Lookup, Partial<SharedProperties> {
    Email: string;
    Password: string;
    RoleId: string;
    Username: string;
}

export interface RefreshTokenDto extends Lookup, Partial<SharedProperties> {
    isLogedIn: Boolean;
    accessToken: string;
    refreshToken: string;
}
export interface UpdateAccountDto extends Lookup, Partial<SharedProperties> {}
