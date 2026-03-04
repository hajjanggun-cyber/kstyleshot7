"use client";

type DownloadButtonProps = {
  href?: string | null;
  filename?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export function DownloadButton({
  href,
  filename = "result.jpg",
  label = "Download",
  disabled = false,
  className
}: DownloadButtonProps) {
  function handleClick() {
    if (!href || disabled) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = filename;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  return (
    <button
      className={className ? `button ${className}` : "button"}
      disabled={disabled || !href}
      onClick={handleClick}
      type="button"
    >
      {label}
    </button>
  );
}
