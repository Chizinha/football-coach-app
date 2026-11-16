import type { DiagramDocument, DiagramObject, ArrowObject, GoalObject } from "../../types/exercise";

interface PitchDiagramViewProps {
  diagram?: DiagramDocument;
  title?: string;
  className?: string;
}

export function PitchDiagramView({ diagram, title = "Tactical Exercise Pitch Diagram", className = "" }: PitchDiagramViewProps) {
  if (!diagram || !diagram.objects) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-[var(--fc-border)] bg-[var(--fc-pale-green)]/30 text-sm font-medium text-[var(--fc-text-muted)]">
        No tactical diagram provided
      </div>
    );
  }

  const pitchType = diagram.pitchType || "box";

  return (
    <div className={`overflow-hidden rounded-xl border border-[var(--fc-border-strong)] bg-[#e8f2ea] shadow-xs ${className}`}>
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-auto block select-none"
        role="img"
        aria-label={title}
      >
        <title>{title}</title>
        <desc>Tactical football diagram displaying pitch layout, players, cones, ball, and movement vectors.</desc>

        {/* Pitch Background */}
        <rect width="1000" height="600" fill="#e8f2ea" />

        {/* Pitch Markings (Line color #6f8374) */}
        {pitchType === "box" && (
          <g stroke="#6f8374" strokeWidth="3" fill="none">
            <rect x="50" y="40" width="900" height="520" rx="8" />
            <line x1="500" y1="40" x2="500" y2="560" strokeDasharray="6 6" />
          </g>
        )}

        {pitchType === "half" && (
          <g stroke="#6f8374" strokeWidth="3" fill="none">
            {/* Outer boundary */}
            <rect x="50" y="40" width="900" height="520" />
            {/* Half-way line on left */}
            <line x1="50" y1="40" x2="50" y2="560" strokeWidth="4" />
            {/* Center circle arc */}
            <path d="M 50 180 A 120 120 0 0 1 50 420" />
            {/* Penalty box on right */}
            <rect x="680" y="140" width="270" height="320" />
            {/* 6-yard box on right */}
            <rect x="850" y="210" width="100" height="180" />
            {/* Penalty spot */}
            <circle cx="770" cy="300" r="4" fill="#6f8374" />
            {/* Penalty arc */}
            <path d="M 680 230 A 90 90 0 0 0 680 370" />
          </g>
        )}

        {pitchType === "full" && (
          <g stroke="#6f8374" strokeWidth="3" fill="none">
            {/* Outer boundary */}
            <rect x="50" y="40" width="900" height="520" />
            {/* Halfway line */}
            <line x1="500" y1="40" x2="500" y2="560" />
            {/* Center circle */}
            <circle cx="500" cy="300" r="90" />
            <circle cx="500" cy="300" r="4" fill="#6f8374" />
            {/* Left penalty box */}
            <rect x="50" y="150" width="180" height="300" />
            <rect x="50" y="210" width="60" height="180" />
            <circle cx="170" cy="300" r="4" fill="#6f8374" />
            <path d="M 230 230 A 90 90 0 0 1 230 370" />
            {/* Right penalty box */}
            <rect x="770" y="150" width="180" height="300" />
            <rect x="890" y="210" width="60" height="180" />
            <circle cx="830" cy="300" r="4" fill="#6f8374" />
            <path d="M 770 230 A 90 90 0 0 0 770 370" />
          </g>
        )}

        {/* Marker definitions for Arrows */}
        <defs>
          {/* Blue arrowhead for pass */}
          <marker id="arrow-pass" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#1d4ed8" />
          </marker>
          {/* Forest green arrowhead for run */}
          <marker id="arrow-run" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#174d32" />
          </marker>
          {/* Dribble arrowhead */}
          <marker id="arrow-dribble" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#174d32" />
          </marker>
        </defs>

        {/* Render Arrows first (behind players) */}
        {diagram.objects.filter((obj) => obj.type === "arrow").map((obj) => {
          const arrow = obj as ArrowObject;
          const isPass = arrow.arrowType === "pass";
          const isDribble = arrow.arrowType === "dribble";
          return (
            <g key={arrow.id} aria-hidden="true">
              <line
                x1={arrow.startX}
                y1={arrow.startY}
                x2={arrow.endX}
                y2={arrow.endY}
                stroke={isPass ? "#1d4ed8" : "#174d32"}
                strokeWidth={isPass ? "3.5" : "3"}
                strokeDasharray={isPass ? "8 6" : isDribble ? "3 3" : undefined}
                markerEnd={isPass ? "url(#arrow-pass)" : "url(#arrow-run)"}
              />
              {arrow.label && (
                <text
                  x={(arrow.startX + arrow.endX) / 2}
                  y={(arrow.startY + arrow.endY) / 2 - 8}
                  fill="#202821"
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="middle"
                  className="bg-white"
                >
                  {arrow.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Render Other Objects */}
        {diagram.objects.filter((obj) => obj.type !== "arrow").map((obj) => (
          <RenderDiagramObject key={obj.id} object={obj} />
        ))}
      </svg>
    </div>
  );
}

function RenderDiagramObject({ object }: { object: DiagramObject }) {
  if (object.type === "player") {
    const isTeamA = object.team === "teamA";
    const isTeamB = object.team === "teamB";
    const bgFill = isTeamA ? "#1d4ed8" : isTeamB ? "#b42318" : "#202821";
    return (
      <g transform={`translate(${object.x}, ${object.y})`} aria-hidden="true">
        <circle r="18" fill={bgFill} stroke="#ffffff" strokeWidth="2.5" />
        {object.number && (
          <text
            y="5"
            fill="#ffffff"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
          >
            {object.number}
          </text>
        )}
        {object.label && (
          <text
            y="32"
            fill="#202821"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >
            {object.label}
          </text>
        )}
      </g>
    );
  }

  if (object.type === "goalkeeper") {
    return (
      <g transform={`translate(${object.x}, ${object.y})`} aria-hidden="true">
        <circle r="18" fill="#a34a00" stroke="#ffffff" strokeWidth="2.5" />
        <text y="5" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
          GK
        </text>
        {object.label && (
          <text y="32" fill="#202821" fontSize="11" fontWeight="600" textAnchor="middle">
            {object.label}
          </text>
        )}
      </g>
    );
  }

  if (object.type === "cone") {
    return (
      <g transform={`translate(${object.x}, ${object.y})`} aria-hidden="true">
        <polygon points="0,-14 -12,12 12,12" fill="#a34a00" stroke="#ffffff" strokeWidth="1.5" />
      </g>
    );
  }

  if (object.type === "ball") {
    return (
      <g transform={`translate(${object.x}, ${object.y})`} aria-hidden="true">
        <circle r="10" fill="#ffffff" stroke="#202821" strokeWidth="2" />
        <circle r="4" fill="#202821" />
      </g>
    );
  }

  if (object.type === "goal") {
    const goal = object as GoalObject;
    const isStandard = goal.size === "standard";
    const width = isStandard ? 20 : 14;
    const height = isStandard ? 80 : 44;
    return (
      <g transform={`translate(${goal.x - width / 2}, ${goal.y - height / 2})`} aria-hidden="true">
        <rect
          width={width}
          height={height}
          fill="none"
          stroke="#202821"
          strokeWidth="3"
          rx="2"
        />
        {/* Goal net mesh */}
        <line x1="0" y1={height / 4} x2={width} y2={height / 4} stroke="#6f8374" strokeWidth="1" />
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#6f8374" strokeWidth="1" />
        <line x1="0" y1={(height * 3) / 4} x2={width} y2={(height * 3) / 4} stroke="#6f8374" strokeWidth="1" />
      </g>
    );
  }

  if (object.type === "label") {
    return (
      <g transform={`translate(${object.x}, ${object.y})`} aria-hidden="true">
        <text fill="#202821" fontSize="13" fontWeight="700" textAnchor="middle">
          {object.text}
        </text>
      </g>
    );
  }

  return null;
}
