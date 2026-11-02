import {
  AlertCircleIcon,
  CircleCheckBig,
  LucideLoader,
  LucideTrash2,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";

import Modal from "./Modal";
import Button from "./Button";

type ConfirmDialogueProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon?: ReactNode;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onDelete?: {
    isPending?: boolean;
  };
};

export default function ConfirmDialogue({
  isOpen,
  onClose,
  onConfirm,
  icon = <CircleCheckBig size={25} className="text-blue-500" />,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onDelete,
}: ConfirmDialogueProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        {/* Message */}
        <div className="flex items-center gap-3">
          <span className="">{icon}</span>

          <p className="text-sm text-gray-700">{message}</p>
        </div>

        {/* Warning */}
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
          <AlertCircleIcon size={18} className="mt-0.5 text-red-500" />

          <p className="text-sm text-red-500">
            Once deleted, this action cannot be revoked.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="warning" size="xs" onClick={onClose} icon={XCircle}>
            {cancelText}
          </Button>

          <Button
            variant="danger"
            size="xs"
            disabled={onDelete?.isPending}
            onClick={onConfirm}
            loading={loading}
          >
            {onDelete?.isPending ? (
              <LucideLoader size={14} className="animate-spin" />
            ) : (
              <LucideTrash2 size={14} />
            )}

            {onDelete?.isPending ? "Deleting..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
