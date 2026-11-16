import { UsersRound } from "lucide-react";
import Card from "../../../../../components/ui/Card";
import type { Student } from "../../../../students/studentsApi";

interface ParentsInformationProps {
  student: Student;
}

interface InfoItemProps {
  label: string;
  value?: React.ReactNode;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div>
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-1 font-medium text-slate-800">{value ?? "Not provided"}</p>
  </div>
);
const ParentsInformation = ({ student }: ParentsInformationProps) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-800">
        <UsersRound />
        Parents & Guardian Information
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Father's Information */}
        <Card>
          <h3 className="mb-4 border-b border-slate-200 pb-2 font-semibold text-slate-700">
            Father's Information
          </h3>

          <div className="space-y-4">
            <InfoItem label="Father's Name" value={student?.fatherName ?? ""} />
            <InfoItem
              label="Occupation"
              value={student?.fatherOccupation ?? ""}
            />
          </div>
        </Card>

        {/* Mother's Information */}
        <Card>
          <h3 className="mb-4 border-b border-slate-200 pb-2 font-semibold text-slate-700">
            Mother's Information
          </h3>

          <div className="space-y-4">
            <InfoItem label="Mother's Name" value={student?.motherName ?? ""} />
            <InfoItem
              label="Occupation"
              value={student?.motherOccupation ?? ""}
            />
          </div>
        </Card>

        {/* Guardian Information */}
        <Card>
          <h3 className="mb-4 border-b border-slate-200 pb-2 font-semibold text-slate-700">
            Guardian Information
          </h3>

          {student?.guardians?.length ? (
            <div className="space-y-6">
              {student?.guardians?.map((guardian, index) => (
                <div key={`${guardian?.phone}-${index}`}>
                  <h4 className="mb-3 font-semibold text-slate-800">
                    Guardian {index + 1}
                  </h4>

                  <div className="space-y-3">
                    <InfoItem label="Name" value={guardian?.name} />
                    <InfoItem
                      label="Relationship"
                      value={guardian?.relationship}
                    />
                    <InfoItem label="Phone" value={guardian?.phone} />
                    <InfoItem label="Email" value={guardian?.email} />
                    <InfoItem label="Address" value={guardian?.address} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No guardian information available.
            </p>
          )}
        </Card>
      </div>
    </section>
  );
};

export default ParentsInformation;
