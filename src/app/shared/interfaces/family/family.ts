import { Lookup, SharedProperties } from '../shared/shared';

export interface FamilyDto extends Lookup, Partial<SharedProperties> {
    id: string;
    personId: string;
    personName: string;
    fullName: string;
    nationalID: string;
    birthDate: string;
    qualificationId: string;
    qualificationName: string;
    jobId: string;
    jobName: string;
    familyRelationship: string;
}

export interface AddFamilyDto extends Lookup, Partial<SharedProperties> {
    id: string;
    personId: string;
    fullName: string;
    nationalID: string;
    birthDate: string;
    qualificationId: string;
    jobId: string;
    familyRelationship: string;
}

export interface UpdateFamilyDto extends Lookup, Partial<SharedProperties> {
    id: string;
    personId: string;
    fullName: string;
    nationalID: string;
    birthDate: string;
    qualificationId: string;
    jobId: string;
    familyRelationship: string;
}
