import axiosInstance from "../../lib/axios.js";

// Constants
export const NOTICE_AUDIENCE = {
  GENERAL: "GENERAL",
  STUDENTS: "STUDENTS",
  TEACHERS: "TEACHERS",
  STAFF: "STAFF",
  GUARDIANS: "GUARDIANS",
  CLASS: "CLASS",
} as const;

export const NOTICE_CATEGORY = {
  GENERAL: "GENERAL",
  ACADEMIC: "ACADEMIC",
  EXAMINATION: "EXAMINATION",
  ADMISSION: "ADMISSION",
  MEETING: "MEETING",
  EVENT: "EVENT",
  EMERGENCY: "EMERGENCY",
} as const;

export const NOTICE_STATUS = {
  DRAFT: "DRAFT",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
  PUBLISHED: "PUBLISHED",
  REJECTED: "REJECTED",
  ARCHIVED: "ARCHIVED",
  WITHDRAWN: "WITHDRAWN",
} as const;

// Types
export type NoticeAudience =
  (typeof NOTICE_AUDIENCE)[keyof typeof NOTICE_AUDIENCE];

export type NoticeCategory =
  (typeof NOTICE_CATEGORY)[keyof typeof NOTICE_CATEGORY];

export type NoticeStatus = (typeof NOTICE_STATUS)[keyof typeof NOTICE_STATUS];

export interface NoticeTarget {
  academicSession?: string;
  className?: string;
  group?: string;
  section?: string;
}

export interface IUserReference {
  _id: string;
  name: string;
  email: string;
  updatedBy?: IUserReference | string;
  approvedBy?: IUserReference | string;
  withdrawnBy?: IUserReference | string;
  deletedBy?: IUserReference | string;
}
export interface MediaReference {
  url: string;
  publicId: string;
  resourceType?: "image" | "raw" | "video";
  format: string;
  bytes: number;
}

export interface Notice {
  _id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  audience: NoticeAudience;
  target?: NoticeTarget;
  attachments: MediaReference[];
  status: NoticeStatus;
  createdBy: string;
  approvedBy?: IUserReference | string;
  approvedAt?: string;
  rejectionReason?: string;
  publishedAt?: string;
  expiresAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: IUserReference | string;
  deletionReason?: string;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: IUserReference | string;
  withdrawnAt?: string;
  withdrawnBy?: IUserReference | string;
  withdrawalReason?: string;
}

export interface CreateNoticePayload {
  title: string;
  content: string;
  category?: NoticeCategory;
  audience: NoticeAudience;
  target?: NoticeTarget;
  attachments?: MediaReference[];
  expiresAt?: string;
}

export type UpdateNoticePayload = Partial<CreateNoticePayload>;

export interface WithdrawNoticePayload {
  withdrawalReason: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// API endpoint
const NOTICE_ENDPOINT = "/notices";

// Publicly visible notices fetched
export const getPublicNotices = async (): Promise<Notice[]> => {
  const response = await axiosInstance.get<ApiResponse<Notice[]>>(
    `${NOTICE_ENDPOINT}/public`,
  );

  return response.data.data;
};

// Get all notices
export const getAllNotices = async (): Promise<Notice[]> => {
  const response =
    await axiosInstance.get<ApiResponse<Notice[]>>(NOTICE_ENDPOINT);

  return response.data.data;
};

// Get single notice
export const getNoticeById = async (id: string): Promise<Notice> => {
  const response = await axiosInstance.get<ApiResponse<Notice>>(
    `${NOTICE_ENDPOINT}/${id}`,
  );

  return response.data.data;
};

// FORM DATA HELPER
const buildNoticeFormData = (
  payload: CreateNoticePayload | UpdateNoticePayload,
  files: File[] | [],
): FormData => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  files.forEach((file) => {
    formData.append("files", file);
  });
  return formData;
};

// Create notice
export const createNotice = async (
  payload: CreateNoticePayload,
  files: File[] = [],
): Promise<Notice> => {
  const hasAttachments = files.length > 0;
  const response = await axiosInstance.post<ApiResponse<Notice>>(
    NOTICE_ENDPOINT,
    hasAttachments ? buildNoticeFormData(payload, files) : payload,
  );
  return response.data.data;
};

// Update notice
export const updateNotice = async (
  id: string,
  payload: UpdateNoticePayload,
  files: File[] = [],
): Promise<Notice> => {
  const hasAttachments = files.length > 0;
  const response = await axiosInstance.patch<ApiResponse<Notice>>(
    `${NOTICE_ENDPOINT}/${id}`,
    hasAttachments ? buildNoticeFormData(payload, files) : payload,
  );

  return response.data.data;
};

// Publish notice
export const publishNotice = async (id: string): Promise<Notice> => {
  const response = await axiosInstance.patch<ApiResponse<Notice>>(
    `${NOTICE_ENDPOINT}/${id}/publish`,
  );

  return response.data.data;
};

// Archive notice
export const archiveNotice = async (id: string): Promise<Notice> => {
  const response = await axiosInstance.patch<ApiResponse<Notice>>(
    `${NOTICE_ENDPOINT}/${id}/archive`,
  );

  return response.data.data;
};

// Withdraw notice
export const withdrawNotice = async (
  id: string,
  payload: WithdrawNoticePayload,
): Promise<Notice> => {
  const response = await axiosInstance.patch<ApiResponse<Notice>>(
    `${NOTICE_ENDPOINT}/${id}/withdraw`,
    payload,
  );

  return response.data.data;
};

// Soft delete notice
export const deleteNotice = async (id: string): Promise<Notice> => {
  const response = await axiosInstance.delete<ApiResponse<Notice>>(
    `${NOTICE_ENDPOINT}/${id}`,
  );

  return response.data.data;
};
