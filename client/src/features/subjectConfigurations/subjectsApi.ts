import axiosInstance from "../../lib/axios.js";

export interface Subject {
  _id: string;
  name: string;
  code: string;
  description?: string;
  papers: {
    name: string;
    boardCode?: string;
  }[];
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const SUBJECTS_ENDPOINT = "/subjects";

// Get all active subjects from Subject Master
export const getAllSubjects = async (): Promise<Subject[]> => {
  const response =
    await axiosInstance.get<ApiResponse<Subject[]>>(SUBJECTS_ENDPOINT);

  return response.data.data.filter(
    (subject) => subject.status === "active" && !subject.isDeleted,
  );
};

// Get a single subject
export const getSubjectById = async (id: string): Promise<Subject> => {
  const response = await axiosInstance.get<ApiResponse<Subject>>(
    `${SUBJECTS_ENDPOINT}/${id}`,
  );

  return response.data.data;
};
