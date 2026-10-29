import React from 'react';
import { X, Users } from 'lucide-react';
import { UserProfile } from '../types';
import { CommunityHub } from './CommunityHub';

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  currency: string;
}

export const CommunityModal: React.FC<CommunityModalProps> = ({
  isOpen,
  onClose,
  user,
  currency
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1B333F]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FAF6F2] border border-[rgba(43,79,96,0.2)] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 p-5 sm:p-6 relative text-xs">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[rgba(43,79,96,0.12)] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2B4F60] flex items-center justify-center text-white">
              <Users className="w-5 h-5 text-[#EAD3CB]" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#1B333F]">
                Community Hub & Group Sprints
              </h2>
              <p className="text-[11px] text-[#5B6E75]">
                Share financial updates, ask questions, and join accountability challenges.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#5B6E75] hover:text-[#1B333F] hover:bg-white rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Community Hub Content */}
        <div className="pt-2">
          <CommunityHub user={user} currency={currency} />
        </div>
      </div>
    </div>
  );
};
