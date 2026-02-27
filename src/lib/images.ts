import fs from 'node:fs/promises';
import path from 'node:path';
import { getPlaiceholder } from 'plaiceholder';

/**
 * Reads an image from the public directory and generates a base64 blur placeholder.
 *
 * @param src The absolute path from the public directory (e.g. '/images/blog/post.jpg')
 * @returns The base64 data URL to use in next/image placeholder="blur"
 */
export async function getFallbackImageBlur(src: string): Promise<string> {
  try {
    let buffer: Buffer;
    if (src.startsWith('http://') || src.startsWith('https://')) {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
      const arrayBuffer = await res.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      buffer = await fs.readFile(path.join(process.cwd(), 'public', src));
    }
    const { base64 } = await getPlaiceholder(buffer);
    return base64;
  } catch (err) {
    console.error(`Failed to generate blur placeholder for ${src}:`, err);
    // Return a transparent 1x1 pixel fallback
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  }
}
