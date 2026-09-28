import z from 'zod';

export const createUserBody = z.object({
    username: z.string(),
    password: z.string(),
});

export const createMovieBody = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  duration_minutes: z.number().int().positive(),
  language: z.string().min(1),
  genre: z.enum(["sci-fi", "horror", "romantic"]),
  release_date: z.coerce.date(),
  poster_url: z.url(),
});

export type CreateMovieInput = z.infer<typeof createMovieBody>;
export type RegisterInput = z.infer<typeof createUserBody>;
