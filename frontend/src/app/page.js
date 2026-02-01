import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="h-16 border-b flex items-center justify-between px-10">
        <h1 className="text-xl font-semibold">Parchment Paper</h1>

        <Link
          href="/login"
          className="px-5 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition"
        >
          Login
        </Link>
      </header>

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 px-10 py-20 max-w-7xl mx-auto">
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Capture your thoughts.
            <br />
            Organize your ideas.
            <br />
            Stay productive.
          </h2>

          <p className="text-gray-600 text-lg max-w-lg">
            Parchment Paper is a fast, minimal and secure note-taking platform
            designed for developers and professionals who value speed and
            simplicity. Create, search and manage notes effortlessly across
            sessions.
          </p>

          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-3 rounded-md bg-black text-white hover:bg-gray-800 transition"
            >
              Get Started
            </Link>

            <Link
              href="/signup"
              className="px-6 py-3 rounded-md border border-gray-300 hover:bg-gray-100 transition"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex justify-center items-center">
          <Image
            src="/landing/hero.png"
            alt="App Preview"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-10">
          <h3 className="text-3xl font-semibold text-center mb-12">
            Built for clarity and speed
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-lg mb-2">
                Instant Note Creation
              </h4>

              <p className="text-gray-600 text-sm">
                Quickly capture ideas with an always-available input bar. No
                unnecessary clicks or distractions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-lg mb-2">Powerful Search</h4>

              <p className="text-gray-600 text-sm">
                Find notes instantly using real-time search across titles and
                content.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-lg mb-2">
                Secure Authentication
              </h4>

              <p className="text-gray-600 text-sm">
                Modern authentication with JWT and HTTP-only cookies keeps your
                data protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <Image
              src="/landing/feature-notes.png"
              alt="Notes Interface"
              width={600}
              height={400}
              className="rounded-lg shadow-md"
            />
          </div>

          <div className="flex flex-col justify-center space-y-4">
            <h3 className="text-2xl font-semibold">
              Clean and distraction-free interface
            </h3>

            <p className="text-gray-600">
              Designed to keep your focus on writing. Every element is
              intentionally minimal to maximize productivity.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-5xl mx-auto px-10 text-center space-y-6">
          <h3 className="text-3xl font-semibold">
            Start organizing your notes today
          </h3>

          <p className="text-gray-400">
            Join Parchment Paper and experience a faster way to manage ideas.
          </p>

          <Link
            href="/login"
            className="inline-block px-8 py-3 rounded-md bg-white text-black hover:bg-gray-200 transition"
          >
            Go To Login
          </Link>
        </div>
      </footer>
    </div>
  );
}
