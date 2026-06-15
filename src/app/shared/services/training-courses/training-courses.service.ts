import { Injectable } from '@angular/core';
import { AddTrainingCourseDto, TrainingCourseDto, UpdateTrainingCourseDto, GetPagedBody } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class TrainingCoursesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/trainingcourses/';
    }

    public getBaseUrl(): string {
        return this.baseUrl;
    }

    getTrainingCourse(id: string) {
        return this.get<TrainingCourseDto>({ apiName: `Get/${id}` });
    }

    getEditTrainingCourse(id: string) {
        return this.get<TrainingCourseDto>({ apiName: `getEdit/${id}` });
    }

    get trainingCourses() {
        return this.get<TrainingCourseDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: FormData) {
        return this.post<FormData, TrainingCourseDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: FormData) {
        return this.put<FormData, TrainingCourseDto>({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `delete/`, showAlert: true }, id);
    }

    deleteAttachments(ids: string[]) {
        return this.delete({ apiName: `deleterange/attachments`, showAlert: true }, ids);
    }
}
