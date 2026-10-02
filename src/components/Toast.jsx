export default function Toast({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-md bg-[#2c4232] px-5 py-3 text-xs text-white shadow-xl"
      role="status">
      {message}
    </div>
  );
}