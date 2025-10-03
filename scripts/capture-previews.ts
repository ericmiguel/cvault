import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer, { type Browser } from 'puppeteer';

interface PreviewSpec {
  readonly id: string;
  readonly html: string;
  readonly image: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const renderedDir = path.join(projectRoot, 'static', 'rendered');
const imageDir = path.join(projectRoot, 'static', 'images');

const previews: PreviewSpec[] = [
  {
    id: 'minimalist-software-engineer',
    html: 'minimalist-software-engineer.html',
    image: 'minimalist-software-engineer.png',
  },
  {
    id: 'modern-systems-architect',
    html: 'modern-systems-architect.html',
    image: 'modern-systems-architect.png',
  },
  {
    id: 'creative-brand-strategist',
    html: 'creative-brand-strategist.html',
    image: 'creative-brand-strategist.png',
  },
  {
    id: 'applied-ml-lead',
    html: 'applied-ml-lead.html',
    image: 'applied-ml-lead.png',
  },
];

async function capturePreview(
  htmlFile: string,
  pngFile: `${string}.png`,
  browser: Browser
): Promise<void> {
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 2200, deviceScaleFactor: 2 });

  const fileUrl = pathToFileURL(htmlFile).href;
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    const doc = (
      globalThis as {
        document?: {
          body?: { style?: { background: string } };
          querySelector?: (selector: string) => { style?: { boxShadow?: string } } | null;
        };
      }
    ).document;
    if (!doc) {
      return;
    }
    if (doc.body?.style) {
      doc.body.style.background = '#f5f5f5';
    }
    const container = doc.querySelector?.('.container');
    if (container?.style) {
      container.style.boxShadow = 'none';
    }
  });

  const container = await page.$('.container');
  if (container) {
    const box = await container.boundingBox();
    if (box) {
      await page.screenshot({
        path: pngFile,
        clip: {
          x: Math.max(box.x - 40, 0),
          y: Math.max(box.y - 40, 0),
          width: box.width + 80,
          height: box.height + 80,
        },
      });
      await page.close();
      return;
    }
  }

  await page.screenshot({ path: pngFile, fullPage: true });
  await page.close();
}

async function main(): Promise<void> {
  fs.mkdirSync(imageDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: true });

  try {
    for (const { html, image, id } of previews) {
      const htmlPath = path.join(renderedDir, html);
      if (!fs.existsSync(htmlPath)) {
        console.warn(`Skipping ${id}: missing HTML file at ${htmlPath}`);
        continue;
      }

      const pngPath = path.join(imageDir, image) as `${string}.png`;
      console.log(`📸 Capturing preview for ${id}...`);
      await capturePreview(htmlPath, pngPath, browser);
      console.log(`✅ Saved preview: ${pngPath}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error('Failed to capture previews:', error);
  process.exitCode = 1;
});
