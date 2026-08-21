import Link from 'next/link';
import type { Movie } from '../lib/api';
import MoviePoster from './MoviePoster';

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:-translate-y-1 hover:border-amber-400/50 hover:bg-zinc-800"
    >
      <MoviePoster
        src={movie.posterUrl}
        alt={movie.title}
        className="h-72 w-full object-cover"
      />
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold group-hover:text-amber-300">{movie.title}</h3>
        <span className="rounded-full bg-amber-400/10 px-2 py-1 text-xs text-amber-300">
          ★ {movie.rating}
        </span>
      </div>
      <p className="mt-2 text-sm text-zinc-500">
        {movie.releaseYear} · {movie.duration} min
      </p>
    </Link>
  );
}
