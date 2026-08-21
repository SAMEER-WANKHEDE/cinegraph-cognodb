import Link from 'next/link';
import { api } from '../../../lib/api';
import MoviePoster from '../../../components/MoviePoster';
export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let details: any = null;
  let actors: any[] = [];
  let recommendations: any[] = [];
  let error = '';

  try {
    [details, actors, recommendations] = await Promise.all([
      api.movie(id),
      api.actors(id),
      api.recommendations(id),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unable to load movie.';
  }

  if (error || !details) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Link href="/" className="text-sm text-amber-400">← Back</Link>
          <div className="mt-8 rounded-2xl border border-red-900/60 bg-red-950/30 p-8 text-red-200">
            <h1 className="text-xl font-bold">Unable to load this movie</h1>
            <p className="mt-2 text-sm text-red-300/80">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  const movie = details.movie;
  const director = details.director;
  const genres = details.genres?.filter((g: any) => g?.id) || [];
  const studio = details.studio;

  const posterUrl = movie.posterUrl;
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
        <Link href="/" className="text-sm text-zinc-500 hover:text-white">← Back</Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <MoviePoster
            src={movie.posterUrl}
            alt={movie.title}
            className="h-96 w-full rounded-3xl object-cover"
          />

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-amber-400/10 px-3 py-1 text-sm text-amber-300">
                ★ {movie.rating}
              </span>
              <span className="text-sm text-zinc-500">{movie.releaseYear}</span>
              <span className="text-sm text-zinc-500">{movie.duration} min</span>
            </div>

            <h1 className="mt-4 text-5xl font-black tracking-tight">{movie.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
              {movie.description}
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              <Info label="Director" value={director?.name || 'Unknown'} />
              <Info label="Studio" value={studio?.name || 'Unknown'} />
              <Info label="Genres" value={genres.map((g: any) => g.name).join(', ')} />
            </div>
          </div>
        </div>

        <section className="mt-16">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
                Graph relationship
              </p>
              <h2 className="mt-2 text-3xl font-bold">Cast connections</h2>
            </div>
            <span className="text-sm text-zinc-500">
              Movie → Actor → Movie
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {actors.map((actor) => (
              <div
                key={actor.id}
                className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm"
              >
                {actor.name}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 pb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
            Multi-hop recommendation
          </p>
          <h2 className="mt-2 text-3xl font-bold">Movies connected to {movie.title}</h2>
          <p className="mt-3 max-w-2xl text-zinc-500">
            These results are calculated by traversing shared actors and shared genres
            in the graph.
          </p>

          {recommendations.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-500">
              No connected recommendations found.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {recommendations.map((item) => (
                <Link
                  key={item.movie.id}
                  href={`/movies/${item.movie.id}`}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-amber-400/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold">{item.movie.title}</h3>
                    <span className="text-sm text-amber-300">
                      ★ {item.movie.rating}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500">
                    {item.movie.releaseYear} · {item.movie.duration} min
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300">
                      {item.sharedActors} shared actor{item.sharedActors === 1 ? '' : 's'}
                    </span>
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300">
                      {item.sharedGenres} shared genre{item.sharedGenres === 1 ? '' : 's'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-xs uppercase tracking-widest text-zinc-600">{label}</p>
      <p className="mt-2 text-sm font-medium text-zinc-200">{value}</p>
    </div>
  );
}
