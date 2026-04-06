import axios from "axios";
import * as cheerio from "cheerio";
import { normalize, isAsset } from "./utils";

type Options = {
    depth: number;
    maxPages: number;
    concurrency: number;
};

export async function crawlSite(
    startUrl: string,
    onProgress?: (count: number, url: string) => void,
    options?: Partial<Options>
): Promise<string[]> {
    const visited = new Set<string>();
    const queue: { url: string; depth: number }[] = [
        { url: startUrl, depth: 0 },
    ];

    const baseHost = new URL(startUrl).hostname;

    const config: Options = {
        depth: options?.depth ?? 3,
        maxPages: options?.maxPages ?? 500,
        concurrency: options?.concurrency ?? 5,
    };

    async function worker() {
        while (queue.length > 0) {
            const item = queue.shift();
            if (!item) return;

            const { url, depth } = item;

            if (visited.has(url)) continue;
            if (depth > config.depth) continue;

            visited.add(url);
            onProgress?.(visited.size, url);

            if (visited.size >= config.maxPages) return;

            try {
                const { data } = await axios.get(url, { timeout: 5000 });
                const $ = cheerio.load(data);

                $("a").each((_, el) => {
                    const href = $(el).attr("href");
                    if (!href) return;

                    try {
                        const absolute = normalize(new URL(href, url).href);
                        const host = new URL(absolute).hostname;

                        if (host !== baseHost) return;
                        if (isAsset(absolute)) return;
                        if (visited.has(absolute)) return;

                        queue.push({ url: absolute, depth: depth + 1 });
                    } catch { }
                });
            } catch { }
        }
    }

    await Promise.all(
        Array.from({ length: config.concurrency }, () => worker())
    );

    return Array.from(visited);
}