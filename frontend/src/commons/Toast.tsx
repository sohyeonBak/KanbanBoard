import React, { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm4.7 7.7l-5 5a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.4L9 10.6l4.3-4.3a1 1 0 0 1 1.4 1.4z" />
          </svg>
        );
      case "error":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm1 14a1 1 0 0 1-2 0v-1a1 1 0 0 1 2 0v1zm0-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v4z" />
          </svg>
        );
      case "info":
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm1 14a1 1 0 0 1-2 0v-4a1 1 0 0 1 2 0v4zm0-7a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v1z" />
          </svg>
        );
    }
  };

  return (
    <div className={`toast toast-${toast.type} ${isExiting ? "toast-exit" : ""}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{toast.message}</div>
      <button
        className="toast-close"
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onRemove(toast.id), 300);
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 6.586L2.929 1.515 1.515 2.929 6.586 8l-5.071 5.071 1.414 1.414L8 9.414l5.071 5.071 1.414-1.414L9.414 8l5.071-5.071-1.414-1.414L8 6.586z" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
