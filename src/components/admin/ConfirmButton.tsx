"use client";

export default function ConfirmButton({
  children,
  confirmText,
  className,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  confirmText: string;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <button
      type="submit"
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
