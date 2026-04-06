export function groupUrls(urls: string[]) {
    const groups: Record<string, string[]> = {};

    for (const url of urls) {
        const path = new URL(url).pathname;

        let key = "pages";

        if (path.startsWith("/blog")) key = "blog";
        else if (path.startsWith("/products")) key = "products";

        if (!groups[key]) groups[key] = [];
        groups[key].push(url);
    }

    return groups;
}