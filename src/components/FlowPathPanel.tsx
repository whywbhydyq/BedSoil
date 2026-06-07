import Link from 'next/link';
import type { PageDefinition } from '@/lib/data/pages';
import { FLOW_STAGES, flowForPage, sitewideFlowSummary } from '@/lib/data/flow';

export function FlowPathPanel({ page, title = 'Search-to-result flow' }: { page?: PageDefinition; title?: string }) {
  const flow = flowForPage(page);
  const summary = sitewideFlowSummary();

  return (
    <section className="content-card flow-card">
      <p className="eyebrow">FLOW framework path</p>
      <h2>{title}</h2>
      <p>
        This page maps the search visit into a four-step planning path: find the task, show the evidence boundary,
        complete the calculation or comparison decision, then move to the next garden-planning step.
      </p>
      <p className="flow-route-badge">Route type: {flow.routeType}</p>

      <div className="flow-stage-grid" aria-label="FLOW stages for this page">
        {FLOW_STAGES.map((stage) => (
          <article key={stage.id} className="flow-stage-card">
            <span>{stage.shortLabel}</span>
            <h3>{stage.label}</h3>
            <p>{stage.goal}</p>
            <small>{stage.siteAction}</small>
          </article>
        ))}
      </div>

      <div className="flow-route-grid">
        <div>
          <h3>Landing intent</h3>
          <p>{flow.landingIntent}</p>
        </div>
        <div>
          <h3>Primary action</h3>
          <p>{flow.primaryAction}</p>
        </div>
        <div>
          <h3>Expected result</h3>
          <p>{flow.expectedResult}</p>
        </div>
        <div>
          <h3>Completion action</h3>
          <p>{flow.completionAction}</p>
        </div>
      </div>

      <h3>Next useful planning step</h3>
      <div className="flow-next-step-grid">
        {flow.nextSteps.map((step) => (
          <Link key={step.href} href={step.href}>
            <span>{step.label}</span>
            <small>{step.reason}</small>
          </Link>
        ))}
      </div>

      <details className="flow-audit-details">
        <summary>Flow measurement, evidence, and friction checks</summary>
        <div className="flow-check-grid">
          <div>
            <h3>Measurement signals</h3>
            <ul>{flow.measurementSignals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
          </div>
          <div>
            <h3>Friction checks</h3>
            <ul>{flow.frictionChecks.map((check) => <li key={check}>{check}</li>)}</ul>
          </div>
          <div>
            <h3>Evidence notes</h3>
            <ul>{flow.evidenceNotes.map((note) => <li key={note}>{note}</li>)}</ul>
          </div>
          <div>
            <h3>Selected FLOW prompts</h3>
            <ul>{flow.selectedPrompts.map((prompt) => <li key={`${prompt.stage}-${prompt.name}`}><b>{prompt.stage}:</b> {prompt.name} — {prompt.reason}</li>)}</ul>
          </div>
        </div>
      </details>

      {!page ? <p className="muted-card">Sitewide flow coverage: {summary.calculatorCount} calculator pages, {summary.comparisonCount} comparison pages, {summary.legalCount} support pages, {summary.stages} FLOW stages, and {summary.nextStepRoutes} validated next-step routes.</p> : null}
    </section>
  );
}
