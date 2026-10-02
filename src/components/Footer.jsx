export default function Footer() {
  return (
    <footer className="mx-auto flex h-[76px] max-w-[1160px] items-center gap-5 border-t border-[#e9ebe5] text-[10px] text-[#91978f] max-md:mx-[18px] max-md:h-[70px] max-md:gap-2">
      {/* Logo */}
      <div className="flex items-center gap-2 font-display text-sm font-bold text-[#344438]">
        <span className="grid h-6 w-6 place-items-center rounded-[7px_7px_7px_3px] bg-[#355543] font-serif text-base italic text-[#f1f5ef]">
          e
        </span>

        <strong>
          EVE
          <span className="font-medium text-[#839087]">
            health
          </span>
        </strong>
      </div>

      {/* Tagline */}
      <span className="max-md:text-[9px]">
        Thoughtful diagnostics. Better days ahead.
      </span>

      {/* Copyright */}
      <span className="ml-auto text-[10px] max-md:text-[8px]">
        © 2026 EVE Healthcare
      </span>
    </footer>
  );
}