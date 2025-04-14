export const spanExportQueue = [];

export class SpanExporter {
  #api;

  constructor(api) {
    this.#api = api;
  }

  async export(spans) {
    spanExportQueue.push(...spans);

    if (spans.length === 0) {
      return Promise.resolve({ success: true, message: 'No spans to export' });
    }

    if (this.#api.options.verbose) {
      console.log('Exporting spans:', spans);
    }

    return new Promise((resolve, reject) => {
      this.#api.postSpans(spans, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }
}
