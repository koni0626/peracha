import type { PptSlidePreview } from "./officePreviewParsers";

type SlidePreviewProps = {
  slides: PptSlidePreview[];
};

export function SlidePreview({ slides }: SlidePreviewProps) {
  return (
    <div className="slidePreviewShell">
      {slides.map((slide, index) => (
        <section className="slidePage" key={`${slide.title}-${index}`}>
          <small>{index + 1}</small>
          <h3>{slide.title}</h3>
          <ul>
            {slide.lines.map((line, lineIndex) => (
              <li key={`${line}-${lineIndex}`}>{line}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
