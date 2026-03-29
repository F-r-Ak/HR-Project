import { Injectable } from '@angular/core';

export interface FileUploadConfig {
  mode: 'add' | 'edit';
  showModeIndicator?: boolean;
  maxFiles?: number;
  acceptedTypes?: string;
  maxFileSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadStyleService {

  /**
   * Get CSS classes for p-fileUpload component based on mode
   */
  getFileUploadClasses(config: FileUploadConfig): string {
    const baseClasses = ['p-fileupload'];

    if (config.mode === 'add') {
      baseClasses.push('add-mode');
    } else if (config.mode === 'edit') {
      baseClasses.push('edit-mode');
    }

    return baseClasses.join(' ');
  }

  /**
   * Get mode indicator configuration
   */
  getModeIndicatorConfig(mode: 'add' | 'edit') {
    return {
      class: `mode-indicator ${mode}-mode`,
      text: mode === 'add' ? 'إضافة ملفات' : 'تعديل الملفات',
      show: true
    };
  }

  /**
   * Get file type class based on file extension
   */
  getFileTypeClass(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return 'pdf-file';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'image-file';
      case 'doc':
      case 'docx':
        return 'doc-file';
      case 'xls':
      case 'xlsx':
        return 'excel-file';
      default:
        return 'generic-file';
    }
  }

  /**
   * Get file icon based on file type
   */
  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return 'pi pi-file-pdf';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'pi pi-image';
      case 'doc':
      case 'docx':
        return 'pi pi-file-word';
      case 'xls':
      case 'xlsx':
        return 'pi pi-file-excel';
      case 'zip':
      case 'rar':
        return 'pi pi-file-archive';
      default:
        return 'pi pi-file';
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get default file upload configuration
   */
  getDefaultConfig(mode: 'add' | 'edit'): FileUploadConfig {
    return {
      mode,
      showModeIndicator: true,
      maxFiles: 10,
      acceptedTypes: 'image/*,application/pdf,.doc,.docx,.xls,.xlsx',
      maxFileSize: 10000000 // 10MB
    };
  }

  /**
   * Get localized labels for file upload
   */
  getLabels(mode: 'add' | 'edit') {
    return {
      chooseLabel: mode === 'add' ? 'اختر الملفات' : 'اختر ملفات إضافية',
      uploadLabel: 'رفع',
      cancelLabel: 'إلغاء',
      emptyMessage: mode === 'add' ? 'لم يتم اختيار أي ملفات بعد' : 'لا توجد ملفات إضافية',
      emptySubMessage: 'اسحب الملفات هنا أو انقر لاختيار الملفات',
      existingFilesTitle: 'الملفات الموجودة',
      newFilesTitle: 'الملفات الجديدة'
    };
  }
}
