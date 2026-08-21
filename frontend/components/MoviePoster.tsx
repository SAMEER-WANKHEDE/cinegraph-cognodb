'use client';

import { useState } from 'react';

type MoviePosterProps = {
    src?: string | null;
    alt: string;
    className?: string;
};

export default function MoviePoster({
    src,
    alt,
    className = '',
}: MoviePosterProps) {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return (
            <div
                className={`flex items-center justify-center bg-gradient-to-br from-amber-400/20 via-zinc-900 to-zinc-950 text-6xl ${className}`}
            >
                🎬
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setHasError(true)}
        />
    );
}