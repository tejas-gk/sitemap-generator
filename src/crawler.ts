import axios from "axios";
import * as cheerio from "cheerio";

type QueueItem = { url: string; depth: number };

function normalize(url: string) {
    return url.split("#")[0].replace(/\/$/, "");
}

export async function crawlSite(
    startUrl: string,
    onProgress?: (count: number, url: string) => void
): Promise<string[]> {
    const visited = new Set<string>();
    const baseHost = new URL(startUrl).hostname;

    const queue: QueueItem[] = [{ url: startUrl, depth: 0 }];

    const MAX_PAGES = 500;
    const MAX_DEPTH = 3;

    while (queue.length > 0) {
        const { url, depth } = queue.shift()!;

        if (visited.has(url)) continue;
        if (depth > MAX_DEPTH) continue;

        visited.add(url);
        onProgress?.(visited.size, url);

        if (visited.size >= MAX_PAGES) break;

        try {
            const { data } = await axios.get(url, { timeout: 5000 });
            const $ = cheerio.load(data);

            $("a").each((_, el) => {
                const href = $(el).attr("href");
                if (!href) return;

                const absolute = new URL(href, url).href;
                const linkHost = new URL(absolute).hostname;

                // ✅ restrict to same domain
                if (linkHost !== baseHost) return;

                // ✅ skip assets
                if (/\.(png|jpg|jpeg|gif|svg|css|js|ico|pdf)$/i.test(absolute)) return;

                const clean = normalize(absolute);

                if (!visited.has(clean)) {
                    queue.push({ url: clean, depth: depth + 1 });
                }
            });
        } catch {
            // ignore errors
        }
    }

    return Array.from(visited);
}