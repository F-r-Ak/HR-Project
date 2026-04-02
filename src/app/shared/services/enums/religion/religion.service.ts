import { Injectable } from '@angular/core';
import { EnumDto } from '../../../interfaces';
import { HttpService } from '../../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class ReligionService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/religion/';
    }


    get Religions() {
        return this.get<EnumDto[]>({ apiName: 'getAll' });
    }
}
