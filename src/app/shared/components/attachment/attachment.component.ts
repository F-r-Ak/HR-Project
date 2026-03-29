import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AttachmentService } from '../../services/attachment/attachment.service';
import { File } from './interfaces/file';
import { NgClass, UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-attachment',
    imports: [NgClass, UpperCasePipe],
    templateUrl: './attachment.component.html',
    styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent implements OnInit {
  fileToUpload!: any;
  imageExtensions: string[] = ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'svg', 'gif'];
  videosExtensions: string[] = ['mp4', 'mov', 'webm', 'mkv', 'flv', 'avi', 'wmv'];
  filesExtensions: string[] = [
    'pdf',
    'powerpoint',
    'word',
    'excel',
    'doc',
    'docx',
    'ppt',
    'pptx',
    'xls',
    'xlsx',
    'txt',
    'zip',
    'rar',
    'crt',
    'p7b',
    'html',
    'htm',
    'rtf',
    'msg'
  ];
  fileType!: string;
  acceptedTypes!: string;
  uploadedFiles: any[] = []; // insert all the files which the user choose.
  selectedFiles: File[] = []; // insert all the final files.
  isHidden = false;
  isSuccess = false;
  isFailed!: boolean;
  uploadedFile!: { type: string; maxSize: number };
  baseApiUrl!: string;
  downloadUrl!: string;
  oldFiles: any[] = [];

  /**
   * Inputs
   */
  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() isMultiple = false;
  @Input() allowedTypes!: { type: string; maxSize: number }[];
  @Input() maxFilesNumbers!: number;
  @Input() type: string = ''; // image | video | document | imageDocument | imageVideo | videoDocument'
  @Input() isPublic = false;
  @Input() label: string = 'ATTACHMENT.ATTACHMENT';
  @Input() isEditMode = false;
  @Input() isCustom = false;
  @Input() isRequired = false;
  @Input() saveUrl = false;
  /**
   * Outputs
   */
  @Output() uploadEvent: EventEmitter<any> = new EventEmitter();
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild('file') fileInput!: ElementRef;
  attachmentService = inject(AttachmentService);
  constructor() {}

  ngOnInit(): void {
    this.setAcceptedTypes();

    if (this.maxFilesNumbers > 0 && this.isEditMode) {
      this.selectedFiles = [];
      this.oldFiles = [];

      if (!this.formGroup.get(this.controlName)?.value?.length) {
        this.isHidden = false;
      }
      if (this.formGroup.get(this.controlName)?.value?.length) {
        this.formGroup.get(this.controlName)?.value.forEach((element: File) => {
          let file = {
            fileName: element.fileName,
            size: null,
            attachmentDisplaySize: element.attachmentDisplaySize,
            url: element.url,
            extension: element.extension,
            isSuccess: true,
            isPublic: false,
            fileId: '1',
            fileUrl: ''
          };

          this.selectedFiles.push(file);
        });
      }
    }
  }

  /**
   * Set Accepted Types
   */
  setAcceptedTypes() {
    if (this.type === 'image') {
      this.acceptedTypes = 'image/*';
    } else if (this.type === 'video') {
      this.acceptedTypes = 'video/*';
    } else if (this.type === 'imageVideo') {
      this.acceptedTypes = 'image/*, video/*';
    } else if (this.type === 'imageDocument') {
      this.acceptedTypes =
        'image/*, application/pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .txt, .rar, .zip, .crt, .p7b, .html, .htm, .rtf, .msg';
    } else if (this.type === 'videoDocument') {
      this.acceptedTypes =
        'video/*, application/pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .txt, .rar, .zip, .crt, .p7b, .html, .htm, .rtf, .msg';
    } else if (this.type === 'document') {
      this.acceptedTypes = 'application/pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .txt, .rar, .zip, .crt, .p7b, .html, .htm, .rtf, .msg';
    } else {
      this.acceptedTypes = '*';
    }
  }

  /**
   * File Upload Event
   * @param event
   */
  onUploadFile(event: any) {
    if (event.target) {
      const files: any[] = event.target.files;
      this.uploadedFiles = files;
    } else {
      this.uploadedFiles = event;
    }

    if (this.selectedFiles.length + this.uploadedFiles.length <= this.maxFilesNumbers) {
      for (let file of this.uploadedFiles) {
        if (file.type.split('/').pop().toLowerCase() === 'svg+xml') {
          this.fileType = 'svg';
        } else if (!file.type) {
          // if the type equal 'null'
          if (file.name.split('.').pop().toLowerCase() === 'doc' || file.name.split('.').pop().toLowerCase() === 'docx') {
            this.fileType = 'word';
          } else if (file.name.split('.').pop().toLowerCase() === 'ppt' || file.name.split('.').pop().toLowerCase() === 'pptx') {
            this.fileType = 'powerpoint';
          } else if (file.name.split('.').pop().toLowerCase() === 'xls' || file.name.split('.').pop().toLowerCase() === 'xlsx') {
            this.fileType = 'excel';
          } else if (file.name.split('.').pop().toLowerCase() === 'rar') {
            this.fileType = 'rar';
          } else if (file.name.split('.').pop().toLowerCase() === 'msg') {
            this.fileType = 'msg';
          }
        } else if (
          file.type.split('/').pop().toLowerCase() === 'vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.type.split('/').pop().toLowerCase() === 'msword'
        ) {
          this.fileType = 'word';
        } else if (
          file.type.split('/').pop().toLowerCase() === 'vnd.openxmlformats-officedocument.presentationml.presentation' ||
          file.type.split('/').pop().toLowerCase() === 'vnd.ms-powerpoint'
        ) {
          this.fileType = 'powerpoint';
        } else if (
          file.type.split('/').pop().toLowerCase() === 'vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type.split('/').pop().toLowerCase() === 'vnd.ms-excel'
        ) {
          this.fileType = 'excel';
        } else if (file.type.split('/').pop().toLowerCase() === 'plain') {
          this.fileType = 'txt';
        } else if (file.type.split('/').pop().toLowerCase() === 'x-zip-compressed' || file.type.split('/').pop().toLowerCase() === 'gz') {
          this.fileType = 'zip';
        } else if (file.type.split('/').pop().toLowerCase() === 'x-x509-ca-cert') {
          this.fileType = 'crt';
        } else if (file.type.split('/').pop().toLowerCase() === 'x-pkcs7-certificates') {
          this.fileType = 'p7b';
        } else if (file.type.split('/').pop().toLowerCase() === 'jpeg') {
          this.fileType = 'jpg';
        } else if (file.type.split('/').pop().toLowerCase() === 'html') {
          this.fileType = 'html';
        } else if (file.type.split('/').pop().toLowerCase() === 'htm') {
          this.fileType = 'htm';
        } else {
          this.fileType = file.type.split('/').pop().toLowerCase();
        }
        // console.log(file.type)
        this.fileHandling(file);
      }
    } else {
      this.setError('maxNum');
    }
  }

  /**
   * Handle File On Select
   * @param file
   */
  fileHandling(file: any) {
    const fileType = this.allowedTypes.find(allowedType => allowedType.type === this.fileType);
    this.uploadedFile = fileType as { type: string; maxSize: number };

    if (fileType) {
      if (file.size <= fileType.maxSize * 1024 * 1024) {
        if (this.selectedFiles.find(selectedFile => selectedFile.fileName === file.name)) {
          this.setError('fileSelected');
        } else {
          let finalFile: any;
          let reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = () => {
            finalFile = {
              fileName: file.name,
              size: file.size,
              url: reader.result,
              extension: this.fileType,
              isSuccess: false,
              content: ''
            };
          };

          reader.onloadend = () => {
            this.convertSize(finalFile);
            let content = reader.result?.toString();
            if (this.isCustom) {
              finalFile['content'] = content?.substr(content.indexOf(',') + 1);
            }
            this.selectedFiles.push(finalFile);

            if (this.uploadedFiles.length > 1) {
              this.formGroup.get(this.controlName)?.setErrors({ pending: true });
            }

            this.saveFile(this.uploadedFiles);
            if (this.selectedFiles.length === this.maxFilesNumbers) {
              this.isHidden = true;
            }
          };
        }
      } else {
        this.setError('maxSize');
      }
    } else {
      this.setError('allowedTypes');
    }
  }

  /**
   * Convert File Size
   * @param finalFile
   */
  convertSize(finalFile: { size: any; attachmentDisplaySize?: any }) {
    const fileSize = +finalFile.size;

    if (!fileSize.toString().includes('.') && fileSize > 1) {
      // in case the size with bytes
      if (fileSize <= 1024 * 1024) {
        finalFile['attachmentDisplaySize'] = (fileSize / Math.pow(1024, 1)).toFixed() + ' KB';
      } else if (fileSize <= 1024 * 1024 * 1024) {
        finalFile['attachmentDisplaySize'] = (fileSize / Math.pow(1024, 2)).toFixed(1) + ' MB';
      }
    } else if (fileSize < 1) {
      // in case the size < 1 MB and the size returns from API - NOTE - if the size returns with MB
      if (fileSize * 1024 <= 1024 * 1024) {
        finalFile['attachmentDisplaySize'] = (fileSize * Math.pow(1024, 1)).toFixed() + ' KB';
      }
    } else {
      // in case the size > 1 MB and the size returns from API - NOTE - if the size returns with MB
      finalFile['attachmentDisplaySize'] = fileSize.toFixed(1) + ' MB';
    }

    return finalFile;
  }

  /**
   * Set Error
   * @param errorName
   */
  setError(errorName: string) {
    switch (errorName) {
      case 'maxNum':
        this.formGroup.get(this.controlName)?.setErrors({ maximumFiles: true });
        break;

      case 'minResolution':
        this.formGroup.get(this.controlName)?.setErrors({ minimumResolution: true });
        break;

      case 'maxResolution':
        this.formGroup.get(this.controlName)?.setErrors({ maximumResolution: true });
        break;
      case 'fileSelected':
        this.formGroup.get(this.controlName)?.setErrors({ fileSelected: true });
        break;

      case 'maxSize':
        this.formGroup.get(this.controlName)?.setErrors({ maximumSize: true });
        break;

      case 'allowedTypes':
        this.formGroup.get(this.controlName)?.setErrors({ allowedTypes: true });
        break;

      case 'required':
        this.formGroup.get(this.controlName)?.setErrors({ required: true });
        break;

      default:
        this.formGroup.get(this.controlName)?.setErrors(null);
        break;
    }

    this.fileInput.nativeElement.value = '';
    this.formGroup.get(this.controlName)?.markAsDirty();
  }

  /**
   * Remove File From Viewing List
   * Then Remove It From Api
   * @param fileIndex
   * @param file
   */
  removeFile(fileIndex: number, file: any) {
    const removedFile = this.oldFiles.find(x => x.fileName == file.fileName);
    if (this.formGroup.get(this.controlName)?.enabled) {
      this.selectedFiles.splice(fileIndex, 1);
      this.formGroup.get(this.controlName)?.value.splice(fileIndex, 1);
    }

    this.selectedFiles.length ? '' : (this.isSuccess = false);
    this.isHidden = false;
    this.selectedFiles.length || !this.formGroup.get(this.controlName)?.hasValidator(Validators.required) ? '' : this.setError('required');
    this.deleteFileFromServer(removedFile);
  }

  /**
   * Save File To Server
   * @param files
   */
  saveFile(files: File[]) {
    this.callingAPI(files).subscribe(
      (res: any) => {
        res.data.map((file: any) => {
          let selectedFile: any = this.selectedFiles.find(selectedFile => selectedFile.fileName === file.name);
          let selectedIndex = this.selectedFiles.indexOf(selectedFile);

          let finalFile: any = {
            fileName: file.name,
            size: file.fileSize,
            url: this.downloadUrl + file.id,
            extension: file.documentType.toLowerCase(),
            fileId: file.id,
            fileUrl: this.downloadUrl,
            isSuccess: true,
            isPublic: this.isPublic
          };

          if (this.isCustom) {
            finalFile['content'] = selectedFile['content'];
          }

          this.convertSize(finalFile);
          this.oldFiles.push(finalFile);
          this.selectedFiles[selectedIndex].isSuccess = true;
          // this.selectedFiles.splice(selectedIndex, 1, finalFile);
        });

        if (this.maxFilesNumbers === 1 && this.saveUrl) {
          this.formGroup.get(this.controlName)?.setValue(this.oldFiles[0].fileId);
        } else {
          this.formGroup.get(this.controlName)?.setValue(this.oldFiles);
        }

        this.formGroup.get(this.controlName)?.markAsDirty();
        this.formGroup.get(this.controlName)?.setErrors(null);

        this.uploadedFiles = [];
        this.fileInput.nativeElement.value = '';
        this.isFailed = false;
        this.isSuccess = true;
        this.uploadEvent.emit(res);
      },
      () => {
        this.isFailed = true;
      }
    );
  }

  /**
   * Call Server Api
   * @param files
   * @returns
   */
  callingAPI(files: any[]): Observable<any> {
    let formData = new FormData();

    for (let index = 0; index < files.length; index++) {
      formData.append('files', files[index], files[index].name);
    }

    return this.attachmentService.upload(formData, this.isPublic);
  }

  /**
   * Delete File From Server
   * @param file
   */
  deleteFileFromServer(file: any): void {
    this.attachmentService.deleteAttachment(file.fileId).subscribe((res: any) => {
      console.log(res);
      this.deleteEvent.emit(file);
    });
  }
}
