import { useState } from "react";

export default function ExtensionSimulator() {
  const [open, setOpen] = useState(false);
  const [scanResult, setScanResult] = useState<{
  images: number;
  missingAlt: number;
  unlabeledButtons: number;
  emptyLinks: number;
} | null>(null);

 const scanPage = () => {
  const images = document.querySelectorAll("img");

  const missingAlt = Array.from(images).filter(
    (img) => !img.getAttribute("alt")
  );

  const buttons = document.querySelectorAll("button");

  const unlabeledButtons = Array.from(buttons).filter(
    (button) =>
      !button.textContent?.trim() &&
      !button.getAttribute("aria-label") &&
      !button.getAttribute("title")
  );
  const links = document.querySelectorAll("a");

const emptyLinks = Array.from(links).filter(
  (link) =>
    !link.textContent?.trim() &&
    !link.getAttribute("aria-label") &&
    !link.getAttribute("title")
);

 setScanResult({
  images: images.length,
  missingAlt: missingAlt.length,
  unlabeledButtons: unlabeledButtons.length,
  emptyLinks: emptyLinks.length,
});
};

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-[#28e98c] text-black font-bold shadow-lg"
        aria-label="Open AccessAI accessibility extension"
      >
        AI
      </button>

      {open && (
        <div className="absolute bottom-16 right-0 w-72 rounded-xl border border-neutral-700 bg-[#0d1117] p-4 text-white shadow-2xl">
          <h3 className="text-lg font-bold text-[#28e98c]">
            AccessAI Extension
          </h3>

          <p className="mt-2 text-sm text-neutral-400">
            Accessibility audit simulator
          </p>

          <div className="mt-4 rounded-lg border border-neutral-700 p-3">
            <p className="text-sm">Page Status</p>
            <p className="mt-1 text-[#28e98c]">
              ✓ Ready to audit
            </p>
          </div>

          <button
            onClick={scanPage}
            className="mt-3 w-full rounded-lg bg-[#28e98c] py-2 font-semibold text-black"
          >
            Scan This Page
          </button>

          {scanResult && (
  <div className="mt-4 rounded-lg border border-neutral-700 p-3">
    <p className="text-sm font-semibold text-[#28e98c]">
      Audit Results
    </p>

    <div className="mt-3 space-y-2 text-sm">
      <div className="flex justify-between text-neutral-300">
        <span>Images found</span>
        <span className="font-semibold">{scanResult.images}</span>
      </div>

      <div className="flex justify-between text-neutral-300">
        <span>Missing alt text</span>
        <span className="font-semibold">{scanResult.missingAlt}</span>
      </div>

      <div className="flex justify-between text-neutral-300">
        <span>Unlabeled buttons</span>
        <span className="font-semibold">{scanResult.unlabeledButtons}</span>
      </div>

      <div className="flex justify-between text-neutral-300">
        <span>Empty links</span>
        <span className="font-semibold">{scanResult.emptyLinks}</span>
      </div>
    </div>
  </div>
)}
        </div>
      )}
    </div>
  );
}