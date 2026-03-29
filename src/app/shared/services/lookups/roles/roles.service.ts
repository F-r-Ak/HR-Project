
import { Injectable } from '@angular/core';
import { AddTestDto, TestDto, UpdateTestDto , GetPagedBody } from '../../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends HttpService {
  protected get baseUrl(): string {
    return 'roles/';
  }

  getRole(id: string) {
    return this.get<TestDto>({ apiName: `Get/${id}` });
  }

 

  getRoleModule(body:any) {
    return this.post<any, any>({ apiName: `getrolemodule`, showAlert: true }, body);
  }

  getEditRole(id: string) {
    return this.get<TestDto>({ apiName: `getEdit/${id}` });
  }

  get roles() {
    return this.get<TestDto[]>({ apiName: 'getAll' });
  }

  getDropDown(body: GetPagedBody<any>): Observable<any> {
    return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
  }

  getPaged(body: GetPagedBody<any>): Observable<any> {
    return this.post<any, any>({ apiName: `getpaged`, showAlert: true }, body);
  }

  add(body: AddTestDto) {
    return this.post<AddTestDto, TestDto>({ apiName: 'add', showAlert: true }, body);
  }

  update(body: UpdateTestDto) {
    return this.put({ apiName: 'update', showAlert: true }, body);
  }

  updateRoleModules(body: any) {
    return this.put({ apiName: 'updaterolemodules', showAlert: true }, body);
  }

  remove(id: string) {
    return this.delete({ apiName: `delete/`, showAlert: true }, id);
  }
}
