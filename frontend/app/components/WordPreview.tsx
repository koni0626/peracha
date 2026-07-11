export function WordPreview({ html }: { html: string }) {
  return (
    <div className="wordPreviewShell">
      <article className="wordPage" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
