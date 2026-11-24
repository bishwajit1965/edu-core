import axiosInstance from "../../lib/axios.js";
import type { Subject } from "./subjectsApi.js";

export type SubjectType =
  | "COMPULSORY"
  | "GROUP_MANDATORY"
  | "REQUIRED_SELECTION"
  | "CHOICE";

export interface ConfiguredSubject {
  subject: string | Subject;
  subjectType: SubjectType;
  isMainSubjectEligible: boolean;
  isFourthSubjectEligible: boolean;
  selectionGroup?: string;
}

export interface SubjectSelectionGroup {
  code: string;
  label: string;
  minSelections: number;
  maxSelections: number;
}

export interface SubjectConfiguration {
  _id: string;
  programme: string;
  academicSession: string;
  className: string;
  group?: string;
  subjects: ConfiguredSubject[];
  selectionGroups: SubjectSelectionGroup[];
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConfiguredSubjectPayload {
  subject: string;
  subjectType: SubjectType;
  isMainSubjectEligible: boolean;
  isFourthSubjectEligible: boolean;
  selectionGroup?: string;
}

export interface CreateSubjectConfigurationPayload {
  programme: string;
  academicSession: string;
  className: string;
  group?: string;
  subjects: ConfiguredSubjectPayload[];
  selectionGroups: SubjectSelectionGroup[];
}

export type UpdateSubjectConfigurationPayload =
  Partial<CreateSubjectConfigurationPayload>;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const SUBJECT_CONFIGURATIONS_ENDPOINT = "/subject-configurations";

export const createSubjectConfiguration = async (
  payload: CreateSubjectConfigurationPayload,
): Promise<SubjectConfiguration> => {
  const response = await axiosInstance.post<ApiResponse<SubjectConfiguration>>(
    SUBJECT_CONFIGURATIONS_ENDPOINT,
    payload,
  );

  return response.data.data;
};

export const getAllSubjectConfigurations = async (): Promise<
  SubjectConfiguration[]
> => {
  const response = await axiosInstance.get<ApiResponse<SubjectConfiguration[]>>(
    SUBJECT_CONFIGURATIONS_ENDPOINT,
  );

  return response.data.data;
};

export const getSubjectConfigurationById = async (
  id: string,
): Promise<SubjectConfiguration> => {
  const response = await axiosInstance.get<ApiResponse<SubjectConfiguration>>(
    `${SUBJECT_CONFIGURATIONS_ENDPOINT}/${id}`,
  );

  return response.data.data;
};

export const updateSubjectConfiguration = async (
  id: string,
  payload: UpdateSubjectConfigurationPayload,
): Promise<SubjectConfiguration> => {
  const response = await axiosInstance.patch<ApiResponse<SubjectConfiguration>>(
    `${SUBJECT_CONFIGURATIONS_ENDPOINT}/${id}`,
    payload,
  );

  return response.data.data;
};

export const deleteSubjectConfiguration = async (id: string) => {
  const response = await axiosInstance.delete<
    ApiResponse<SubjectConfiguration>
  >(`${SUBJECT_CONFIGURATIONS_ENDPOINT}/${id}`);

  return response.data;
};
