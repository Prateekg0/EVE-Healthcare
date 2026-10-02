import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthModal({ initialMode, onSuccess }) {
  const { request } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setMode(initialMode), [initialMode]);

  const submit = async event => {
    event.preventDefault();

    setBusy(true);
    setError('');

    try {
      const data = await request(`/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify({
          ...(mode === 'signup' ? { name } : {}),
          email,
          password,
        }),
      });

      onSuccess(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="text-[10px] font-bold tracking-[1.65px] text-[#8a948b]">
        {mode === 'login' ? 'WELCOME BACK' : 'YOUR HEALTH JOURNEY'}
      </div>

      <h2 className="my-[10px] font-display text-[26px] font-semibold tracking-[-1px] text-[#304034]">
        {mode === 'login' ? 'Good to see you.' : 'Let’s get started.'}
      </h2>

      <p className="mb-[21px] text-xs text-[#879087]">
        {mode === 'login'
          ? 'Sign in to manage your appointments.'
          : 'Create an account to book trusted care.'}
      </p>

      <form className="grid gap-[13px]" onSubmit={submit}>
        {mode === 'signup' && (
          <label className="grid gap-[7px] text-[10px] font-semibold text-[#5b665c]">
            Your name

            <input
              className="rounded-md border border-[#e4e8e0] bg-white px-3 py-[11px] text-xs text-[#304034] outline-none focus:border-[#91a78f] focus:ring-4 focus:ring-[#91a78f]/10"
              required
              minLength="2"
              maxLength="60"
              value={name}
              onChange={event => setName(event.target.value)}
              placeholder="Jamie Rivera"
              autoComplete="name"
            />
          </label>
        )}

        <label className="grid gap-[7px] text-[10px] font-semibold text-[#5b665c]">
          Email address

          <input
            className="rounded-md border border-[#e4e8e0] bg-white px-3 py-[11px] text-xs text-[#304034] outline-none focus:border-[#91a78f] focus:ring-4 focus:ring-[#91a78f]/10"
            type="email"
            required
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label className="grid gap-[7px] text-[10px] font-semibold text-[#5b665c]">
          Password

          <input
            className="rounded-md border border-[#e4e8e0] bg-white px-3 py-[11px] text-xs text-[#304034] outline-none focus:border-[#91a78f] focus:ring-4 focus:ring-[#91a78f]/10"
            type="password"
            minLength="8"
            required
            value={password}
            onChange={event => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            autoComplete={
              mode === 'login' ? 'current-password' : 'new-password'
            }
          />
        </label>

        {error && (
          <div className="rounded bg-[#fbefec] px-2.5 py-[9px] text-[11px] text-[#ad5f54]">
            {error}
          </div>
        )}

        <button
          disabled={busy}
          className="mt-1 flex w-full justify-between rounded-md bg-eve-green px-5 py-[13px] text-[13px] font-semibold text-white hover:bg-[#243b2c] disabled:opacity-60"
        >
          {busy
            ? 'One moment…'
            : mode === 'login'
              ? 'Log in'
              : 'Create account'}

          <span>↗</span>
        </button>
      </form>

      <div className="mt-[18px] text-center text-[11px] text-[#899087]">
        {mode === 'login'
          ? 'New to EVE?'
          : 'Already have an account?'}{' '}

        <button
          className="border-0 bg-transparent text-[11px] font-semibold text-[#527353]"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError('');
          }}
        >
          {mode === 'login' ? 'Create an account' : 'Log in'}
        </button>
      </div>
    </>
  );
}