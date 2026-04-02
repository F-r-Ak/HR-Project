import { Injectable } from '@angular/core';
import { EnumDto } from '../../../interfaces';
import { HttpService } from '../../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class GovernmentService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/governments/';
    }


    get Governments() {
        return this.get<EnumDto[]>({ apiName: 'getAll' });
    }
}
