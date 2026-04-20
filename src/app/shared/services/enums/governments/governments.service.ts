import { Injectable } from '@angular/core';
import { EnumDto } from '../../../interfaces';
import { HttpService } from '../../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class GovernmentsService extends HttpService {
    protected get baseUrl(): string {
        return 'governments/';
    }


    get governments() {
        return this.get<EnumDto[]>({ apiName: 'getAll' });
    }
}
