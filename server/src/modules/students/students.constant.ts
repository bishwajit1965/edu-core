export const STUDENT_ADMISSION_TYPE = {
  REGULAR: "regular",
  TC: "tc",
} as const;

export const STUDENT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  TRANSFERRED: "transferred",
  GRADUATED: "graduated",
} as const;

export const CLEARANCE_STATUS = {
  PENDING: "pending",
  CLEARED: "cleared",
  NOT_APPLICABLE: "not_applicable",
} as const;
