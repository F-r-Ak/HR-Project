import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';
import { AccountDto, LoginDto, RefreshTokenDto, RegisterDto } from '../../interfaces';
import { UrlConfig } from '../../../core/interface/http/UrlConfig';

@Injectable({
    providedIn: 'root'
})
export class AccountService extends HttpService {
    protected get baseUrl(): string {
        return 'accounts/';
    }

    register(body: RegisterDto) {
        return this.post<RegisterDto, AccountDto>({ apiName: 'register', showAlert: true }, body);
    }

    addUserRole(body: any) {
        return this.post<any, AccountDto>({ apiName: 'addroletouser', showAlert: true }, body);
    }

    login(body: LoginDto) {
        return this.post<LoginDto, any>({ apiName: 'login', showAlert: true }, body);
    }

    refreshToken(body: RefreshTokenDto): Observable<any> {
        return this.post<RefreshTokenDto, any>({ apiName: 'refreshtoken', showAlert: true }, body);
    }

    getEditUser(id: string) {
        return this.get<any>({ apiName: `get/${id}` });
    }
    update(body: any) {
        return this.put({ apiName: 'updateuserpersonaldata', showAlert: true }, body);
    }

    UpdateUserPassword(body: any) {
        return this.put({ apiName: 'updateuserpassword', showAlert: true }, body);
    }

    RemoveRoleFromUser(body: any): Observable<any> {
        return this.delete({ apiName: 'removerolefromuser', showAlert: true }, body);
    }

    get tokenData() {
        return this.get<any[]>({ apiName: 'tokendata' });
    }
}
