import { Injectable } from '@angular/core';
import { AddFamilyDto, FamilyDto, UpdateFamilyDto, GetPagedBody } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class FamiliesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/families/';
    }

    getFamily(id: string) {
        return this.get<FamilyDto>({ apiName: `Get/${id}` });
    }

    getEditFamily(id: string) {
        return this.get<FamilyDto>({ apiName: `getEdit/${id}` });
    }

    get families() {
        return this.get<FamilyDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddFamilyDto) {
        return this.post<AddFamilyDto, FamilyDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateFamilyDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `delete/`, showAlert: true }, id);
    }
}
