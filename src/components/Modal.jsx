import { useEffect } from 'react';

import AuthModal from './AuthModal.jsx';
import BookingModal from './BookingModal.jsx';

export default function Modal({
  type,
  onClose,
  onAuthSuccess,
  onBooked,
}) {
  const bookingSelection = typeof type === 'object' ? type : null;

  // Handle Escape Key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center bg-[#18231b]/40 p-5 backdrop-blur-[3px]"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onClose()
      }>
      <div className="relative w-full max-w-[420px] rounded-xl bg-[#fffefa] p-[33px_34px_29px] shadow-2xl max-sm:p-[29px_23px_24px]">
        {/* Close Button */}
        <button
          className="absolute right-[17px] top-[13px] border-0 bg-transparent text-[25px] text-[#8c958b]"
          aria-label="Close"
          onClick={onClose}>
          ×
        </button>

        {/* Modal Icon */}
        <div className="mb-[21px] grid h-9 w-9 place-items-center rounded-[12px_12px_12px_4px] bg-[#e9efe5] text-[#718b6c]">
          ✳
        </div>

        {/* Modal Content */}
        {bookingSelection ? (
          <BookingModal
            selection={bookingSelection}
            onClose={onClose}
            onBooked={onBooked}
          />
        ) : (
          <AuthModal
            initialMode={type}
            onSuccess={onAuthSuccess}
          />
        )}
      </div>
    </div>
  );
}