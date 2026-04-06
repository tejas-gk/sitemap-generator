# 🚀 Sitemap Generator CLI

A fast, production-grade CLI tool to crawl websites and generate XML sitemaps — with support for local development, domain mapping, and advanced sitemap splitting.


## 📦 Installation

### Using npx (recommended)

```bash
npx pxlsgrds-sitemap http://localhost:3000
```

---

### Global install

```bash
npm install -g pxlsgrds-sitemap
```

```bash
pxlsgrds-sitemap http://localhost:3000
```

---

## 🚀 Usage

### Basic

```bash
pxlsgrds-sitemap <crawlUrl> [baseUrl]
```

Example:

```bash
pxlsgrds-sitemap http://localhost:3000 https://pixelsandgrids.com
```

👉 Crawls your local site and outputs production-ready URLs.

---

## ⚙️ Options

| Option              | Description                 | Default     |
| ------------------- | --------------------------- | ----------- |
| `--depth <n>`       | Max crawl depth             | 3           |
| `--max-pages <n>`   | Max pages to crawl          | 500         |
| `--concurrency <n>` | Parallel workers            | 5           |
| `--output <file>`   | Output file name            | sitemap.xml |
| `--advanced`        | Enable splitting & grouping | false       |

---

## 🔥 Advanced Mode

Enable with:

```bash
pxlsgrds-sitemap http://localhost:3000 https://site.com --advanced
```

### What it does:

* Splits large sitemaps (50k URLs per file)
* Groups URLs:

  * `/blog/*` → `blog-sitemap.xml`
  * `/products/*` → `products-sitemap.xml`
  * Others → `pages-sitemap.xml`
* Generates index file:

```bash
sitemap.xml
```

### Output Example:

```
sitemap.xml
blog-sitemap-1.xml
pages-sitemap-1.xml
products-sitemap-1.xml
```

---

## 🧪 Example

```bash
npx pxlsgrds-sitemap http://localhost:3000 https://pixelsandgrids.com --depth 2 --max-pages 200
```

---

## 📁 Output

By default:

```
./sitemap.xml
```

---

## 🧠 How It Works

1. Crawls pages using BFS
2. Extracts internal links
3. Normalizes URLs
4. Filters assets
5. Generates sitemap XML

---

## ⚠️ Notes

* Only crawls same-domain links
* Skips assets (images, CSS, JS, etc.)
* Designed for dev + production workflows

---

## 🏗️ Roadmap

* [ ] robots.txt support
* [ ] lastmod / priority / changefreq
* [ ] sitemap gzip support
* [ ] multi-language support
* [ ] distributed crawling

---

## 🤝 Contributing

PRs are welcome! Open an issue for feature requests or bugs.

---

## 📄 License

MIT

---

## 💡 Author

Built by **Pixels and Grids (pxlsgrds)**
