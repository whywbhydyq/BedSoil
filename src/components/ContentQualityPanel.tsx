import type { ContentQualityBrief } from '@/lib/data/contentQuality';

type ContentQualityPanelProps = {
  brief: ContentQualityBrief;
  title?: string;
};

export function ContentQualityPanel({ brief, title = 'Quick answer and review notes' }: ContentQualityPanelProps) {
  return (
    <section className="content-card content-quality-card" aria-labelledby="content-quality-heading">
      <h2 id="content-quality-heading">{title}</h2>
      <div className="answer-first">
        <strong>Quick answer:</strong>
        <p>{brief.quickAnswer}</p>
      </div>
      <div className="quality-grid">
        <div>
          <h3>Best use</h3>
          <p>{brief.bestFor}</p>
        </div>
        <div>
          <h3>Limits</h3>
          <p>{brief.notFor}</p>
        </div>
      </div>
      <h3>Verify before purchase or planting</h3>
      <ul>{brief.verify.map((item) => <li key={item}>{item}</li>)}</ul>
      <div className="quality-grid">
        <div>
          <h3>Source basis</h3>
          <ul>{brief.sourceBasis.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h3>Review triggers</h3>
          <ul>{brief.reviewTriggers.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
      <h3>Citation-ready facts</h3>
      <ul>{brief.citationFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
      <p className="muted-card">{brief.editorialNote}</p>
    </section>
  );
}
