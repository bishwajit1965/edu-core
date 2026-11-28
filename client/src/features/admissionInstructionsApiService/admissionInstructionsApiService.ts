import axiosInstance from "../../lib/axios.js";

// ================= INTERFACES =================

export interface IAdmissionAttachment {
  name: string;
  url: string;
  publicId: string;
  resourceType: "image" | "raw" | "video";
  format?: string;
  size?: number;
}

export interface IAdmissionInstructionSection {
  _id?: string;
  title: string;
  content: string;
  attachment: IAdmissionAttachment[];
  order: number;
  isVisible: boolean;
}

export interface IAdmissionFAQ {
  _id?: string;
  question: string;
  answer: string;
  order: number;
  isVisible: boolean;
}

export interface IAdmissionInstructions {
  _id: string;
  title: string;
  academicSession: string;
  introduction?: string;
  sections: IAdmissionInstructionSection[];
  faqs: IAdmissionFAQ[];
  attachments?: IAdmissionAttachment[];
  isPublished: boolean;
  publishedAt: string | null;
  isDeleted: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAdmissionInstructionsPayload {
  title: string;
  academicSession: string;
  introduction?: string;
  sections: IAdmissionInstructionSection[];
  faqs: IAdmissionFAQ[];
  attachments?: IAdmissionAttachment[];
}

export type UpdateAdmissionInstructionsPayload =
  Partial<CreateAdmissionInstructionsPayload>;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ================= ENDPOINT =================

const ADMISSION_INSTRUCTIONS_ENDPOINT = "/admission-instructions";

// ================= ADMIN API =================

// Get all admission instructions
export const getAllAdmissionInstructions = async (): Promise<
  IAdmissionInstructions[]
> => {
  const response = await axiosInstance.get<
    ApiResponse<IAdmissionInstructions[]>
  >(ADMISSION_INSTRUCTIONS_ENDPOINT);

  return response.data.data;
};

// Get admission instructions by ID
export const getAdmissionInstructionsById = async (
  id: string,
): Promise<IAdmissionInstructions> => {
  const response = await axiosInstance.get<ApiResponse<IAdmissionInstructions>>(
    `${ADMISSION_INSTRUCTIONS_ENDPOINT}/${id}`,
  );

  return response.data.data;
};

// FORM DATA HELPER
const buildAdmissionInstructionsFormData = (
  payload:
    | CreateAdmissionInstructionsPayload
    | UpdateAdmissionInstructionsPayload,
  files: File[] = [],
): FormData => {
  const formData = new FormData();

  formData.append("data", JSON.stringify(payload));

  files.forEach((file) => {
    formData.append("files", file);
  });

  return formData;
};

// Create admission instructions
// export const createAdmissionInstructions = async (
//   payload: CreateAdmissionInstructionsPayload,
// ): Promise<IAdmissionInstructions> => {
//   const response = await axiosInstance.post<
//     ApiResponse<IAdmissionInstructions>
//   >(ADMISSION_INSTRUCTIONS_ENDPOINT, payload);

//   return response.data.data;
// };

// Create admission instructions
export const createAdmissionInstructions = async (
  payload: CreateAdmissionInstructionsPayload,
  files: File[] = [],
): Promise<IAdmissionInstructions> => {
  const response = await axiosInstance.post<
    ApiResponse<IAdmissionInstructions>
  >(
    ADMISSION_INSTRUCTIONS_ENDPOINT,
    files.length ? buildAdmissionInstructionsFormData(payload, files) : payload,
  );

  return response.data.data;
};

// Update admission instructions
export const updateAdmissionInstructions = async (
  id: string,
  payload: UpdateAdmissionInstructionsPayload,
  files: File[] = [],
): Promise<IAdmissionInstructions> => {
  const response = await axiosInstance.patch<
    ApiResponse<IAdmissionInstructions>
  >(
    `${ADMISSION_INSTRUCTIONS_ENDPOINT}/${id}`,
    files.length ? buildAdmissionInstructionsFormData(payload, files) : payload,
  );

  return response.data.data;
};
// export const updateAdmissionInstructions = async (
//   id: string,
//   payload: UpdateAdmissionInstructionsPayload,
// ): Promise<IAdmissionInstructions> => {
//   const response = await axiosInstance.patch<
//     ApiResponse<IAdmissionInstructions>
//   >(`${ADMISSION_INSTRUCTIONS_ENDPOINT}/${id}`, payload);

//   return response.data.data;
// };

// Publish / Unpublish admission instructions
export const updateAdmissionInstructionsStatus = async (
  id: string,
  isPublished: boolean,
): Promise<IAdmissionInstructions> => {
  const response = await axiosInstance.patch<
    ApiResponse<IAdmissionInstructions>
  >(`${ADMISSION_INSTRUCTIONS_ENDPOINT}/${id}/status`, {
    isPublished,
  });

  return response.data.data;
};

export const uploadAdmissionInstructionMedia = async (
  files: File[],
): Promise<IAdmissionAttachment[]> => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  type UploadedAdmissionMedia = Omit<IAdmissionAttachment, "size"> & {
    bytes?: number;
  };

  const response = await axiosInstance.post<
    ApiResponse<UploadedAdmissionMedia[]>
  >("/media/upload/admissionInstructions", formData);

  return response.data.data.map((media) => ({
    ...media,
    size: media.bytes,
  }));
};

// Soft delete admission instructions
export const softDeleteAdmissionInstructions = async (
  id: string,
): Promise<IAdmissionInstructions> => {
  const response = await axiosInstance.delete<
    ApiResponse<IAdmissionInstructions>
  >(`${ADMISSION_INSTRUCTIONS_ENDPOINT}/${id}`);

  return response.data.data;
};

// Restore admission instructions
export const restoreAdmissionInstructions = async (
  id: string,
): Promise<IAdmissionInstructions> => {
  const response = await axiosInstance.patch<
    ApiResponse<IAdmissionInstructions>
  >(`${ADMISSION_INSTRUCTIONS_ENDPOINT}/${id}/restore`);

  return response.data.data;
};

// ================= PUBLIC API =================

// Get public admission instructions by academic session
export const getPublicAdmissionInstructions = async (
  academicSession: string,
): Promise<IAdmissionInstructions> => {
  const response = await axiosInstance.get<ApiResponse<IAdmissionInstructions>>(
    `${ADMISSION_INSTRUCTIONS_ENDPOINT}/public/${encodeURIComponent(academicSession)}`,
  );

  return response.data.data;
};
