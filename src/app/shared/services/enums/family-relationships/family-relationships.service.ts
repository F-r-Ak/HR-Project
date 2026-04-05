import { Injectable } from '@angular/core';
import { EnumDto } from '../../../interfaces';
import { HttpService } from '../../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class FamilyRelationshipsService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/familyrelationships/';
    }


    get familyRelationships() {
        return this.get<EnumDto[]>({ apiName: 'getAll' });
    }
}
