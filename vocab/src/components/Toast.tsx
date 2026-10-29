import React from 'react';

interface ToastProps {
  message: string | null;
  isSuccess: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, isSuccess }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-full text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-none ${
        isSuccess ? 'bg-emerald-600 shadow-emerald-600/30' : 'bg-rose-600 shadow-rose-600/30'
      }`}
    >
      <span>{message}</span>
    </div>
  );
};
