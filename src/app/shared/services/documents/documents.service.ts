import { Injectable } from '@angular/core';
import { AddDocumentDto, DocumentDto, UpdateDocumentDto, GetPagedBody } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class DocumentsService extends HttpService {
    protected get baseUrl(): string {
        return 'documents/';
    }

    public getBaseUrl(): string {
        return this.baseUrl;
    }

    getDocument(id: string) {
        return this.get<DocumentDto>({ apiName: `Get/${id}` });
    }

    getEditDocument(id: string) {
        return this.get<DocumentDto>({ apiName: `getEdit/${id}` });
    }

    get documents() {
        return this.get<DocumentDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: FormData) {
        return this.post<FormData, DocumentDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: FormData) {
        return this.put<FormData, DocumentDto>({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `delete/`, showAlert: true }, id);
    }
}
