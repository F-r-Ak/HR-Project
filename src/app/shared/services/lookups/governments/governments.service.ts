import { Injectable } from '@angular/core';
import { AddTestDto, TestDto, UpdateTestDto, GetPagedBody } from '../../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services';

@Injectable({
    providedIn: 'root'
})
export class GovernmentsService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/governments/';
    }

    getGovernment(id: string) {
        return this.get<TestDto>({ apiName: `Get/${id}` });
    }

    getEditGovernment(id: string) {
        return this.get<TestDto>({ apiName: `getEdit/${id}` });
    }

    get Governments() {
        return this.get<TestDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    add(body: AddTestDto) {
        return this.post<AddTestDto, TestDto>({ apiName: 'add', showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }


    update(body: UpdateTestDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `delete/`, showAlert: true }, id);
    }
}
