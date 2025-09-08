/**
 * Helpers for loading and using fixtures in tests.
 */

/**
 * Loads a fixture HTML file and evaluates any scripts within it.
 *
 * @param {string} relativePath - The path to the HTML file, relative to the
 *  project root.
 */
export async function loadHtml(relativePath) {
  const res = await fetch(relativePath);
  const text = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');

  document.body.innerHTML = doc.body.innerHTML;

  const scripts = doc.querySelectorAll('script');
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

      await new Promise((resolve, reject) => {
        newScript.onload = resolve;
        newScript.onerror = reject;
        document.body.appendChild(newScript);
      });
    } else if (script.textContent) {
      // Inline script
      eval(script.textContent);
    }
  }
}
