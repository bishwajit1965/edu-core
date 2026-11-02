import {
  AlertCircleIcon,
  CircleCheckBig,
  LucideLoader,
  LucideUploadCloud,
  XCircle,
} from "lucide-react";

import Modal from "./Modal";
import Button from "./Button";

interface ConfirmActionDialogueProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirmAction?: {
    isPending?: boolean;
  };
  action?: string;
}

const ConfirmActionDialogue = ({
  isOpen,
  onClose,
  onConfirm,
  icon = <CircleCheckBig size={25} className="text-blue-500" />,
  title = "Confirm the Action",
  message = "Are you sure you want to continue with ?",
  confirmText = "Submit",
  cancelText = "Cancel",
  loading = false,
  onConfirmAction,
  action = "Action",
}: ConfirmActionDialogueProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        {/* Message */}
        <div className="flex items-center gap-3">
          <span className="">{icon}</span>

          <p className="text-sm text-gray-700">
            {message} {action && action}
          </p>
        </div>

        {/* Warning */}
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
          <AlertCircleIcon size={18} className="mt-0.5 text-blue-500" />

          <p className="text-sm text-gray-800">
            {`Please think again before ${action} is complete !`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="warning" size="xs" onClick={onClose} icon={XCircle}>
            {cancelText}
          </Button>

          <Button
            variant="primary"
            size="xs"
            disabled={onConfirmAction?.isPending}
            onClick={onConfirm}
            loading={loading}
          >
            {onConfirmAction?.isPending ? (
              <LucideLoader size={14} className="animate-spin" />
            ) : (
              <LucideUploadCloud size={14} />
            )}

            {onConfirmAction?.isPending ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmActionDialogue;
