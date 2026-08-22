// Keystatic image fields store just the filename relative to their `directory`.
// All block images share one directory (public/assets/img/blocks) — this resolves
// a stored filename to the public URL the components render.
export function blockImg(filename?: string | null): string | undefined {
  return filename ? `/assets/img/blocks/${filename}` : undefined;
}
