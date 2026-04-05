import { Injectable } from '@angular/core';
import { EnumDto } from '../../../interfaces';
import { HttpService } from '../../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class MilitaryStatusesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/militarystatuses/';
    }


    get militaryStatuses() {
        return this.get<EnumDto[]>({ apiName: 'getAll' });
    }
}
