import axiosInstance from "../../lib/axios.js";
import studentAxios from "../../lib/studentAxios.js";

export type StudentAdmissionType = "regular" | "tc";

export type StudentStatus =
  | "active"
  | "inactive"
  | "transferred"
  | "graduated"
  | "passed-out";

export type ClearanceStatus = "pending" | "cleared" | "not_applicable";

export type StudentAcademicState =
  | "enrolled"
  | "current"
  | "passed"
  | "failed"
  | "promoted"
  | "demoted"
  | "transferred"
  | "passed-out"
  | "graduated";

export interface StudentAcademicHistory {
  academicSession: string;
  className: string;
  group?: string;
  section?: string;
  rollNumber?: string;
  academicState: StudentAcademicState;
  remarks?: string;
}
export interface StudentGuardian {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface PreviousInstitution {
  name: string;
  address: string;
  eiin?: string;
  previousClass?: string;
  previousRollNumber?: string;
}

export interface StudentTCDetails {
  number: string;
  issueDate: string;
  previousInstitution: PreviousInstitution;
}

export interface StudentClearance {
  status: ClearanceStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  remarks?: string;
}

export interface Student {
  _id: string;
  studentId: string;
  name: string;
  dateOfBirth?: string;
  studentEmail?: string;
  gender?: string;
  photo?: {
    url: string;
    publicId: string;
  };
  birthRegistrationNumber: string;
  fatherName?: string;
  fatherNationalId: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation: string;
  guardians: StudentGuardian[];
  presentAddress?: string;
  permanentAddress?: string;
  admissionDate: string;
  admissionType: StudentAdmissionType;
  tcDetails?: StudentTCDetails;
  academicSession: string;
  className: string;
  group?: string;
  section?: string;
  rollNumber?: string;
  academicHistory: StudentAcademicHistory[];
  educationBoard?: string;
  boardRegistrationNumber?: string;
  registrationYear?: number;
  boardRollNumber?: string;
  duesClearance: StudentClearance;
  libraryClearance: StudentClearance;
  status: StudentStatus;
  createdAt?: string;
  updatedAt?: string;
  isDeleted: boolean;
  restoredAt: Date;
}

export interface StudentGuardian {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  photo?: {
    url: string;
    publicId: string;
  };
}

export type CreateStudentPayload = Omit<
  Student,
  "_id" | "studentId" | "createdAt" | "updatedAt" | "restoredAt"
>;
export type UpdateStudentPayload = Partial<CreateStudentPayload>;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const STUDENTS_ENDPOINT = "/students";
const STUDENTS_AUTH_PROFILE_ENDPOINT = "/student-auth";

export const createStudent = async (
  formData: FormData,
  // payload: CreateStudentPayload,
): Promise<Student> => {
  const response = await axiosInstance.post<ApiResponse<Student>>(
    STUDENTS_ENDPOINT,
    formData,
  );

  return response.data.data;
};

export const getStudentById = async (id: string): Promise<Student> => {
  const response = await axiosInstance.get<ApiResponse<Student>>(
    `${STUDENTS_ENDPOINT}/${id}`,
  );

  return response.data.data;
};

export const getAllStudents = async (): Promise<Student[]> => {
  const response =
    await axiosInstance.get<ApiResponse<Student[]>>(STUDENTS_ENDPOINT);

  return response.data.data;
};

export const getStudentProfile = async (): Promise<Student> => {
  const response = await studentAxios.get<ApiResponse<Student>>(
    `${STUDENTS_AUTH_PROFILE_ENDPOINT}/me`,
  );

  return response.data.data;
};

export const updateStudent = async (
  id: string,
  payload: UpdateStudentPayload | FormData,
): Promise<Student> => {
  const response = await axiosInstance.patch<ApiResponse<Student>>(
    `${STUDENTS_ENDPOINT}/${id}`,
    payload,
  );

  return response.data.data;
};

export const softDeleteStudent = async (
  id: string,
  deletionReason?: string,
) => {
  const response = await axiosInstance.patch<ApiResponse<Student>>(
    `/students/${id}/soft-delete`,
    {
      deletionReason,
    },
  );

  return response.data;
};

export const getDeletedStudents = async () => {
  const response =
    await axiosInstance.get<ApiResponse<Student>>("/students/deleted");
  return response.data;
};

export const restoreStudent = async (id: string) => {
  const response = await axiosInstance.patch<ApiResponse<Student>>(
    `/students/${id}/restore`,
  );

  return response.data;
};
