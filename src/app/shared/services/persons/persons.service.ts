import { Injectable } from '@angular/core';
import { AddPersonDto, PersonDto, UpdatePersonDto, GetPagedBody } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class PersonsService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/persons/';
    }

    getPerson(id: string) {
        return this.get<PersonDto>({ apiName: `Get/${id}` });
    }

    getEditPerson(id: string) {
        return this.get<PersonDto>({ apiName: `getEdit/${id}` });
    }

    get persons() {
        return this.get<PersonDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddPersonDto) {
        return this.post<AddPersonDto, PersonDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdatePersonDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `delete/`, showAlert: true }, id);
    }
}
