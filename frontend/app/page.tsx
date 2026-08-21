import Link from 'next/link';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { api, type Movie } from '../lib/api';

export default async function Home() {
  let movies: Movie[] = [];
  let error = '';

  try {
    movies = await api.movies();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unable to connect to the API.';
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-zinc-800 bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
          <Link href="/" className="text-xl font-black tracking-tight">
            Cine<span className="text-amber-400">Graph</span>
          </Link>
          <Link href="/search" className="text-sm text-zinc-400 hover:text-white">
            Explore
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-12 pt-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
            Graph-powered movie discovery
          </p>
          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Discover movies through their connections.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Explore actors, directors, genres and studios as an interconnected graph.
            Recommendations are powered by multi-hop relationships in CognoDB.
          </p>
          <div className="mt-8 max-w-2xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Explore movies</h2>
            <p className="mt-1 text-sm text-zinc-500">Seeded graph data from CognoDB</p>
          </div>
          <Link href="/search" className="text-sm text-amber-400 hover:text-amber-300">
            View all →
          </Link>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-900/60 bg-red-950/30 p-6 text-red-200">
            <p className="font-semibold">Database connection unavailable</p>
            <p className="mt-2 text-sm text-red-300/80">{error}</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center text-zinc-500">
            No movies found. Run the backend seed script.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {movies.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
