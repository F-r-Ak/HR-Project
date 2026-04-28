import { Lookup, SharedProperties } from '../shared/shared';

export interface EmploymentDto extends Lookup, Partial<SharedProperties> {
    id: string;
    personId: string;
    person: string;
    employmentOrgId: string;
    employmentOrg: string;
    employmentDate: string;
    decisionNumber: string;
    decisionDate: string;
    currentDegreeId: string;
    currentDegree: string;
    degreeDate: string;
    insuranceNumber: number;
    currentJobId: string;
    currentJob: string;
    currentOrgId: string;
    currentOrg: string;
    currentDepId: string;
    currentDep: string;
    jobStartDate: string;
    secondmentJobId: string;
    secondmentJob: string;
    secondmentOrgId: string;
    secondmentOrg: string;
    secondmentDepId: string;
    secondmentDep: string;
    nominatedJobId: string;
    nominatedJob: string;
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

