import { X } from "lucide-react";
import { cn } from "../../utils/utils.js";
import type { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  showClose?: boolean;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  showClose = true,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : "Dialog"}
        className={cn(
          "bg-base-100 lg:p-4 p-2 py-2 rounded-xl shadow-xl lg:w-[95%] w-[96%] max-w-lg relative lg:text-lg text-xs flex flex-col max-h-[90vh]",
          className,
        )}
      >
        {showClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black dark:hover:text-white"
          >
            <X className="w-7 h-7 bg-base-200 hover:bg-base-300 rounded-full p-1 text-base-content shadow-sm border border-base-content/15 cursor-pointer hover:text-red-500" />
          </button>
        )}
        {title && (
          <h2 className="lg:text-2xl text-lg font-bold flex items-center gap-x-4 mb-2 pb-1 border-b border-base-content/20">
            {title}
          </h2>
        )}
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
