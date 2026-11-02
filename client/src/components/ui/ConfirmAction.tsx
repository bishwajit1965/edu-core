import {
  AlertTriangleIcon,
  CircleCheckBig,
  CheckCircle2Icon,
  XCircle,
} from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

type ConfirmActionProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  setState?: React.Dispatch<React.SetStateAction<boolean>> | null;
  loading?: boolean;
};

const ConfirmAction = ({
  isOpen,
  onClose,
  onConfirm,
  icon = <CircleCheckBig size={24} className="text-blue-500" />,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Suspend",
  cancelText = "Cancel",
  setState = null,
  loading = false,
}: ConfirmActionProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        {/* Message */}
        <div className="flex items-start gap-3">
          <span className="mt-0.5">{icon}</span>

          <p className="text-sm text-gray-700">{message}</p>
        </div>

        {/* Warning */}
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
          <AlertTriangleIcon size={18} className="mt-0.5 text-red-500" />

          <p className="text-sm text-red-700">{`Finally, want to ${setState ? "suspend" : "revoke suspension"} ?`}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="warning" size="xs" onClick={onClose} icon={XCircle}>
            {cancelText}
          </Button>

          <Button
            variant="success"
            size="xs"
            onClick={onConfirm}
            icon={CheckCircle2Icon}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmAction;
