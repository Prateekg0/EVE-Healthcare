import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext.jsx';

export default function BookingsPage({ onPay, onChanged }) {
  const { request, user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  // Fetch Bookings
  const refresh = useCallback(async () => {
    try {
      const data = await request('/bookings');

      setBookings(data.bookings);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  }, [request]);

  // Load Bookings on Component Mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Cancel Booking
  const cancel = async (id) => {
    try {
      await request(`/bookings/${id}/cancel`, {
        method: 'PATCH',
      });

      onChanged('Booking cancelled.');
      refresh();
    } catch (requestError) {
      onChanged(requestError.message);
    }
  };

  return (
    <section className="mx-auto min-h-[70vh] max-w-[900px] px-2.5 py-[82px] max-md:px-[18px] max-md:py-[53px]">
      {/* Page Heading */}
      <div className="text-[10px] font-bold tracking-[1.65px] text-[#8a948b]">
        YOUR CARE, ALL IN ONE PLACE
      </div>

      <h1 className="my-[14px] font-display text-[41px] font-semibold tracking-[-2px] text-[#25352b] max-md:text-[35px]">
        My bookings
        <span className="text-[#79957a]">.</span>
      </h1>

      <p className="mb-[34px] text-[13px] text-[#899189]">
        Hi {user?.name.split(' ')[0]}, here’s your appointment timeline.
      </p>

      {/* Error State */}
      {error ? (
        <div className="p-[60px_15px] text-center text-[13px] text-[#858e85]">
          {error}{' '}

          <button
            className="font-semibold text-[#47704f]"
            onClick={refresh}>
            Try again
          </button>
        </div>
      ) : bookings.length === 0 ? (
        /* Empty State */
        <div className="p-[60px_15px] text-center text-[#858e85]">
          <div className="text-[34px] text-[#90a58e]">
            ✳
          </div>

          <h3 className="my-3.5 font-display text-base font-semibold text-[#435045]">
            Your next step starts here.
          </h3>

          <p className="text-xs">
            When you book a test, it’ll show up here.
          </p>
        </div>
      ) : (
        /* Bookings List */
        <div className="grid gap-3">
          {bookings.map((booking) => (
            <article
              className="flex items-center gap-[17px] rounded-lg border border-[#e8ebe5] bg-[#fffefa] p-[18px] max-md:items-start max-md:gap-2.5 max-md:p-[13px]"
              key={booking._id}>
              {/* Appointment Date */}
              <div className="flex h-[51px] w-12 shrink-0 flex-col items-center justify-center rounded-md bg-[#eef2eb] text-[#567257] max-md:h-[45px] max-md:w-[39px]">
                <strong className="font-display text-xl font-bold">
                  {new Date(booking.appointmentAt).toLocaleDateString(
                    'en-IN',
                    { day: '2-digit' }
                  )}
                </strong>

                <span className="text-[9px] tracking-[1px]">
                  {new Date(booking.appointmentAt)
                    .toLocaleDateString('en-IN', {
                      month: 'short',
                    })
                    .toUpperCase()}
                </span>
              </div>

              {/* Booking Details */}
              <div className="flex-1">
                <h3 className="font-display text-sm font-semibold max-md:text-xs">
                  {booking.testName}
                </h3>

                <p className="my-1 text-[11px] text-[#818a81] max-md:text-[9px]">
                  {booking.centreName} · {booking.location}
                </p>

                <small className="text-[10px] text-[#a0a59f] max-md:text-[9px]">
                  {new Date(booking.appointmentAt).toLocaleString(
                    'en-IN',
                    {
                      weekday: 'long',
                      hour: 'numeric',
                      minute: '2-digit',
                    }
                  )}
                </small>
              </div>

              {/* Booking Status and Payment */}
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`rounded-full px-[9px] py-[5px] text-[9px] font-bold tracking-[.4px] ${booking.status === 'CONFIRMED'
                    ? 'bg-[#e7f0e5] text-[#5b7e5d]'
                    : booking.status === 'PENDING'
                      ? 'bg-[#f8f0dc] text-[#9b7c37]'
                      : booking.status === 'FAILED'
                        ? 'bg-[#f8e8e4] text-[#ae675a]'
                        : 'bg-[#eee] text-[#818181]'
                    }`}>
                  {booking.status}
                </span>

                <strong className="text-xs text-[#4b594c]">
                  ₹{booking.amount.toLocaleString('en-IN')}
                </strong>

                {/* Actions for Pending Bookings */}
                {booking.status === 'PENDING' && (
                  <div className="flex items-center gap-2.5 max-md:flex-col-reverse max-md:items-end max-md:gap-1">
                    <button
                      className="border-0 bg-transparent text-[10px] text-[#879087]"
                      onClick={() => cancel(booking._id)}>
                      Cancel
                    </button>

                    <button
                      className="rounded-md bg-eve-green px-[15px] py-2.5 text-xs font-semibold text-white max-md:px-[9px] max-md:py-[7px] max-md:text-[9px]"
                      onClick={async () => {
                        await onPay(booking._id);
                        refresh();
                      }}>
                      Pay now
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}