import { Lookup, SharedProperties } from '../shared/shared';

export interface JobHistoryDto extends Lookup, Partial<SharedProperties> {
    id: string;
    employmentId: string;
    jobId: string;
    organizationId: string;
    departmentId: string;
    jobStartDate: string;
    jobEndDate: string;
}

export interface AddJobHistoryDto extends Lookup, Partial<SharedProperties> {
    id: string;
    employmentId: string;
    jobId: string;
    organizationId: string;
    departmentId: string;
    jobStartDate: string;
    jobEndDate: string;
}

export interface UpdateJobHistoryDto extends Lookup, Partial<SharedProperties> {
    id: string;
    employmentId: string;
    jobId: string;
    organizationId: string;
    departmentId: string;
    jobStartDate: string;
    jobEndDate: string;
}
