import React from 'react';
import Image from 'next/image';
import { Facebook, Phone } from 'lucide-react';

type TeamCardProps = {
  name: string;
  title: string;
  imageUrl: string;
  phone: string;
  facebook: string;
};

const TeamCard: React.FC<TeamCardProps> = ({ name, title, imageUrl, phone, facebook }) => {
  return (
    <div className="flex flex-col items-center bg-gray-50 pt-16 pb-6 px-6 border border-gray-200 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="md:w-70 md:h-70 w-50 h-50 mb-6 rounded-full border-2 sm:p-5 p-2 border-brand-900 overflow-hidden shadow relative">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 120px, 200px"
          className="object-cover rounded-full"
        />
      </div>

      {/* Divider */}
      <div className="w-full border-t border-gray-200 my-2 text-center" />

      {/* Text */}
      <div className="w-full px-4">
        <div className="mb-5 w-full">
          <h3 className="text-md sm:text-2xl font-bold text-gray-900 mb-3">{name}</h3>
          <p className="sm:text-sm text-xs font-semibold text-brand-500">{title}</p>
        </div>

        {/* Social Links */}
        <div className="flex gap-2 justify-center">
          <a href={facebook} aria-label="Facebook">
            <button className="p-2 bg-gray-900 rounded-full hover:bg-brand-900 transition">
              <Facebook className="w-4 h-4 text-white" />
            </button>
          </a>

          <a href={phone} aria-label="Phone">
            <button className="p-2 bg-gray-900 rounded-full hover:bg-brand-900 transition">
              <Phone className="w-4 h-4 text-white" />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
