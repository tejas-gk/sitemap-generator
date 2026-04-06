export function generateSitemapXml(urls: string[]): string {
    const body = urls
        .map(
            (url) => `
  <url>
    <loc>${url}</loc>
  </url>`
        )
        .join("");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}