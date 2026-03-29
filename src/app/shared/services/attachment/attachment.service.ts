import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService extends HttpService {
  get baseUrl(): string {
    return 'Files/';
  }
  upload(body: FormData, isPublic: boolean) {
    const serverUrl = this.configService.getAppUrl('FileManagementApi');
    const appCode = this.configService.getAppUrl('AppCode');
    const categoryCode = this.configService.getAppUrl('AppAttachmentCategoryCode');
    const endPoint =
      serverUrl + `files/UploadToSanStorage?storageType=1&isPublic=${isPublic}&appCode=${appCode}&categoryCode=${categoryCode}`;
    console.log(endPoint);
    return this.http.post(endPoint, body);
  }

  deleteAttachment(fileId: string) {
    const serverUrl = this.configService.getAppUrl('FileManagementApi');
    return this.http.get(serverUrl + `Files/Delete/${fileId}`);
  }
}
