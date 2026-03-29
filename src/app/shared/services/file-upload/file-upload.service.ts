import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileSelectEvent } from 'primeng/fileupload';

/**
 * Generic attachment interface
 */
export interface Attachment {
    id: string;
    attachId?: string;
    name: string;
    path: string;
    [key: string]: any; // Allow additional properties
}

/**
 * File upload manager service
 * Provides reusable file upload functionality for components
 */
@Injectable({
    providedIn: 'root'
})
export class FileUploadService {
    /**
     * Handle file selection event
     * @param event FileSelectEvent from PrimeNG fileupload
     * @param selectedFiles Current array of selected files
     * @param form FormGroup to update
     * @param formControlName Name of the form control for attachments (default: 'attachs')
     */
    onFileSelect(
        event: FileSelectEvent,
        selectedFiles: File[],
        form: FormGroup,
        formControlName: string = 'attachs'
    ): void {
        selectedFiles.push(...event.currentFiles);
        form.get(formControlName)?.setValue(selectedFiles);
    }

    /**
     * Handle file removal for newly selected files
     * @param event Remove event with file property
     * @param selectedFiles Current array of selected files
     * @param form FormGroup to update
     * @param formControlName Name of the form control for attachments (default: 'attachs')
     */
    onFileRemove(
        event: { file: File },
        selectedFiles: File[],
        form: FormGroup,
        formControlName: string = 'attachs'
    ): void {
        const fileIndex = selectedFiles.findIndex((file) => file.name === event.file.name);
        if (fileIndex > -1) {
            selectedFiles.splice(fileIndex, 1);
            form.get(formControlName)?.setValue(selectedFiles);
        }
    }

    /**
     * Handle removal of existing attachments from server
     * @param attachment Attachment to remove
     * @param existingAttachments Array of existing attachments
     * @param filesToDelete Array tracking files to delete
     */
    onExistingFileRemoved(
        attachment: Attachment,
        existingAttachments: Attachment[],
        filesToDelete: string[]
    ): void {
        const attachmentIndex = existingAttachments.findIndex((att) => att.id === attachment.id);
        if (attachmentIndex > -1) {
            const attachId = existingAttachments[attachmentIndex].attachId || existingAttachments[attachmentIndex].id;
            filesToDelete.push(attachId);
            existingAttachments.splice(attachmentIndex, 1);
        }
    }

    /**
     * Handle unified file removal (works for both new files and existing attachments)
     * @param attachmentOrFile Object containing either file or id property
     * @param selectedFiles Array of selected files
     * @param existingAttachments Array of existing attachments
     * @param filesToDelete Array tracking files to delete
     * @param form FormGroup to update
     * @param formControlName Name of the form control for attachments (default: 'attachs')
     */
    onFileRemoveUnified(
        attachmentOrFile: any,
        selectedFiles: File[],
        existingAttachments: Attachment[],
        filesToDelete: string[],
        form: FormGroup,
        formControlName: string = 'attachs'
    ): void {
        if (attachmentOrFile.file) {
            // Handle new file removal
            this.onFileRemove(attachmentOrFile, selectedFiles, form, formControlName);
        } else if (attachmentOrFile.id) {
            // Handle existing attachment removal
            this.onExistingFileRemoved(attachmentOrFile, existingAttachments, filesToDelete);
            form.get(formControlName)?.setValue(selectedFiles);
        }
    }

    /**
     * Clear all files (both selected and existing)
     * @param selectedFiles Array of selected files
     * @param existingAttachments Array of existing attachments
     * @param filesToDelete Array tracking files to delete
     * @param form FormGroup to update
     * @param formControlName Name of the form control for attachments (default: 'attachs')
     */
    onFileClear(
        selectedFiles: File[],
        existingAttachments: Attachment[],
        filesToDelete: string[],
        form: FormGroup,
        formControlName: string = 'attachs'
    ): void {
        // Mark all existing attachments for deletion
        existingAttachments.forEach((att) => {
            const attachId = att.attachId || att.id;
            filesToDelete.push(attachId);
        });

        // Clear arrays
        selectedFiles.length = 0;
        existingAttachments.length = 0;
        form.get(formControlName)?.setValue(selectedFiles);
    }

    /**
     * Append files to FormData
     * @param formData FormData object to append files to
     * @param selectedFiles Array of selected files
     * @param fieldName Field name for files in FormData (default: 'attachs')
     */
    appendFilesToFormData(formData: FormData, selectedFiles: File[], fieldName: string = 'attachs'): void {
        selectedFiles.forEach((file: File) => {
            formData.append(fieldName, file, file.name);
        });
    }

    /**
     * Get attachment URL
     * @param baseUrl Base URL from service
     * @param path Attachment path
     */
    getAttachmentUrl(baseUrl: string, path: string): string {
        return `${baseUrl}${path}`;
    }

    /**
     * Initialize file upload state
     * Returns objects to be assigned to component properties
     */
    initializeFileUploadState(): {
        selectedFiles: File[];
        existingAttachments: Attachment[];
        filesToDelete: string[];
    } {
        return {
            selectedFiles: [],
            existingAttachments: [],
            filesToDelete: []
        };
    }

    /**
     * Reset file upload state
     * @param selectedFiles Array of selected files
     * @param existingAttachments Array of existing attachments
     * @param filesToDelete Array tracking files to delete
     * @param form FormGroup to update
     * @param formControlName Name of the form control for attachments (default: 'attachs')
     */
    resetFileUploadState(
        selectedFiles: File[],
        existingAttachments: Attachment[],
        filesToDelete: string[],
        form: FormGroup,
        formControlName: string = 'attachs'
    ): void {
        selectedFiles.length = 0;
        existingAttachments.length = 0;
        filesToDelete.length = 0;
        form.get(formControlName)?.setValue([]);
    }
}

