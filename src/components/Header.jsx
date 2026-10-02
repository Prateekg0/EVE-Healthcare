export default function Header({
  page,
  user,
  onNavigate,
  onSignOut,
  onOpenAuth,
}) {
  return (
    <header className="sticky top-0 z-10 flex h-[76px] items-center border-b border-[#ebede8] bg-[#fafaf7]/95 px-[5.2vw] backdrop-blur-md lg:px-[max(calc((100vw-1160px)/2),5.2vw]">
      {/* Logo */}
      <a
        className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-[-.8px]"
        onClick={() => onNavigate('home')}
      >
        <span className="grid h-[30px] w-[30px] place-items-center rounded-[10px_10px_10px_4px] bg-[#355543] font-serif text-[21px] font-bold italic text-[#f1f5ef]">
          e
        </span>

        <span>
          EVE
          <span className="font-medium text-[#839087]">
            health
          </span>
        </span>
      </a>

      {/* Navigation */}
      <nav className="ml-[76px] flex h-full items-center gap-[35px] text-[13px] text-[#7c857d] max-md:ml-6 max-md:gap-4 max-md:text-[11px]">
        <a
          className={`flex h-full items-center ${page === 'home'
              ? 'border-b-2 border-[#52745e] text-eve-ink'
              : ''
            }`}
          onClick={() => onNavigate('home')}
        >
          Find a test
        </a>

        <a
          className={`flex h-full items-center ${page === 'bookings'
              ? 'border-b-2 border-[#52745e] text-eve-ink'
              : ''
            }`}
          onClick={() =>
            user
              ? onNavigate('bookings')
              : onOpenAuth('login')
          }
        >
          My bookings
        </a>
      </nav>

      {/* User Actions */}
      <div className="ml-auto flex items-center gap-5 max-md:gap-2">
        {user ? (
          <>
            {/* User Greeting */}
            <span className="text-[13px] text-[#677168] max-md:hidden">
              Hi, {user.name.split(' ')[0]}
            </span>

            {/* Sign Out Button */}
            <button
              className="grid h-[34px] w-[34px] place-items-center rounded-full border-0 bg-[#d9e5da] font-bold text-[#37533e]"
              title="Sign out"
              onClick={onSignOut}
            >
              {user.name[0].toUpperCase()}
            </button>
          </>
        ) : (
          <>
            {/* Login Button */}
            <button
              className="border-0 bg-transparent text-[13px] font-semibold text-eve-green max-md:text-[11px]"
              onClick={() => onOpenAuth('login')}
            >
              Log in
            </button>

            {/* Create Account Button */}
            <button
              className="rounded-md bg-eve-green px-[15px] py-2.5 text-xs font-semibold text-white hover:bg-[#243b2c] max-md:px-2.5 max-md:py-2 max-md:text-[10px]"
              onClick={() => onOpenAuth('signup')}>
              Create account
            </button>
          </>
        )}
      </div>
    </header>
  );
}