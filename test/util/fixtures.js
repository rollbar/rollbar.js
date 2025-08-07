/**
 * Helpers for loading and using fixtures in tests.
 */

/**
 * Loads a fixture HTML file and evaluates any scripts within it.
 *
 * @param {string} name - The name of the fixture file (without extension).
 */
export async function loadHtml(name) {
  const res = await fetch(`test/fixtures/html/${name}.html`);
  const text = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');

  doc.querySelectorAll('script').forEach((script) => {
    eval(script.textContent);
  });

  document.body.innerHTML = doc.body.innerHTML;
}
