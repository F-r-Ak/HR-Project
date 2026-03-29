import { EnumDto } from '../enum/enum';
import { Lookup, SharedProperties } from '../shared/shared';

export interface EmployeeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    nameAr: string;
    job: string;
    isUser: boolean;
    nationalId: string;
    gender: EnumDto;
    organizationId: string;
    organizationNameAr: string;
}

export interface AddEmployeeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    nameAr: string;
    job: string;
    isUser: boolean;
    nationalId: string;
    gender: string;
    organizationId: string;
}

export interface UpdateEmployeeDto extends Lookup, Partial<SharedProperties> {
    id: string;
    nameAr: string;
    job: string;
    isUser: boolean;
    nationalId: string;
    gender: string;
    organizationId: string;
}
