import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

function getMinimumAppointmentTime() {
  const minimum = new Date(Date.now() + 60 * 60 * 1000);

  minimum.setMinutes(
    Math.ceil(minimum.getMinutes() / 30) * 30,
    0,
    0
  );

  return new Date(
    minimum.getTime() - minimum.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);
}

export default function BookingModal({ selection, onClose, onBooked }) {
  const { request } = useAuth();

  const [date, setDate] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const { centre, test } = selection;

  const submit = async event => {
    event.preventDefault();

    setBusy(true);
    setError('');

    try {
      await request('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          centreId: centre._id,
          testId: test._id,
          appointmentAt: new Date(date).toISOString(),
        }),
      });

      onBooked();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="text-[10px] font-bold tracking-[1.65px] text-[#8a948b]">
        MAKE IT YOURS
      </div>

      <h2 className="my-[10px] font-display text-[26px] font-semibold tracking-[-1px] text-[#304034]">
        Choose your time.
      </h2>

      <p className="mb-[21px] text-xs text-[#879087]">
        {test.name} at {centre.name}
      </p>

      <div className="mb-[17px] flex items-center justify-between rounded-md bg-[#f2f4ef] p-[13px]">
        <span className="text-[10px] text-[#858e84]">
          {test.duration} · {centre.location}
        </span>

        <strong className="text-sm text-[#415441]">
          ₹{test.price.toLocaleString('en-IN')}
        </strong>
      </div>

      <form className="grid gap-[13px]" onSubmit={submit}>
        <label className="grid gap-[7px] text-[10px] font-semibold text-[#5b665c]">
          Appointment date &amp; time

          <input
            className="rounded-md border border-[#e4e8e0] bg-white px-3 py-[11px] text-xs text-[#304034] outline-none focus:border-[#91a78f] focus:ring-4 focus:ring-[#91a78f]/10"
            type="datetime-local"
            required
            min={getMinimumAppointmentTime()}
            value={date}
            onChange={event => setDate(event.target.value)}
          />
        </label>

        {error && (
          <div className="rounded bg-[#fbefec] px-2.5 py-[9px] text-[11px] text-[#ad5f54]">
            {error}
          </div>
        )}

        <button
          disabled={busy}
          className="mt-1 flex w-full justify-between rounded-md bg-eve-green px-5 py-[13px] text-[13px] font-semibold text-white hover:bg-[#243b2c] disabled:opacity-60">
          {busy ? 'Booking…' : 'Confirm booking'}
          <span>↗</span>
        </button>
      </form>
    </>
  );
}