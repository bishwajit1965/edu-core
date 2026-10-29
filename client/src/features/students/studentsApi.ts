import axiosInstance from "../../lib/axios.js";

export type StudentAdmissionType = "regular" | "tc";

export type StudentStatus = "active" | "inactive" | "transferred" | "graduated";

export type ClearanceStatus = "pending" | "cleared" | "not_applicable";

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
  gender?: string;
  photo?: {
    url: string;
    publicId: string;
  };
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
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
  educationBoard?: string;
  boardRegistrationNumber?: string;
  registrationYear?: number;
  boardRollNumber?: string;
  duesClearance: StudentClearance;
  libraryClearance: StudentClearance;
  status: StudentStatus;
  createdAt?: string;
  updatedAt?: string;
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
  "_id" | "studentId" | "createdAt" | "updatedAt"
>;
export type UpdateStudentPayload = Partial<CreateStudentPayload>;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const STUDENTS_ENDPOINT = "/students";

export const getAllStudents = async (): Promise<Student[]> => {
  const response =
    await axiosInstance.get<ApiResponse<Student[]>>(STUDENTS_ENDPOINT);

  return response.data.data;
};

export const getStudentById = async (id: string): Promise<Student> => {
  const response = await axiosInstance.get<ApiResponse<Student>>(
    `${STUDENTS_ENDPOINT}/${id}`,
  );

  return response.data.data;
};

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
