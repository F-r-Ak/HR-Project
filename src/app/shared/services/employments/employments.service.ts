import { Injectable } from '@angular/core';
import { AddEmploymentDto, EmploymentDto, UpdateEmploymentDto, GetPagedBody } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class EmploymentsService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/employments/';
    }

    getEmployment(id: string) {
        return this.get<EmploymentDto>({ apiName: `Get/${id}` });
    }

    getEditEmployment(id: string) {
        return this.get<EmploymentDto>({ apiName: `getEdit/${id}` });
    }

    get employments() {
        return this.get<EmploymentDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddEmploymentDto) {
        return this.post<AddEmploymentDto, EmploymentDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateEmploymentDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `delete/`, showAlert: true }, id);
    }
}
