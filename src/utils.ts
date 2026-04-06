export function normalize(url: string) {
    return url.split("#")[0].replace(/\/$/, "");
}

export function isAsset(url: string) {
    return /\.(png|jpg|jpeg|gif|svg|css|js|ico|pdf|zip|mp4)$/i.test(url);
}