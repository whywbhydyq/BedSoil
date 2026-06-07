import Image from 'next/image';
import { imageAltForTitle, PLANNING_DIAGRAM_IMAGE } from '@/lib/data/imageSeo';

export function SoilPlanningDiagram({ title, priority = false }: { title: string; priority?: boolean }) {
  return (
    <figure className="content-card visual-guide">
      <Image
        src="/raised-bed-soil-planning-diagram.svg"
        width={PLANNING_DIAGRAM_IMAGE.width}
        height={PLANNING_DIAGRAM_IMAGE.height}
        priority={priority}
        sizes="(max-width: 900px) 100vw, 900px"
        decoding="async"
        alt={imageAltForTitle(title)}
      />
      <figcaption>
        Measure inside length, inside width, and target fill depth first. Then adjust freeboard, settling allowance, bag size, bulk pricing, or mix ratio before using the shopping list.
      </figcaption>
    </figure>
  );
}
