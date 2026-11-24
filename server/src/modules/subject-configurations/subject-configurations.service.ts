import { Types } from "mongoose";
import AppError from "../../errors/AppError.js";
import { Subject } from "../subjects/subjects.model.js";
import { SUBJECT_STATUS } from "../subjects/subjects.constant.js";

import {
  IConfiguredSubject,
  ISubjectConfiguration,
  ISubjectSelectionGroup,
} from "./subject-configurations.interface.js";

import { SubjectConfiguration } from "./subject-configurations.model.js";

const httpStatus = {
  CREATED: 201,
  CONFLICT: 409,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
} as const;

// Normalize selection group codes consistently.
const normalizeCode = (code: string) => code.trim().toUpperCase();

// Validate the complete subject configuration.
const validateConfiguration = async (
  subjects: IConfiguredSubject[],
  selectionGroups: ISubjectSelectionGroup[],
) => {
  if (!subjects.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "At least one subject is required",
    );
  }

  // 1. Validate duplicate subject IDs.
  const subjectIds = subjects.map((item) => item.subject.toString());

  if (new Set(subjectIds).size !== subjectIds.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Duplicate subjects are not allowed",
    );
  }

  // 2. Validate ObjectIds.
  if (subjectIds.some((id) => !Types.ObjectId.isValid(id))) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid subject ID");
  }

  // 3. Ensure all subjects exist and are active.
  const activeSubjects = await Subject.find({
    _id: { $in: subjectIds },
    status: SUBJECT_STATUS.ACTIVE,
    isDeleted: false,
  }).select("_id");

  if (activeSubjects.length !== subjectIds.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "One or more selected subjects are unavailable or inactive",
    );
  }

  // 4. Validate selection group codes.
  const groupCodes = selectionGroups.map((group) => normalizeCode(group.code));

  if (new Set(groupCodes).size !== groupCodes.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Duplicate selection group codes are not allowed",
    );
  }

  const groupCodeSet = new Set(groupCodes);

  // 5. Validate each subject's classification and group reference.
  for (const item of subjects) {
    const selectionGroup = item.selectionGroup
      ? normalizeCode(item.selectionGroup)
      : undefined;

    const hasEligibility =
      item.isMainSubjectEligible || item.isFourthSubjectEligible;

    // Compulsory and group-mandatory subjects cannot be selectable.
    if (
      ["COMPULSORY", "GROUP_MANDATORY"].includes(item.subjectType) &&
      (hasEligibility || selectionGroup)
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Compulsory and group-mandatory subjects cannot have selection options",
      );
    }

    // Required-selection subjects must belong to a valid group.
    if (item.subjectType === "REQUIRED_SELECTION") {
      if (!selectionGroup || !groupCodeSet.has(selectionGroup)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Required-selection subjects must reference a valid selection group",
        );
      }

      if (hasEligibility) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Required-selection subjects cannot have main or fourth eligibility flags",
        );
      }
    }

    // Choice subjects must have at least one eligibility.
    if (
      item.subjectType === "CHOICE" &&
      !item.isMainSubjectEligible &&
      !item.isFourthSubjectEligible
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Choice subjects must have at least one eligibility option",
      );
    }

    // Both CHOICE and REQUIRED_SELECTION may reference a group.
    if (selectionGroup) {
      if (!groupCodeSet.has(selectionGroup)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Invalid selection group reference: ${selectionGroup}`,
        );
      }

      if (!["CHOICE", "REQUIRED_SELECTION"].includes(item.subjectType)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Only choice or required-selection subjects can reference a selection group",
        );
      }
    }
  }

  // 6. Validate selection group limits against assigned subjects.
  for (const group of selectionGroups) {
    const code = normalizeCode(group.code);

    if (group.minSelections > group.maxSelections) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Invalid selection limits for ${code}`,
      );
    }

    const availableSubjects = subjects.filter((item) => {
      const itemGroup = item.selectionGroup
        ? normalizeCode(item.selectionGroup)
        : undefined;

      return (
        itemGroup === code &&
        ["CHOICE", "REQUIRED_SELECTION"].includes(item.subjectType)
      );
    }).length;

    if (availableSubjects < group.minSelections) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Selection group ${code} requires at least ${group.minSelections} assigned subjects`,
      );
    }

    if (availableSubjects > 0 && group.maxSelections > availableSubjects) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Selection group ${code} allows more selections than available subjects`,
      );
    }
  }
};

// Check whether another active configuration has the same scope.
const checkDuplicateConfiguration = async (
  scope: {
    programme: string;
    academicSession: string;
    className: string;
    group?: string;
  },
  excludeId?: string,
) => {
  const query: Record<string, unknown> = {
    programme: scope.programme,
    academicSession: scope.academicSession,
    className: scope.className,
    group: scope.group?.trim() || "",
    isDeleted: false,
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existingConfiguration = await SubjectConfiguration.findOne(query);

  if (existingConfiguration) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Subject configuration already exists for this academic scope",
    );
  }
};

// Create configuration.
const createSubjectConfigurationService = async (
  payload: ISubjectConfiguration,
) => {
  await validateConfiguration(payload.subjects, payload.selectionGroups ?? []);

  const scope = {
    programme: payload.programme,
    academicSession: payload.academicSession,
    className: payload.className,
    group: payload.group ?? "",
  };

  await checkDuplicateConfiguration(scope);

  return await SubjectConfiguration.create(payload);
};

// Get all active configurations.
const getAllSubjectConfigurationsService = async () => {
  return await SubjectConfiguration.find({ isDeleted: false })
    .populate("subjects.subject")
    .sort({ academicSession: -1, programme: 1, className: 1 });
};

// Get one active configuration.
const getSingleSubjectConfigurationService = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid configuration ID");
  }

  const configuration = await SubjectConfiguration.findOne({
    _id: id,
    isDeleted: false,
  }).populate("subjects.subject");

  if (!configuration) {
    throw new AppError(httpStatus.NOT_FOUND, "Subject configuration not found");
  }

  return configuration;
};

// Update configuration.
const updateSubjectConfigurationService = async (
  id: string,
  payload: Partial<ISubjectConfiguration>,
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid configuration ID");
  }

  const configuration = await SubjectConfiguration.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!configuration) {
    throw new AppError(httpStatus.NOT_FOUND, "Subject configuration not found");
  }

  // Build the complete next configuration before validating.
  const nextSubjects =
    payload.subjects ??
    (configuration.subjects as unknown as IConfiguredSubject[]);

  const nextSelectionGroups =
    payload.selectionGroups ??
    (configuration.selectionGroups as unknown as ISubjectSelectionGroup[]);

  await validateConfiguration(nextSubjects, nextSelectionGroups ?? []);

  // Validate the resulting academic scope.
  const nextScope = {
    programme: payload.programme ?? configuration.programme,
    academicSession: payload.academicSession ?? configuration.academicSession,
    className: payload.className ?? configuration.className,
    group: payload.group ?? configuration.group ?? "",
  };

  await checkDuplicateConfiguration(nextScope, id);

  // Preserve the existing document and its _id.
  Object.assign(configuration, payload);

  await configuration.save();

  return configuration;
};

// Soft delete configuration.
const deleteSubjectConfigurationService = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid configuration ID");
  }

  const configuration = await SubjectConfiguration.findOneAndUpdate(
    {
      _id: id,
      isDeleted: false,
    },
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );

  if (!configuration) {
    throw new AppError(httpStatus.NOT_FOUND, "Subject configuration not found");
  }

  return configuration;
};

export const SubjectConfigurationServices = {
  createSubjectConfigurationService,
  getAllSubjectConfigurationsService,
  getSingleSubjectConfigurationService,
  updateSubjectConfigurationService,
  deleteSubjectConfigurationService,
};
