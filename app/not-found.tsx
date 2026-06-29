import Link from "next/link";

export default function NotFound() {
  return (
    <main className="landing-fallback">
      <div className="container">
        <h1>Site not found</h1>
        <p>This demo site does not exist or has been archived.</p>
        <p>
          <Link href="https://valetfy.com">Powered by Valetfy</Link>
        </p>
      </div>
    </main>
  );
}
