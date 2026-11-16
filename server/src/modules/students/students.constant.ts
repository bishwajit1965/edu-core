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

export const STUDENT_ACADEMIC_STATE = {
  ENROLLED: "enrolled",
  CURRENT: "current",
  PASSED: "passed",
  FAILED: "failed",
  PROMOTED: "promoted",
  DEMOTED: "demoted",
  TRANSFERRED: "transferred",
  GRADUATED: "graduated",
  PASSED_OUT: "passed-out",
} as const;

export const CLEARANCE_STATUS = {
  PENDING: "pending",
  CLEARED: "cleared",
  NOT_APPLICABLE: "not_applicable",
} as const;
