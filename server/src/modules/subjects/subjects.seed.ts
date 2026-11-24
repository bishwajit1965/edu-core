import { Subject } from "./subjects.model.js";
import { SUBJECT_STATUS } from "./subjects.constant.js";
import connectDB from "../../database/db.js";
import mongoose from "mongoose";

const hscSubjects = [
  {
    name: "Bangla",
    code: "BAN",
    papers: [
      { name: "1st Paper", boardCode: "101" },
      { name: "2nd Paper", boardCode: "102" },
    ],
  },
  {
    name: "English",
    code: "ENG",
    papers: [
      { name: "1st Paper", boardCode: "107" },
      { name: "2nd Paper", boardCode: "108" },
    ],
  },
  {
    name: "Information and Communication Technology",
    code: "ICT",
    papers: [{ name: "Single Paper", boardCode: "275" }],
  },
  {
    name: "Physics",
    code: "PHY",
    papers: [
      { name: "1st Paper", boardCode: "174" },
      { name: "2nd Paper", boardCode: "175" },
    ],
  },
  {
    name: "Chemistry",
    code: "CHE",
    papers: [
      { name: "1st Paper", boardCode: "176" },
      { name: "2nd Paper", boardCode: "177" },
    ],
  },
  {
    name: "Biology",
    code: "BIO",
    papers: [
      { name: "1st Paper", boardCode: "178" },
      { name: "2nd Paper", boardCode: "179" },
    ],
  },
  {
    name: "Higher Mathematics",
    code: "HMA",
    papers: [
      { name: "1st Paper", boardCode: "265" },
      { name: "2nd Paper", boardCode: "266" },
    ],
  },
  {
    name: "History",
    code: "HIS",
    papers: [
      { name: "1st Paper", boardCode: "304" },
      { name: "2nd Paper", boardCode: "305" },
    ],
  },
  {
    name: "Islamic History and Culture",
    code: "IHC",
    papers: [
      { name: "1st Paper", boardCode: "267" },
      { name: "2nd Paper", boardCode: "268" },
    ],
  },
  {
    name: "Civics and Good Governance",
    code: "CGG",
    papers: [
      { name: "1st Paper", boardCode: "269" },
      { name: "2nd Paper", boardCode: "270" },
    ],
  },
  {
    name: "Economics",
    code: "ECO",
    papers: [
      { name: "1st Paper", boardCode: "109" },
      { name: "2nd Paper", boardCode: "110" },
    ],
  },
  {
    name: "Logic",
    code: "LOG",
    papers: [
      { name: "1st Paper", boardCode: "121" },
      { name: "2nd Paper", boardCode: "122" },
    ],
  },
  {
    name: "Sociology",
    code: "SOC",
    papers: [
      { name: "1st Paper", boardCode: "117" },
      { name: "2nd Paper", boardCode: "118" },
    ],
  },
  {
    name: "Social Work",
    code: "SWK",
    papers: [
      { name: "1st Paper", boardCode: "271" },
      { name: "2nd Paper", boardCode: "272" },
    ],
  },
  {
    name: "Geography",
    code: "GEO",
    papers: [
      { name: "1st Paper", boardCode: "125" },
      { name: "2nd Paper", boardCode: "126" },
    ],
  },
  {
    name: "Business Organization and Management",
    code: "BOM",
    papers: [
      { name: "1st Paper", boardCode: "277" },
      { name: "2nd Paper", boardCode: "278" },
    ],
  },
  {
    name: "Accounting",
    code: "ACC",
    papers: [
      { name: "1st Paper", boardCode: "253" },
      { name: "2nd Paper", boardCode: "254" },
    ],
  },
  {
    name: "Finance, Banking and Insurance",
    code: "FBI",
    papers: [
      { name: "1st Paper", boardCode: "292" },
      { name: "2nd Paper", boardCode: "293" },
    ],
  },
  {
    name: "Production Management and Marketing",
    code: "PMM",
    papers: [
      { name: "1st Paper", boardCode: "286" },
      { name: "2nd Paper", boardCode: "287" },
    ],
  },
  {
    name: "Islamic Studies",
    code: "IST",
    papers: [
      { name: "1st Paper", boardCode: "249" },
      { name: "2nd Paper", boardCode: "250" },
    ],
  },
  {
    name: "Child Development",
    code: "CHD",
    papers: [
      { name: "1st Paper", boardCode: "298" },
      { name: "2nd Paper", boardCode: "299" },
    ],
  },
  {
    name: "Food and Nutrition",
    code: "FNU",
    papers: [
      { name: "1st Paper", boardCode: "279" },
      { name: "2nd Paper", boardCode: "280" },
    ],
  },
  {
    name: "Home Management and Family Life",
    code: "HMF",
    papers: [
      { name: "1st Paper", boardCode: "282" },
      { name: "2nd Paper", boardCode: "283" },
    ],
  },
  {
    name: "Agricultural Education",
    code: "AGE",
    papers: [
      { name: "1st Paper", boardCode: "239" },
      { name: "2nd Paper", boardCode: "240" },
    ],
  },
  {
    name: "Psychology",
    code: "PSY",
    papers: [
      { name: "1st Paper", boardCode: "123" },
      { name: "2nd Paper", boardCode: "124" },
    ],
  },
  {
    name: "Statistics",
    code: "STA",
    papers: [
      { name: "1st Paper", boardCode: "129" },
      { name: "2nd Paper", boardCode: "130" },
    ],
  },
  {
    name: "Soil Science",
    code: "SOS",
    papers: [
      { name: "1st Paper", boardCode: "288" },
      { name: "2nd Paper", boardCode: "289" },
    ],
  },
  {
    name: "Home Science",
    code: "HSC",
    papers: [
      { name: "1st Paper", boardCode: "273" },
      { name: "2nd Paper", boardCode: "274" },
    ],
  },
  {
    name: "Fine Arts and Crafts",
    code: "FAC",
    papers: [
      { name: "1st Paper", boardCode: "225" },
      { name: "2nd Paper", boardCode: "226" },
    ],
  },
  {
    name: "Arts and Crafts and Textile Apparel",
    code: "ACT",
    papers: [
      { name: "1st Paper", boardCode: "284" },
      { name: "2nd Paper", boardCode: "285" },
    ],
  },
  {
    name: "Engineering Drawing and Workshop Practice",
    code: "EDW",
    papers: [
      { name: "1st Paper", boardCode: "182" },
      { name: "2nd Paper", boardCode: "183" },
    ],
  },
  {
    name: "Sports",
    code: "SPT",
    papers: [
      { name: "1st Paper", boardCode: "158" },
      { name: "2nd Paper", boardCode: "159" },
    ],
  },
  {
    name: "Drama",
    code: "DRA",
    papers: [
      { name: "1st Paper", boardCode: "227" },
      { name: "2nd Paper", boardCode: "228" },
    ],
  },
  {
    name: "Arabic",
    code: "ARA",
    papers: [
      { name: "1st Paper", boardCode: "133" },
      { name: "2nd Paper", boardCode: "134" },
    ],
  },
  {
    name: "Pali",
    code: "PAL",
    papers: [
      { name: "1st Paper", boardCode: "139" },
      { name: "2nd Paper", boardCode: "140" },
    ],
  },
  {
    name: "Sanskrit",
    code: "SAN",
    papers: [
      { name: "1st Paper", boardCode: "137" },
      { name: "2nd Paper", boardCode: "138" },
    ],
  },

  {
    name: "Light Music",
    code: "LTM",
    papers: [
      { name: "1st Paper", boardCode: "216" },
      { name: "2nd Paper", boardCode: "217" },
    ],
  },
  {
    name: "Classical Music",
    code: "CLM",
    papers: [
      { name: "1st Paper", boardCode: "218" },
      { name: "2nd Paper", boardCode: "219" },
    ],
  },
];

export const seedHscSubjects = async () => {
  try {
    await connectDB();
    const operations = hscSubjects.map((subject) => ({
      updateOne: {
        filter: { code: subject.code },
        update: {
          // Note : $set instead of $setOnInsert will update all data
          $set: {
            ...subject,
            status: SUBJECT_STATUS.ACTIVE,
            isDeleted: false,
          },
        },
        upsert: true,
      },
    }));

    const result = await Subject.bulkWrite(operations);
    console.log("HSC subjects seeded successfully:", result);
    return result;
  } catch (error) {
    console.error("HSC subjects seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedHscSubjects();
