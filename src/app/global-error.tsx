'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 font-mono">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold uppercase font-mono tracking-wider hover:bg-cyan-400 transition-all"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
