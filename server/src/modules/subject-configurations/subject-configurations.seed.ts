import { Subject } from "../subjects/subjects.model.js";
import { SUBJECT_STATUS } from "../subjects/subjects.constant.js";
import { SubjectConfiguration } from "./subject-configurations.model.js";

const HUMANITIES_SCOPE = {
  programme: "HSC",
  academicSession: "2026-2027",
  className: "Class 11",
  group: "Humanities",
};

const COMPULSORY_CODES = ["BAN", "ENG", "ICT"];

const HUMANITIES_CLUSTERS = [
  {
    code: "HUMANITIES_CLUSTER_1",
    label: "History and Culture",
    subjectCodes: ["HIS", "IHC"],
  },
  {
    code: "HUMANITIES_CLUSTER_2",
    label: "Civics, Economics and Logic",
    subjectCodes: ["CGG", "ECO", "LOG"],
  },
  {
    code: "HUMANITIES_CLUSTER_3",
    label: "Society and Geography",
    subjectCodes: ["SOC", "SWK", "GEO"],
  },
];

// Explicit fourth-subject options.
// Sports (SPT) is excluded because it is BKSP-specific.
const FOURTH_SUBJECT_CODES = [
  "PSY",
  "STA",
  "AGE",
  "SOS",
  "HSC",
  "FAC",
  "ACT",
  "EDW",
  "DRA",
  "ARA",
  "PAL",
  "SAN",
  "LTM",
  "CLM",
  "IST",
  "CHD",
  "FNU",
  "HMF",
];

export const seedHumanitiesSubjectConfiguration = async () => {
  const allCodes = [
    ...COMPULSORY_CODES,
    ...HUMANITIES_CLUSTERS.flatMap((cluster) => cluster.subjectCodes),
    ...FOURTH_SUBJECT_CODES,
  ];

  const uniqueCodes = [...new Set(allCodes)];

  const subjectsFromDB = await Subject.find({
    code: { $in: uniqueCodes },
    status: SUBJECT_STATUS.ACTIVE,
    isDeleted: false,
  }).select("_id code");

  const subjectMap = new Map(
    subjectsFromDB.map((subject) => [subject.code, subject._id]),
  );

  const missingCodes = uniqueCodes.filter((code) => !subjectMap.has(code));

  if (missingCodes.length) {
    throw new Error(
      `Missing active subjects in Subject Master: ${missingCodes.join(", ")}`,
    );
  }

  const configuredSubjects = [];

  // Common compulsory subjects
  for (const code of COMPULSORY_CODES) {
    configuredSubjects.push({
      subject: subjectMap.get(code)!,
      subjectType: "COMPULSORY",
      isMainSubjectEligible: false,
      isFourthSubjectEligible: false,
    });
  }

  // Three Humanities selection clusters
  for (const cluster of HUMANITIES_CLUSTERS) {
    for (const code of cluster.subjectCodes) {
      configuredSubjects.push({
        subject: subjectMap.get(code)!,
        subjectType: "CHOICE",
        isMainSubjectEligible: true,
        isFourthSubjectEligible: false,
        selectionGroup: cluster.code,
      });
    }
  }

  // Explicit fourth-subject options
  for (const code of FOURTH_SUBJECT_CODES) {
    configuredSubjects.push({
      subject: subjectMap.get(code)!,
      subjectType: "CHOICE",
      isMainSubjectEligible: false,
      isFourthSubjectEligible: true,
      selectionGroup: "HUMANITIES_FOURTH",
    });
  }

  const selectionGroups = [
    ...HUMANITIES_CLUSTERS.map((cluster) => ({
      code: cluster.code,
      label: cluster.label,
      minSelections: 1,
      maxSelections: 1,
    })),
    {
      code: "HUMANITIES_FOURTH",
      label: "Fourth Subject Options",
      minSelections: 0,
      maxSelections: 1,
    },
  ];

  const configuration = await SubjectConfiguration.findOneAndUpdate(
    {
      ...HUMANITIES_SCOPE,
      isDeleted: false,
    },
    {
      $set: {
        subjects: configuredSubjects,
        selectionGroups,
        isDeleted: false,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  console.log(`Humanities configuration saved: ${configuration._id}`);

  return configuration;
};
