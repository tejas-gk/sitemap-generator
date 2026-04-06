#!/usr/bin/env node

import ora from "ora";
import fs from "fs";
import path from "path";
import { generateSitemap } from "./index";

async function main() {
    const crawlUrl = process.argv[2];
    const baseUrl = process.argv[3];

    if (!crawlUrl) {
        console.log("Usage:");
        console.log("npx sitemap-generator <crawl-url> [base-url]");
        process.exit(1);
    }

    const spinner = ora("🚀 Starting crawl...").start();

    try {
        const start = Date.now();

        const result = await generateSitemap(
            crawlUrl,
            baseUrl,
            (count, url) => {
                spinner.stop();

                const pathName = new URL(url).pathname || "/";
                console.log(`📄 ${pathName}`);

                spinner.start(`🔍 Crawled ${count} pages...`);
            }
        );

        // ✅ WRITE FILE HERE
        const outputPath = path.resolve(process.cwd(), "sitemap.xml");
        fs.writeFileSync(outputPath, result.sitemap, "utf-8");

        spinner.succeed("✅ Sitemap generated!");

        console.log("\n📊 Stats:");
        console.log(`Pages: ${result.count}`);
        console.log(`Time: ${(Date.now() - start) / 1000}s`);

        console.log(`\n📁 Saved to: ${outputPath}`);
    } catch (err: any) {
        spinner.fail("❌ Failed");
        console.error(err.message);
        process.exit(1);
    }
}

main();