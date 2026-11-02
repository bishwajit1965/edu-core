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

export interface MediaReference {
  url: string;
  publicId: string;
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
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  publishedAt?: string;
  expiresAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  deletionReason?: string;
  createdAt?: string;
  updatedAt?: string;
  withdrawnAt?: string;
  withdrawnBy?: string;
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

// Create notice
export const createNotice = async (
  payload: CreateNoticePayload,
): Promise<Notice> => {
  const response = await axiosInstance.post<ApiResponse<Notice>>(
    NOTICE_ENDPOINT,
    payload,
  );

  return response.data.data;
};

// Update notice
export const updateNotice = async (
  id: string,
  payload: UpdateNoticePayload,
): Promise<Notice> => {
  const response = await axiosInstance.patch<ApiResponse<Notice>>(
    `${NOTICE_ENDPOINT}/${id}`,
    payload,
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
