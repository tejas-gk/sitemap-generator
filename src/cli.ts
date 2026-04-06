#!/usr/bin/env node

import { Command } from "commander";
import ora from "ora";
import fs from "fs";
import path from "path";
import {
    generateSitemap,
    generateAdvancedSitemaps,
} from "./index";

const program = new Command();

program
    .argument("<crawlUrl>")
    .argument("[baseUrl]")
    .option("--depth <n>", "Depth", "3")
    .option("--max-pages <n>", "Max pages", "500")
    .option("--concurrency <n>", "Concurrency", "5")
    .option("--output <file>", "Output file", "sitemap.xml")
    .option("--advanced", "Enable splitting/grouping")
    .action(async (crawlUrl, baseUrl, opts) => {
        const spinner = ora("🚀 Crawling...").start();

        try {
            const result = await generateSitemap(
                crawlUrl,
                baseUrl,
                (count, url) => {
                    spinner.stop();
                    console.log(`📄 ${new URL(url).pathname || "/"}`);
                    spinner.start(`🔍 ${count} pages...`);
                },
                {
                    depth: Number(opts.depth),
                    maxPages: Number(opts.maxPages),
                    concurrency: Number(opts.concurrency),
                }
            );

            if (opts.advanced) {
                const base = baseUrl || crawlUrl;

                const { files, indexXml } = generateAdvancedSitemaps(
                    result.urls,
                    base
                );

                files.forEach((file) => {
                    fs.writeFileSync(file.filename, file.xml);
                });

                fs.writeFileSync("sitemap.xml", indexXml);
            } else {
                const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${result.urls
                        .map(
                            (u) => `<url><loc>${u}</loc></url>`
                        )
                        .join("")}
</urlset>`;

                fs.writeFileSync(path.resolve(process.cwd(), opts.output), xml);
            }

            spinner.succeed("✅ Done");
        } catch (e: any) {
            spinner.fail("❌ Failed");
            console.error(e.message);
        }
    });

program.parse();