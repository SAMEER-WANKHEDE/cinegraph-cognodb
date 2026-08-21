import Link from 'next/link';
import { api } from '../../lib/api';
import MoviePoster from '../../components/MoviePoster';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || '';

  let results: any[] = [];
  let error = '';

  if (q) {
    try {
      results = await api.search(q);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unable to search.';
    }
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-zinc-800 bg-zinc-950/80">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <Link href="/" className="text-xl font-black">
            Cine<span className="text-amber-400">Graph</span>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-white"
        >
          ← Back
        </Link>

        <h1 className="mt-8 text-4xl font-black">
          Search
        </h1>

        <form className="mt-6 flex gap-3" action="/search">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search movies, actors, directors..."
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          />

          <button
            type="submit"
            className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black hover:bg-amber-300"
          >
            Search
          </button>
        </form>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-900/60 bg-red-950/30 p-6 text-red-200">
            {error}
          </div>
        )}

        {!q && !error && (
          <div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-500">
            Enter a movie, actor, director, genre or studio to search.
          </div>
        )}

        {q && !error && results.length === 0 && (
          <div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-500">
            No results found for "{q}".
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-10 space-y-4">
            <p className="text-sm text-zinc-500">
              {results.length} result{results.length === 1 ? '' : 's'} for "{q}"
            </p>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {results.map((result, index) => {
                const item = result.item;
                const type = result.type;

                if (!item) {
                  return null;
                }

                const isMovie = type === 'Movie';

                return (
                  <Link
                    key={`${type}-${item.id}-${index}`}
                    href={
                      isMovie
                        ? `/movies/${item.id}`
                        : '#'
                    }
                    className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition hover:border-amber-400/50"
                  >
                    {isMovie ? (
                      <MoviePoster
                        src={item.posterUrl}
                        alt={item.title || 'Movie'}
                        className="h-80 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-80 items-center justify-center bg-gradient-to-br from-amber-400/20 via-zinc-900 to-zinc-950 text-7xl">
                        {type === 'Director' ? '🎬' : '👤'}
                      </div>
                    )}

                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                        {type}
                      </p>

                      <h2 className="mt-2 text-lg font-semibold">
                        {item.title || item.name || 'Unknown'}
                      </h2>

                      {item.releaseYear && (
                        <p className="mt-1 text-sm text-zinc-500">
                          {item.releaseYear}
                          {item.duration
                            ? ` · ${item.duration} min`
                            : ''}
                        </p>
                      )}

                      {item.rating && (
                        <p className="mt-2 text-sm text-amber-300">
                          ★ {item.rating}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}