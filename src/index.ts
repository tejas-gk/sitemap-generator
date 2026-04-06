import { crawlSite } from "./crawler";
import { generateSitemapXml } from "./xmlBuilder";

function mapToBaseUrl(
    url: string,
    crawlUrl: string,
    baseUrl: string
) {
    try {
        const target = new URL(url);
        return url.replace(target.origin, baseUrl);
    } catch {
        return url;
    }
}

export async function generateSitemap(
crawlUrl: string, baseUrl?: string, onProgress?: (count: number, url: string) => void, p0?: { depth: number; maxPages: number; }) {
    if (!crawlUrl || !crawlUrl.startsWith("http")) {
        throw new Error("Invalid URL");
    }

    const pages = await crawlSite(crawlUrl, onProgress);

    const finalUrls = baseUrl
        ? pages.map((url) => mapToBaseUrl(url, crawlUrl, baseUrl))
        : pages;

    const xml = generateSitemapXml(finalUrls);

    return {
        sitemap: xml,
        count: finalUrls.length,
    };
}