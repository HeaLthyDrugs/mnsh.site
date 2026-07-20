/** Reliable clipboard write with textarea fallback for restricted contexts. */
export const copyText = async (text: string) => {
  if (typeof window === "undefined") {
    throw new Error("Clipboard is not available");
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to legacy path
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.width = "1px";
  textarea.style.height = "1px";
  textarea.style.padding = "0";
  textarea.style.border = "none";
  textarea.style.outline = "none";
  textarea.style.boxShadow = "none";
  textarea.style.background = "transparent";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  try {
    const ok = document.execCommand("copy");
    if (!ok) {
      throw new Error("execCommand('copy') failed");
    }
  } finally {
    document.body.removeChild(textarea);
  }
};
