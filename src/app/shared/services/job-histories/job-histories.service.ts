import { Injectable } from '@angular/core';
import { AddJobHistoryDto, JobHistoryDto, UpdateJobHistoryDto, GetPagedBody } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class JobHistoriesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/jobhistories/';
    }

    getJobHistory(id: string) {
        return this.get<JobHistoryDto>({ apiName: `Get/${id}` });
    }

    getEditJobHistory(id: string) {
        return this.get<JobHistoryDto>({ apiName: `getEdit/${id}` });
    }

    get jobHistories() {
        return this.get<JobHistoryDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddJobHistoryDto) {
        return this.post<AddJobHistoryDto, JobHistoryDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateJobHistoryDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `delete/`, showAlert: true }, id);
    }
}

