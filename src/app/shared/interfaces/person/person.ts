import { Lookup, SharedProperties } from '../shared/shared';

export interface PersonDto extends Lookup, Partial<SharedProperties> {
    id: string;
    fullName: string;
    nationalID: string;
    birthDate: string;
    birthGov: string;
    birthPlace: string;
    religion: string;
    gender: string;
    maritalStatus: string;
    militaryStatus: string;
    nationalityId: string;
    nationalityName: string;
    qualificationId: string;
    qualificationName: string;
    higherQualificationId: string;
    higherQualificationName: string;
    currentAddress: string;
    previousAddress: string;
    homePhone: string;
    officePhone: string;
    mobile: string;
    email: string;
    childrenNumber: number;
}

export interface AddPersonDto extends Lookup, Partial<SharedProperties> {
    id: string;
    fullName: string;
    nationalID: string;
    birthDate: string;
    birthGov: string;
    birthPlace: string;
    religion: string;
    gender: string;
    maritalStatus: string;
    militaryStatus: string;
    nationalityId: string;
    qualificationId: string;
    higherQualificationId: string;
    currentAddress: string;
    previousAddress: string;
    homePhone: string;
    officePhone: string;
    mobile: string;
    email: string;
    childrenNumber: number;
}

export interface UpdatePersonDto extends Lookup, Partial<SharedProperties> {
    id: string;
    fullName: string;
    nationalID: string;
    birthDate: string;
    birthGov: string;
    birthPlace: string;
    religion: string;
    gender: string;
    maritalStatus: string;
    militaryStatus: string;
    nationalityId: string;
    qualificationId: string;
    higherQualificationId: string;
    currentAddress: string;
    previousAddress: string;
    homePhone: string;
    officePhone: string;
    mobile: string;
    email: string;
    childrenNumber: number;
}
