import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#041521] border-t border-[#3e494930] py-4">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-bold text-[#d8bfd8]" style={{ fontFamily: 'Montserrat' }}>Devcopet</div>
          <div className="flex flex-wrap justify-center gap-6 text-[13px] text-[#7D8A95] font-semibold tracking-wider">
            <a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a>
            <a href="#" className="hover:text-white transition-colors">TERMS</a>
            <a href="#" className="hover:text-white transition-colors">CONTACT</a>
          </div>
          <div className="text-[11px] text-[#5c6b7a] uppercase font-medium tracking-wide">
            © 2024 DEVCOPET INC. EVOLUTION COMPLETE.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
