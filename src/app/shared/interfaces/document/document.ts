import { Lookup, SharedProperties } from '../shared/shared';
import { Attachment } from '../attachment/attachment';

export interface DocumentDto extends Lookup, Partial<SharedProperties> {
    id: string;
    personId: string;
    person: string;
    documentTypeId: string;
    documentTypeName: string;
    documentNumber: number;
    attachs: Attachment[];
}

export interface AddDocumentDto extends Lookup, Partial<SharedProperties> {
    id: string;
    personId: string;
    documentTypeId: string;
    documentNumber: number;
    attachs: Attachment[];
}

export interface UpdateDocumentDto extends Lookup, Partial<SharedProperties> {
    id: string;
    personId: string;
    documentTypeId: string;
    documentNumber: number;
    attachs: Attachment[];
}
