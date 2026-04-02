import { Injectable } from '@angular/core';
import { EnumDto } from '../../../interfaces';
import { HttpService } from '../../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class FamilyRelationshipService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/family-relationships/';
    }


    get FamilyRelationships() {
        return this.get<EnumDto[]>({ apiName: 'getAll' });
    }
}
