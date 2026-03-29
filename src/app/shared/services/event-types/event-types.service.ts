import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { EnumDto } from '../../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EventTypesService extends HttpService {
  protected get baseUrl(): string {
    return 'eventtypes/';
  }

  get eventTypes() {
    return this.get<EnumDto[]>({ apiName: 'getAll' });
  }
}

