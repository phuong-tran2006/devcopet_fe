const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-on-surface/5 w-full py-12">
      <div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-gutter">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="font-code-md text-code-md text-primary-fixed-dim font-bold">
            Gravity Code Terminal
          </span>
          <p className="font-label-sm text-label-sm text-on-tertiary-fixed-variant">
            © 2024 Gravity Code Terminal. All systems operational.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 justify-center">
          <a
            className="font-label-sm text-label-sm text-on-tertiary-fixed-variant hover:text-primary-fixed transition-colors"
            href="#"
          >
            Documentation
          </a>
          <a
            className="font-label-sm text-label-sm text-on-tertiary-fixed-variant hover:text-primary-fixed transition-colors"
            href="#"
          >
            Changelog
          </a>
          <a
            className="font-label-sm text-label-sm text-on-tertiary-fixed-variant hover:text-primary-fixed transition-colors"
            href="#"
          >
            Privacy Protocol
          </a>
          <a
            className="font-label-sm text-label-sm text-on-tertiary-fixed-variant hover:text-primary-fixed transition-colors"
            href="#"
          >
            Security
          </a>
          <a
            className="font-label-sm text-label-sm text-on-tertiary-fixed-variant hover:text-primary-fixed transition-colors"
            href="#"
          >
            Neural Link
          </a>
        </div>
        <div className="flex gap-4">
          <button className="w-10 h-10 rounded-full border border-on-surface/10 flex items-center justify-center hover:bg-on-surface/10 transition-all text-on-surface">
            <span className="material-symbols-outlined text-[20px]">
              terminal
            </span>
          </button>
          <button className="w-10 h-10 rounded-full border border-on-surface/10 flex items-center justify-center hover:bg-on-surface/10 transition-all text-on-surface">
            <span className="material-symbols-outlined text-[20px]">hub</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
