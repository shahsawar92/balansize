"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { ReactNode,useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  actions?: ReactNode;
  classNames?: {
    backdrop?: string;
    modal?: string;
    header?: string;
    body?: string;
    footer?: string;
  };
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  actions,
  classNames = {},
  closeOnBackdropClick = true,
  showCloseButton = true,
}: ModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        classNames.backdrop || "bg-black/50 backdrop-blur-sm"
      } transition-all duration-300`}
      onClick={closeOnBackdropClick ? onClose : undefined}
      role='dialog'
      aria-modal='true'>
      <div
        className={`w-full rounded-xl bg-white shadow-xl ${
          sizeClasses[size]
        } ${classNames.modal || ""} ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={`flex items-center justify-between p-4 border-b ${
              classNames.header || ""
            }`}>
            {title && (
              <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className='p-1 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-500'
                aria-label='Close'>
                <XMarkIcon className='w-6 h-6' />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={`p-4 ${classNames.body || ""}`}>{children}</div>

        {/* Footer */}
        {actions && (
          <div
            className={`p-4 border-t flex items-center justify-end gap-3 ${
              classNames.footer || ""
            }`}>
            {actions}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
