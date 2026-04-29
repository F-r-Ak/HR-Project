import { Lookup, SharedProperties } from '../shared/shared';
import { Attachment } from '../attachment/attachment';

export interface TrainingCourseDto extends Lookup, Partial<SharedProperties> {
    id: string;
    employmentId: string;
    courseName: string;
    courseDescription: string;
    courseStartDate: string;
    courseEndDate: string;
    attachs: Attachment[];
}

export interface AddTrainingCourseDto extends Lookup, Partial<SharedProperties> {
    id: string;
    employmentId: string;
    courseName: string;
    courseDescription: string;
    courseStartDate: string;
    courseEndDate: string;
    attachs: Attachment[];
}

export interface UpdateTrainingCourseDto extends Lookup, Partial<SharedProperties> {
    id: string;
    employmentId: string;
    courseName: string;
    courseDescription: string;
    courseStartDate: string;
    courseEndDate: string;
    attachs: Attachment[];
}
