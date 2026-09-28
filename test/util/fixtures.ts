/**
 * Helpers for loading and using fixtures in tests.
 */

/**
 * Loads a fixture HTML file and evaluates any scripts within it.
 *
 * @param {string} relativePath - The path to the HTML file, relative to the
 *  project root.
 */
export async function loadHtml(relativePath: string): Promise<void> {
  const res = await fetch(relativePath);
  if (!res.ok) {
    throw new Error(`Failed to load ${relativePath}: HTTP ${res.status}`);
  }
  const text = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');

  document.body.innerHTML = doc.body.innerHTML;

  const scripts = doc.querySelectorAll<HTMLScriptElement>('script');
  for (const script of scripts) {
    if (script.src) {
      // External script
      const newScript = document.createElement('script');

      newScript.src = script.src;

      // Preserve script type to prevent module/classic script conflicts
      // (defaults to module in WTR, but bundle may be classic script)
      if (script.type) {
        newScript.type = script.type;
      }

      await new Promise<void>((resolve, reject) => {
        newScript.onload = () => resolve();
        newScript.onerror = () =>
          reject(new Error(`Failed to load script ${newScript.src}`));
        document.body.appendChild(newScript);
      });
    } else if (script.textContent) {
      // Inline script
      eval(script.textContent);
    }
  }
}

/**
 * Loads an example app page with `loadHtml`. The app's bundle is not
 * committed; `npm run build:test-examples` builds it against the current SDK.
 *
 * @param {string} relativePath - The path to the HTML file, relative to the
 *  project root.
 */
export async function loadExampleHtml(relativePath: string): Promise<void> {
  try {
    await loadHtml(relativePath);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `${message}. Run \`npm run build:test-examples\` to build the example apps.`,
    );
  }
}
