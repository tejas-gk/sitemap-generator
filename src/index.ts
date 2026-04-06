import { crawlSite } from "./crawler";
import { generateSplitSitemaps, generateSitemapIndex } from "./xmlBuilder";
import { groupUrls } from "./group";

type Options = {
    depth?: number;
    maxPages?: number;
    concurrency?: number;
};

function mapToBaseUrl(url: string, baseUrl: string) {
    try {
        const u = new URL(url);
        return url.replace(u.origin, baseUrl);
    } catch {
        return url;
    }
}

export async function generateSitemap(
    crawlUrl: string,
    baseUrl?: string,
    onProgress?: (count: number, url: string) => void,
    options?: Options
) {
    const pages = await crawlSite(crawlUrl, onProgress, options);

    const finalUrls = baseUrl
        ? pages.map((url) => mapToBaseUrl(url, baseUrl))
        : pages;

    return {
        sitemap: finalUrls,
        count: finalUrls.length,
        urls: finalUrls,
    };
}

export function generateAdvancedSitemaps(
    urls: string[],
    baseUrl: string
) {
    const grouped = groupUrls(urls);
    const allFiles: { filename: string; xml: string }[] = [];

    for (const key in grouped) {
        const split = generateSplitSitemaps(grouped[key]);

        split.forEach((file, i) => {
            file.filename = `${key}-sitemap-${i + 1}.xml`;
        });

        allFiles.push(...split);
    }

    const indexXml = generateSitemapIndex(allFiles, baseUrl);

    return { files: allFiles, indexXml };
}