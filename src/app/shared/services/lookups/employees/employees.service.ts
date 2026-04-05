import { Injectable } from '@angular/core';
import { AddEmployeeDto, EmployeeDto, UpdateEmployeeDto, GetPagedBody } from '../../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class EmployeesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/employees/';
    }

    getEmployee(id: string) {
        return this.get<EmployeeDto>({ apiName: `Get/${id}` });
    }

    getEditEmployee(id: string) {
        return this.get<EmployeeDto>({ apiName: `getEdit/${id}` });
    }

    get employees() {
        return this.get<EmployeeDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    getDropDownByFilter(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdownbyfilter`, showAlert: true }, body);
    }

    add(body: AddEmployeeDto) {
        return this.post<AddEmployeeDto, EmployeeDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateEmployeeDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `delete/`, showAlert: true }, id);
    }
}
