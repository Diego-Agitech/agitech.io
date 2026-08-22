// Adds an id to every <h2> in a rendered HTML string and returns the matching
// table-of-contents entries — used to build the blog article sidebar nav.
export interface TocEntry {
  id: string;
  text: string;
}

function slugify(text: string): string {
  return text
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function addTocIds(html: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = [];
  const seen = new Map<string, number>();
  const withIds = html.replace(/<h2([^>]*)>(.*?)<\/h2>/gis, (_match, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    let id = slugify(text) || 'section';
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;
    toc.push({ id, text });
    return `<h2${attrs} id="${id}">${inner}</h2>`;
  });
  return { html: withIds, toc };
}
