import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-xl my-4">This page does not exist.</p>
      <Link href="/" className="text-blue-500 underline text-2xl">
        Return Home
      </Link>
    </main>
  );
}
