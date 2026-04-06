type SitemapFile = {
    filename: string;
    xml: string;
};

const MAX_URLS = 50000;

function buildXml(urls: string[]) {
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

export function generateSplitSitemaps(urls: string[]): SitemapFile[] {
    const files: SitemapFile[] = [];

    for (let i = 0; i < urls.length; i += MAX_URLS) {
        const chunk = urls.slice(i, i + MAX_URLS);

        files.push({
            filename: `sitemap-${files.length + 1}.xml`,
            xml: buildXml(chunk),
        });
    }

    return files;
}

export function generateSitemapIndex(
    files: SitemapFile[],
    baseUrl: string
) {
    const body = files
        .map(
            (file) => `
  <sitemap>
    <loc>${baseUrl}/${file.filename}</loc>
  </sitemap>`
        )
        .join("");

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;
}