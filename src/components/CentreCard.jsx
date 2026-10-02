import { useState } from 'react';

export default function CentreCard({ centre, onBook }) {
  const [expanded, setExpanded] = useState(false);

  const tests = expanded
    ? centre.tests
    : centre.tests.slice(0, 3);

  return (
    <article className="min-w-0 rounded-lg border border-[#e9ebe5] bg-[#fffefa] p-[19px] pb-[15px] transition hover:-translate-y-0.5 hover:shadow-xl max-md:p-[17px]">
      {/* Centre Header */}
      <div className="mb-3.5 flex items-center justify-between">
        <div className="grid h-[35px] w-[35px] place-items-center rounded-[11px_11px_11px_3px] bg-[#e7eee4] text-[17px] text-[#6d876d]">
          <span>✳</span>
        </div>

        <div className="text-[11px] text-[#667069]">
          <span className="text-[#be9a53]">★</span>{' '}
          {centre.rating.toFixed(1)}
        </div>
      </div>

      {/* Centre Name */}
      <h3 className="mb-[7px] font-display text-[15px] font-semibold tracking-[-.3px] text-[#303c32]">
        {centre.name}
      </h3>

      {/* Centre Location */}
      <div className="text-[11px] text-[#8b938b]">
        <span className="mr-1.5 text-[15px] text-[#91a092]">
          ⌖
        </span>
        {centre.location}
      </div>

      {/* Centre Information */}
      <div className="flex gap-4 border-b border-[#eceee8] py-[13px] text-[10px] text-[#858c84]">
        <span>
          ◷ &nbsp;{centre.hours}
        </span>

        <span>
          ◈ &nbsp;{centre.tests.length} tests
        </span>
      </div>

      {/* Tests List */}
      <div>
        {tests.map((test) => (
          <div
            className="flex items-center justify-between gap-2 border-b border-[#f0f1ed] py-[13px]"
            key={test._id}>
            {/* Test Details */}
            <div>
              <strong className="block text-[11px] font-semibold text-[#3a453b]">
                {test.name}
              </strong>

              <small className="mt-[5px] block text-[9px] text-[#959a93]">
                {test.duration}
                <span className="px-[3px]">·</span>
                {test.category}
              </small>
            </div>

            {/* Test Price and Booking */}
            <div className="shrink-0 text-right">
              <strong className="mb-1.5 block text-[11px] text-[#435247]">
                ₹{test.price.toLocaleString('en-IN')}
              </strong>

              <button
                className="text-[10px] font-semibold text-[#6c8a6f]"
                aria-label={`Book ${test.name}`}
                onClick={() => onBook(centre, test)}>
                Book
                <span className="pl-[3px]">↗</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Expand / Collapse Tests */}
      {centre.tests.length > 3 && (
        <button
          className="w-full pt-3 text-left text-[10px] text-[#788c76]"
          onClick={() => setExpanded(!expanded)}>
          {expanded
            ? 'Show less'
            : `View all ${centre.tests.length} tests`}

          <span className="float-right">
            {expanded ? '↑' : '↓'}
          </span>
        </button>
      )}
    </article>
  );
}