import Link from "next/link";

export default function NotFound() {
  return (
    <main className="section-wrapper text-center">
      <h1 className="heading is-display mb-4">Page not found</h1>
      <p className="text mb-8">The page you are looking for does not exist. Return to the homepage to continue editing.</p>
      <Link href="/" className="btn-primary">
        Go home
      </Link>
    </main>
  );
}
