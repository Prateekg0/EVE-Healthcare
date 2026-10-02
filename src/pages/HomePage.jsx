import { useEffect, useState } from 'react';

import CentreCard from '../components/CentreCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const CATEGORIES = [
  'All tests',
  'Blood',
  'Wellness',
  'Heart',
  'Diabetes',
];

export default function HomePage({ onBook }) {
  const { request } = useAuth();

  const [centres, setCentres] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All tests');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setLoading(true);

    request(
      `/centres?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`
    )
      .then((data) => {
        if (active) {
          setCentres(data.centres);
        }
      })
      .catch(() => {
        if (active) {
          setCentres([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [request, query, category]);

  return (
    <>
      {/* Hero Section */}
      <section className="mx-auto grid min-h-[390px] max-w-[1160px] grid-cols-[1fr_.93fr] items-center py-[66px] max-xl:mx-[5.2vw] max-md:mx-[22px] max-md:block max-md:py-12">
        {/* Hero Content */}
        <div className="pl-7 max-md:pl-0">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[1.65px] text-[#57745e]">
            <span className="h-[7px] w-[7px] rounded-full bg-[#86a38a]" />
            CARE THAT COMES CLOSER
          </div>

          <h1 className="my-5 font-display text-[53px] font-semibold leading-[1.13] tracking-[-2.5px] text-[#25352b] max-md:text-[44px] max-sm:text-[39px]">
            A little clarity
            <br />
            goes a{' '}
            <em className="font-serif font-normal text-[#66836b]">
              long way.
            </em>
          </h1>

          <p className="m-0 max-w-[410px] text-sm leading-[1.8] text-[#7c857e] max-md:text-[13px]">
            Book trusted diagnostic tests at a centre that fits your day.
            Simple, thoughtful care starts here.
          </p>

          <div className="mt-7 flex items-center gap-2.5 text-[11px] text-[#59675c]">
            <span className="grid h-[17px] w-[17px] place-items-center rounded-full bg-[#e1ebe0] text-[10px] text-[#507052]">
              ✓
            </span>
            Trusted labs
            <i className="h-[3px] w-[3px] rounded-full bg-[#aab2a9]" />
            Clear pricing
            <i className="h-[3px] w-[3px] rounded-full bg-[#aab2a9]" />
            Easy booking
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="relative flex h-[275px] items-center justify-center overflow-hidden max-md:mt-3 max-md:h-[235px]">
          <div className="absolute h-[310px] w-[310px] rounded-full border border-[#e6ebe2] max-md:h-[270px] max-md:w-[270px]" />

          <div className="absolute h-[245px] w-[245px] rounded-full border border-[#dfe7db] max-md:h-[210px] max-md:w-[210px]" />

          <div className="art-circle relative grid h-[178px] w-[178px] place-items-center rounded-full bg-[#e5ede2] shadow-[inset_0_0_0_15px_#ecf1e9] max-md:scale-[.85]">
            <div className="art-cross font-display text-[83px] font-normal leading-none text-[#719079]">
              +
            </div>

            <div className="absolute right-[14px] top-[13px] text-[43px] text-[#c0ab78]">
              ✳
            </div>

            <div className="art-leaf absolute -bottom-[9px] left-1 font-serif text-[77px] text-[#95a58f]">
              ⌁
            </div>

            <div className="absolute bottom-[31px] right-[31px] h-3 w-3 rounded-full bg-[#b28f65]" />
          </div>

          <div className="absolute bottom-[38px] right-1 flex items-center gap-[11px] rounded-lg border border-[#eff0e8] bg-[#fffefa] px-4 py-3 shadow-lg max-md:bottom-[25px]">
            <span className="grid h-[27px] w-[27px] place-items-center rounded-full bg-[#e6eee3] text-[#547253]">
              ✓
            </span>

            <div>
              <strong className="block text-[11px] text-[#344238]">
                Your health, in focus
              </strong>

              <small className="mt-1 block text-[9px] text-[#8a918a]">
                Results you can feel good about
              </small>
            </div>
          </div>

          <span className="absolute right-[26px] top-3 font-serif text-xs italic text-[#9b9f91] max-md:right-0">
            A calmer kind of healthcare.
          </span>
        </div>
      </section>

      {/* Test Search Section */}
      <section className="mx-auto max-w-[1160px] px-0 pb-[62px] pt-[23px] max-xl:mx-[5.2vw] max-md:mx-[18px] max-md:pt-2.5">
        {/* Section Heading */}
        <div className="mb-[21px] flex items-end justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-[1.65px] text-[#8a948b]">
              A GOOD PLACE TO START
            </div>

            <h2 className="mt-[9px] font-display text-[25px] font-semibold tracking-[-.8px] text-[#29372d] max-md:text-[21px]">
              Find the right test for you.
            </h2>
          </div>

          <span className="pb-[3px] text-[11px] text-[#92988e] max-md:text-[9px]">
            {loading
              ? 'Finding centres…'
              : `${centres.length} trusted centres`}
          </span>
        </div>

        {/* Search Input */}
        <div className="flex min-h-[51px] items-center gap-3 rounded-md border border-[#e4e7df] bg-[#fffefa] px-[15px] shadow-sm">
          <span className="rotate-[-20deg] font-serif text-[25px] text-[#78847a]">
            ⌕
          </span>

          <input
            className="min-w-0 flex-1 border-0 bg-transparent text-xs text-[#344137] outline-none placeholder:text-[#a2a79f] max-md:text-[11px]"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tests or areas (e.g. thyroid, Indiranagar)"
          />

          <kbd className="rounded border border-[#e8e9e4] px-1.5 py-1 text-[10px] text-[#9a9f97] max-md:hidden">
            ⌘ K
          </kbd>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto py-4 pb-[22px]">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              className={`shrink-0 rounded-full border px-3.5 py-[7px] text-[11px] ${category === item
                  ? 'border-transparent bg-[#e8eee5] font-semibold text-[#36513c]'
                  : 'border-[#e5e8e1] bg-transparent text-[#7d867d]'
                }`}
              onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>

        {/* Centres List */}
        {loading ? (
          <div className="p-[60px_15px] text-center text-[13px] text-[#858e85]">
            Finding care close to you…
          </div>
        ) : centres.length === 0 ? (
          <div className="p-[60px_15px] text-center text-[13px] text-[#858e85]">
            No matches yet. Try another test or area.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-[17px] max-md:grid-cols-1 max-md:gap-[11px]">
            {centres.map((centre) => (
              <CentreCard
                key={centre._id}
                centre={centre}
                onBook={onBook}
              />
            ))}
          </div>
        )}
      </section>

      {/* Bottom Information Section */}
      <section className="mx-auto mb-[61px] flex max-w-[1160px] items-center gap-4 rounded-lg border border-[#e9ece5] bg-[#f3f5ef] px-[26px] py-[22px] max-xl:mx-[5.2vw] max-md:mx-[18px] max-md:mb-[42px] max-md:gap-2.5 max-md:p-4">
        <div className="grid h-[35px] w-[35px] place-items-center rounded-full bg-[#e3eade] text-[#6e896e]">
          ✳
        </div>

        <div>
          <strong className="font-display text-xs font-semibold text-[#415043]">
            Care that meets you where you are.
          </strong>

          <p className="mt-1 text-[10px] text-[#899087]">
            Friendly teams, transparent prices, and no surprises.
          </p>
        </div>

        <div className="ml-auto text-[10px] text-[#798579] max-md:hidden">
          Your wellbeing comes first
          <span className="ml-1.5 text-[#5b785d]">↗</span>
        </div>
      </section>
    </>
  );
}