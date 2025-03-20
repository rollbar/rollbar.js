export class SpanExporter {
  export(spans, _resultCallback) {
    console.log(spans); // console exporter, TODO: make optional
    spanExportQueue.push(...spans);
  }
}

export const spanExportQueue = [];
