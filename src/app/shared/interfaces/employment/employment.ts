import { Lookup, SharedProperties } from '../shared/shared';

export interface EmploymentDto extends Lookup, Partial<SharedProperties> {
    id: string;
    personId: string;
    employmentOrgId: string;
    employmentOrgNameAr: string;
    employmentDate: string;
    decisionNumber: string;
    decisionDate: string;
    currentDegreeId: string;
    currentDegreeNameAr: string;
    degreeDate: string;
    insuranceNumber: number;
    currentJobId: string;
    currentJobNameAr: string;
    currentOrgId: string;
    currentOrgNameAr: string;
    currentDepId: string;
    currentDepNameAr: string;
    jobStartDate: string;
    secondmentJobId: string;
    secondmentJobNameAr: string;
    secondmentOrgId: string;
    secondmentOrgNameAr: string;
    secondmentDepId: string;
    secondmentDepNameAr: string;
    nominatedJobId: string;
    nominatedJobNameAr: string;
}

export interface AddEmploymentDto extends Lookup, Partial<SharedProperties> {
    id: string;
    personId: string;
    employmentOrgId: string;
    employmentDate: string;
    decisionNumber: string;
    decisionDate: string;
    currentDegreeId: string;
    degreeDate: string;
    insuranceNumber: number;
    currentJobId: string;
    currentOrgId: string;
    currentDepId: string;
    jobStartDate: string;
    secondmentJobId: string;
    secondmentOrgId: string;
    secondmentDepId: string;
    nominatedJobId: string;
}

export interface UpdateEmploymentDto extends Lookup, Partial<SharedProperties> {
    id: string;
    personId: string;
    employmentOrgId: string;
    employmentDate: string;
    decisionNumber: string;
    decisionDate: string;
    currentDegreeId: string;
    degreeDate: string;
    insuranceNumber: number;
    currentJobId: string;
    currentOrgId: string;
    currentDepId: string;
    jobStartDate: string;
    secondmentJobId: string;
    secondmentOrgId: string;
    secondmentDepId: string;
    nominatedJobId: string;
}

