import React from 'react';
import { twMerge } from 'tailwind-merge';
import { mascotAxolotl } from '../../features/users/constants/authImages';

const Logo = ({ className, onClick }) => {
  return (
    <a
      href="/"
      className={twMerge(
        'flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-teal-light rounded transition-opacity duration-200 hover:opacity-90',
        className
      )}
      onClick={onClick}
      aria-label="Devcopet home"
    >
      <img
        src={mascotAxolotl}
        alt=""
        className="h-8 w-8 shrink-0 rounded-full object-cover object-top sm:h-9 sm:w-9"
      />
      <span
        className="text-lg font-bold text-white sm:text-xl"
        style={{ fontFamily: 'Montserrat' }}
      >
        Devcopet
      </span>
    </a>
  );
};

export default Logo;
