import { useState, useRef, type MouseEvent, type ChangeEvent } from "react";
import type {
  DiagramDocument,
  DiagramObject,
  PitchType,
  ArrowType,
  PlayerObject,
  ArrowObject,
} from "../../types/exercise";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Plus,
  RotateCcw,
} from "lucide-react";
import { generateUniqueId } from "../../lib/utils";

interface PitchDiagramEditorProps {
  diagram?: DiagramDocument;
  onChange: (diagram: DiagramDocument) => void;
}

const DEFAULT_DIAGRAM: DiagramDocument = {
  version: "1.0",
  pitchType: "half",
  viewBox: "0 0 1000 600",
  objects: [],
};

export function PitchDiagramEditor({ diagram = DEFAULT_DIAGRAM, onChange }: PitchDiagramEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const currentDiagram: DiagramDocument = {
    version: "1.0",
    pitchType: diagram.pitchType || "half",
    viewBox: "0 0 1000 600",
    objects: diagram.objects || [],
  };

  const selectedObject = currentDiagram.objects.find((obj) => obj.id === selectedId);

  // SVG coordinate conversion
  const getSvgCoordinates = (e: MouseEvent): { x: number; y: number } | null => {
    if (!svgRef.current) return null;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return null;
    const svgPoint = pt.matrixTransform(ctm.inverse());
    return {
      x: Math.round(Math.max(20, Math.min(980, svgPoint.x))),
      y: Math.round(Math.max(20, Math.min(580, svgPoint.y))),
    };
  };

  // Add Object
  const handleAddObject = (type: "playerA" | "playerB" | "neutral" | "gk" | "cone" | "ball" | "goal" | "pass" | "run") => {
    const id = generateUniqueId("obj");
    let newObj: DiagramObject;

    if (type === "playerA") {
      newObj = { id, type: "player", team: "teamA", x: 500, y: 300, number: "7", label: "Player" };
    } else if (type === "playerB") {
      newObj = { id, type: "player", team: "teamB", x: 500, y: 300, number: "4", label: "Defender" };
    } else if (type === "neutral") {
      newObj = { id, type: "player", team: "neutral", x: 500, y: 300, number: "N", label: "Neutral" };
    } else if (type === "gk") {
      newObj = { id, type: "goalkeeper", team: "teamB", x: 800, y: 300, label: "GK" };
    } else if (type === "cone") {
      newObj = { id, type: "cone", x: 500, y: 300, color: "orange" };
    } else if (type === "ball") {
      newObj = { id, type: "ball", x: 480, y: 300 };
    } else if (type === "goal") {
      newObj = { id, type: "goal", x: 860, y: 300, orientation: "west", size: "standard" };
    } else if (type === "pass") {
      newObj = { id, type: "arrow", arrowType: "pass", startX: 400, startY: 300, endX: 600, endY: 300, label: "Pass" };
    } else {
      newObj = { id, type: "arrow", arrowType: "run", startX: 400, startY: 300, endX: 600, endY: 200, label: "Run" };
    }

    const updated = {
      ...currentDiagram,
      objects: [...currentDiagram.objects, newObj],
    };
    onChange(updated);
    setSelectedId(id);
  };

  // Update Pitch Type
  const handlePitchTypeChange = (pitchType: PitchType) => {
    onChange({
      ...currentDiagram,
      pitchType,
    });
  };

  // Delete Selected
  const handleDeleteSelected = () => {
    if (!selectedId) return;
    const updated = {
      ...currentDiagram,
      objects: currentDiagram.objects.filter((obj) => obj.id !== selectedId),
    };
    onChange(updated);
    setSelectedId(null);
  };

  // Clear Canvas
  const handleClearCanvas = () => {
    onChange({
      ...currentDiagram,
      objects: [],
    });
    setSelectedId(null);
  };

  // Nudge movement (non-drag alternative)
  const handleNudge = (dx: number, dy: number) => {
    if (!selectedId) return;
    const updatedObjects = currentDiagram.objects.map((obj) => {
      if (obj.id !== selectedId) return obj;
      if (obj.type === "arrow") {
        return {
          ...obj,
          startX: Math.max(20, Math.min(980, obj.startX + dx)),
          startY: Math.max(20, Math.min(580, obj.startY + dy)),
          endX: Math.max(20, Math.min(980, obj.endX + dx)),
          endY: Math.max(20, Math.min(580, obj.endY + dy)),
        };
      }
      return {
        ...obj,
        x: Math.max(20, Math.min(980, obj.x + dx)),
        y: Math.max(20, Math.min(580, obj.y + dy)),
      };
    });
    onChange({ ...currentDiagram, objects: updatedObjects });
  };

  // Direct Coordinate Change (non-drag alternative)
  const handleCoordinateChange = (axis: "x" | "y", value: number) => {
    if (!selectedId || isNaN(value)) return;
    const clamped = Math.max(20, Math.min(axis === "x" ? 980 : 580, value));
    const updatedObjects = currentDiagram.objects.map((obj) => {
      if (obj.id !== selectedId) return obj;
      if (obj.type === "arrow") {
        return axis === "x" ? { ...obj, startX: clamped } : { ...obj, startY: clamped };
      }
      return { ...obj, [axis]: clamped };
    });
    onChange({ ...currentDiagram, objects: updatedObjects });
  };

  // Mouse drag handlers on SVG canvas
  const handleMouseDown = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    setDraggingId(id);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingId) return;
    const coords = getSvgCoordinates(e);
    if (!coords) return;

    const updatedObjects = currentDiagram.objects.map((obj) => {
      if (obj.id !== draggingId) return obj;
      if (obj.type === "arrow") {
        const dx = coords.x - obj.startX;
        const dy = coords.y - obj.startY;
        return {
          ...obj,
          startX: coords.x,
          startY: coords.y,
          endX: obj.endX + dx,
          endY: obj.endY + dy,
        };
      }
      return { ...obj, x: coords.x, y: coords.y };
    });
    onChange({ ...currentDiagram, objects: updatedObjects });
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div className="space-y-4 rounded-xl border border-[var(--fc-border)] bg-white p-4 sm:p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--fc-border)] pb-3">
        <div>
          <h3 className="text-base font-bold text-[var(--fc-text)]">Tactical Pitch Editor</h3>
          <p className="text-xs text-[var(--fc-text-muted)]">
            Click objects on canvas or use accessible keyboard controls below.
          </p>
        </div>

        {/* Pitch Area Selector */}
        <div className="flex items-center gap-1.5 rounded-lg border border-[var(--fc-border)] p-1 bg-[#f7f9f7]">
          {(["box", "half", "full"] as PitchType[]).map((pType) => (
            <button
              key={pType}
              type="button"
              onClick={() => handlePitchTypeChange(pType)}
              className={`rounded px-2.5 py-1 text-xs font-semibold capitalize transition focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)] ${
                currentDiagram.pitchType === pType
                  ? "bg-white text-[var(--fc-forest)] shadow-xs"
                  : "text-[var(--fc-text-muted)] hover:text-[var(--fc-text)]"
              }`}
            >
              {pType === "box" ? "Grid / Box" : pType === "half" ? "Half Pitch" : "Full Pitch"}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar: Add Objects */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[var(--fc-text-muted)] mr-1">Add:</span>
        <button
          type="button"
          onClick={() => handleAddObject("playerA")}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#eff6ff] px-3 text-xs font-semibold text-[#1d4ed8] border border-[#bfdbfe] hover:bg-[#dbeafe] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
          <Plus className="size-3.5" />
          <span>Team A (Blue)</span>
        </button>
        <button
          type="button"
          onClick={() => handleAddObject("playerB")}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#fef3f2] px-3 text-xs font-semibold text-[#b42318] border border-[#fecaca] hover:bg-[#fee2e2] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
          <Plus className="size-3.5" />
          <span>Team B (Red)</span>
        </button>
        <button
          type="button"
          onClick={() => handleAddObject("neutral")}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#f0f3f0] px-3 text-xs font-semibold text-[#202821] border border-[#dde3de] hover:bg-[#e4eae4] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
          <Plus className="size-3.5" />
          <span>Neutral</span>
        </button>
        <button
          type="button"
          onClick={() => handleAddObject("gk")}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#fff7ed] px-3 text-xs font-semibold text-[#a34a00] border border-[#fed7aa] hover:bg-[#ffedd5] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
          <Plus className="size-3.5" />
          <span>Goalkeeper</span>
        </button>
        <button
          type="button"
          onClick={() => handleAddObject("cone")}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#fff7ed] px-3 text-xs font-semibold text-[#a34a00] border border-[#fed7aa] hover:bg-[#ffedd5] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
          <Plus className="size-3.5" />
          <span>Cone</span>
        </button>
        <button
          type="button"
          onClick={() => handleAddObject("ball")}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-xs font-semibold text-[#202821] hover:bg-[#f7f9f7] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
          <Plus className="size-3.5" />
          <span>Ball</span>
        </button>
        <button
          type="button"
          onClick={() => handleAddObject("goal")}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-xs font-semibold text-[#202821] hover:bg-[#f7f9f7] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
          <Plus className="size-3.5" />
          <span>Goal</span>
        </button>
        <button
          type="button"
          onClick={() => handleAddObject("pass")}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#eff6ff] px-3 text-xs font-semibold text-[#1d4ed8] border border-[#bfdbfe] hover:bg-[#dbeafe] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
          <Plus className="size-3.5" />
          <span>Pass Arrow</span>
        </button>
        <button
          type="button"
          onClick={() => handleAddObject("run")}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#e8f2ea] px-3 text-xs font-semibold text-[#174d32] border border-[#dde3de] hover:bg-[#d5e7d9] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
          <Plus className="size-3.5" />
          <span>Run Arrow</span>
        </button>
      </div>

      {/* Interactive SVG Canvas */}
      <div
        className="relative overflow-hidden rounded-xl border-2 border-[var(--fc-border-strong)] bg-[#e8f2ea] select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 1000 600"
          className="w-full h-auto block cursor-crosshair"
          role="region"
          aria-label="Tactical pitch editing canvas"
          onClick={() => setSelectedId(null)}
        >
          {/* Pitch background */}
          <rect width="1000" height="600" fill="#e8f2ea" />

          {/* Markings */}
          {currentDiagram.pitchType === "box" && (
            <g stroke="#6f8374" strokeWidth="3" fill="none">
              <rect x="50" y="40" width="900" height="520" rx="8" />
              <line x1="500" y1="40" x2="500" y2="560" strokeDasharray="6 6" />
            </g>
          )}

          {currentDiagram.pitchType === "half" && (
            <g stroke="#6f8374" strokeWidth="3" fill="none">
              <rect x="50" y="40" width="900" height="520" />
              <line x1="500" y1="40" x2="500" y2="560" strokeWidth="4" />
              <path d="M 500 180 A 120 120 0 0 0 500 420" />
              <rect x="680" y="140" width="270" height="320" />
              <rect x="850" y="210" width="100" height="180" />
              <circle cx="770" cy="300" r="4" fill="#6f8374" />
              <path d="M 680 230 A 90 90 0 0 0 680 370" />
            </g>
          )}

          {currentDiagram.pitchType === "full" && (
            <g stroke="#6f8374" strokeWidth="3" fill="none">
              <rect x="50" y="40" width="900" height="520" />
              <line x1="500" y1="40" x2="500" y2="560" />
              <circle cx="500" cy="300" r="90" />
              <circle cx="500" cy="300" r="4" fill="#6f8374" />
              <rect x="50" y="150" width="180" height="300" />
              <rect x="50" y="210" width="60" height="180" />
              <circle cx="170" cy="300" r="4" fill="#6f8374" />
              <path d="M 230 230 A 90 90 0 0 1 230 370" />
              <rect x="770" y="150" width="180" height="300" />
              <rect x="890" y="210" width="60" height="180" />
              <circle cx="830" cy="300" r="4" fill="#6f8374" />
              <path d="M 770 230 A 90 90 0 0 0 770 370" />
            </g>
          )}

          <defs>
            <marker id="edit-arrow-pass" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#1d4ed8" />
            </marker>
            <marker id="edit-arrow-run" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#174d32" />
            </marker>
          </defs>

          {/* Render Arrows */}
          {currentDiagram.objects.filter((obj) => obj.type === "arrow").map((obj) => {
            const arrow = obj as ArrowObject;
            const isSelected = selectedId === arrow.id;
            const isPass = arrow.arrowType === "pass";
            return (
              <g
                key={arrow.id}
                onMouseDown={(e) => handleMouseDown(arrow.id, e)}
                className="cursor-pointer"
              >
                <line
                  x1={arrow.startX}
                  y1={arrow.startY}
                  x2={arrow.endX}
                  y2={arrow.endY}
                  stroke={isSelected ? "#a34a00" : isPass ? "#1d4ed8" : "#174d32"}
                  strokeWidth={isSelected ? "5" : "3.5"}
                  strokeDasharray={isPass ? "8 6" : undefined}
                  markerEnd={isPass ? "url(#edit-arrow-pass)" : "url(#edit-arrow-run)"}
                />
                {arrow.label && (
                  <text
                    x={(arrow.startX + arrow.endX) / 2}
                    y={(arrow.startY + arrow.endY) / 2 - 8}
                    fill="#202821"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {arrow.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Render other objects */}
          {currentDiagram.objects.filter((obj) => obj.type !== "arrow").map((obj) => {
            const isSelected = selectedId === obj.id;
            return (
              <g
                key={obj.id}
                onMouseDown={(e) => handleMouseDown(obj.id, e)}
                className="cursor-pointer"
              >
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={obj.x}
                    cy={obj.y}
                    r="26"
                    fill="none"
                    stroke="#174d32"
                    strokeWidth="3"
                    strokeDasharray="4 3"
                  />
                )}

                {obj.type === "player" && (
                  <g transform={`translate(${obj.x}, ${obj.y})`}>
                    <circle
                      r="18"
                      fill={obj.team === "teamA" ? "#1d4ed8" : obj.team === "teamB" ? "#b42318" : "#202821"}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                    {obj.number && (
                      <text y="5" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
                        {obj.number}
                      </text>
                    )}
                    {obj.label && (
                      <text y="32" fill="#202821" fontSize="11" fontWeight="600" textAnchor="middle">
                        {obj.label}
                      </text>
                    )}
                  </g>
                )}

                {obj.type === "goalkeeper" && (
                  <g transform={`translate(${obj.x}, ${obj.y})`}>
                    <circle r="18" fill="#a34a00" stroke="#ffffff" strokeWidth="2.5" />
                    <text y="5" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                      GK
                    </text>
                    {obj.label && (
                      <text y="32" fill="#202821" fontSize="11" fontWeight="600" textAnchor="middle">
                        {obj.label}
                      </text>
                    )}
                  </g>
                )}

                {obj.type === "cone" && (
                  <g transform={`translate(${obj.x}, ${obj.y})`}>
                    <polygon points="0,-14 -12,12 12,12" fill="#a34a00" stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                )}

                {obj.type === "ball" && (
                  <g transform={`translate(${obj.x}, ${obj.y})`}>
                    <circle r="10" fill="#ffffff" stroke="#202821" strokeWidth="2" />
                    <circle r="4" fill="#202821" />
                  </g>
                )}

                {obj.type === "goal" && (
                  <g transform={`translate(${obj.x - 10}, ${obj.y - 40})`}>
                    <rect width="20" height="80" fill="none" stroke="#202821" strokeWidth="3" rx="2" />
                    <line x1="0" y1="20" x2="20" y2="20" stroke="#6f8374" strokeWidth="1" />
                    <line x1="0" y1="40" x2="20" y2="40" stroke="#6f8374" strokeWidth="1" />
                    <line x1="0" y1="60" x2="20" y2="60" stroke="#6f8374" strokeWidth="1" />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Accessible Non-Drag Controls & Object Inventory Panel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 pt-2 border-t border-[var(--fc-border)]">
        {/* Object Selection & Nudge Controller */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="object-selector" className="text-xs font-bold text-[var(--fc-text)]">
              Select Object (Non-drag Alternative)
            </label>
            {selectedObject && (
              <button
                type="button"
                onClick={handleDeleteSelected}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#b42318] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)] rounded"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
                <span>Delete selected</span>
              </button>
            )}
          </div>

          <select
            id="object-selector"
            value={selectedId || ""}
            onChange={(e) => setSelectedId(e.target.value || null)}
            className="w-full rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 py-2 text-sm text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            <option value="">-- Choose an object from canvas ({currentDiagram.objects.length} total) --</option>
            {currentDiagram.objects.map((obj, idx) => {
              const label =
                obj.type === "player"
                  ? `${obj.team === "teamA" ? "Team A (Blue)" : obj.team === "teamB" ? "Team B (Red)" : "Neutral"} #${obj.number || idx + 1} ${obj.label || ""}`
                  : obj.type === "goalkeeper"
                  ? `Goalkeeper (${obj.label || "GK"})`
                  : obj.type === "cone"
                  ? `Cone #${idx + 1}`
                  : obj.type === "ball"
                  ? `Ball #${idx + 1}`
                  : obj.type === "goal"
                  ? `Goal #${idx + 1}`
                  : `${(obj as ArrowObject).arrowType.toUpperCase()} Arrow: ${(obj as ArrowObject).label || ""}`;
              return (
                <option key={obj.id} value={obj.id}>
                  {idx + 1}. {label}
                </option>
              );
            })}
          </select>

          {/* Nudge & Position Controls when an object is selected */}
          {selectedObject ? (
            <div className="rounded-lg border border-[var(--fc-border)] bg-[#f7f9f7] p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--fc-forest)]">Nudge / Move Position</span>
                <span className="text-xs text-[var(--fc-text-muted)]">
                  Coordinates: X={selectedObject.type === "arrow" ? selectedObject.startX : selectedObject.x}, Y={selectedObject.type === "arrow" ? selectedObject.startY : selectedObject.y}
                </span>
              </div>

              {/* Directional Nudge Pad */}
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNudge(-25, 0)}
                  aria-label="Move left 25 pixels"
                  className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--fc-border-strong)] bg-white shadow-xs hover:bg-[#e8f2ea] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleNudge(0, -25)}
                    aria-label="Move up 25 pixels"
                    className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--fc-border-strong)] bg-white shadow-xs hover:bg-[#e8f2ea] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNudge(0, 25)}
                    aria-label="Move down 25 pixels"
                    className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--fc-border-strong)] bg-white shadow-xs hover:bg-[#e8f2ea] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleNudge(25, 0)}
                  aria-label="Move right 25 pixels"
                  className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--fc-border-strong)] bg-white shadow-xs hover:bg-[#e8f2ea] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>

              {/* Exact coordinate inputs */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label htmlFor="coord-x" className="block text-[11px] font-semibold text-[var(--fc-text-muted)]">
                    X Position (0..1000)
                  </label>
                  <input
                    id="coord-x"
                    type="number"
                    min="0"
                    max="1000"
                    step="10"
                    value={selectedObject.type === "arrow" ? selectedObject.startX : selectedObject.x}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleCoordinateChange("x", parseInt(e.target.value, 10))}
                    className="mt-1 w-full rounded border border-[var(--fc-border-strong)] bg-white px-2 py-1 text-xs text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                  />
                </div>
                <div>
                  <label htmlFor="coord-y" className="block text-[11px] font-semibold text-[var(--fc-text-muted)]">
                    Y Position (0..600)
                  </label>
                  <input
                    id="coord-y"
                    type="number"
                    min="0"
                    max="600"
                    step="10"
                    value={selectedObject.type === "arrow" ? selectedObject.startY : selectedObject.y}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleCoordinateChange("y", parseInt(e.target.value, 10))}
                    className="mt-1 w-full rounded border border-[var(--fc-border-strong)] bg-white px-2 py-1 text-xs text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[var(--fc-text-muted)] italic">
              Select an object from the list or canvas to move it or edit its details.
            </p>
          )}
        </div>

        {/* Selected Object Attributes Editor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--fc-text)]">Object Properties</span>
            <button
              type="button"
              onClick={handleClearCanvas}
              className="inline-flex items-center gap-1 text-xs font-medium text-[var(--fc-text-muted)] hover:text-[#b42318] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)] rounded"
            >
              <RotateCcw className="size-3" aria-hidden="true" />
              <span>Clear pitch</span>
            </button>
          </div>

          {selectedObject?.type === "player" && (
            <div className="rounded-lg border border-[var(--fc-border)] bg-[#f7f9f7] p-3 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="player-team" className="block font-semibold text-[var(--fc-text-muted)]">
                    Team
                  </label>
                  <select
                    id="player-team"
                    value={(selectedObject as PlayerObject).team}
                    onChange={(e) => {
                      const updated = currentDiagram.objects.map((o) =>
                        o.id === selectedId && o.type === "player"
                          ? { ...o, team: e.target.value as "teamA" | "teamB" | "neutral" }
                          : o
                      );
                      onChange({ ...currentDiagram, objects: updated });
                    }}
                    className="mt-1 w-full rounded border border-[var(--fc-border-strong)] bg-white px-2 py-1 text-xs focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                  >
                    <option value="teamA">Team A (Blue)</option>
                    <option value="teamB">Team B (Red)</option>
                    <option value="neutral">Neutral (Dark)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="player-number" className="block font-semibold text-[var(--fc-text-muted)]">
                    Jersey #
                  </label>
                  <input
                    id="player-number"
                    type="text"
                    maxLength={3}
                    value={(selectedObject as PlayerObject).number || ""}
                    onChange={(e) => {
                      const updated = currentDiagram.objects.map((o) =>
                        o.id === selectedId && o.type === "player" ? { ...o, number: e.target.value } : o
                      );
                      onChange({ ...currentDiagram, objects: updated });
                    }}
                    className="mt-1 w-full rounded border border-[var(--fc-border-strong)] bg-white px-2 py-1 text-xs focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="player-label" className="block font-semibold text-[var(--fc-text-muted)]">
                  Tactical Role / Label (e.g. Winger, CM)
                </label>
                <input
                  id="player-label"
                  type="text"
                  value={(selectedObject as PlayerObject).label || ""}
                  onChange={(e) => {
                    const updated = currentDiagram.objects.map((o) =>
                      o.id === selectedId && o.type === "player" ? { ...o, label: e.target.value } : o
                    );
                    onChange({ ...currentDiagram, objects: updated });
                  }}
                  className="mt-1 w-full rounded border border-[var(--fc-border-strong)] bg-white px-2 py-1 text-xs focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                />
              </div>
            </div>
          )}

          {selectedObject?.type === "arrow" && (
            <div className="rounded-lg border border-[var(--fc-border)] bg-[#f7f9f7] p-3 space-y-3 text-xs">
              <div>
                <label htmlFor="arrow-type" className="block font-semibold text-[var(--fc-text-muted)]">
                  Arrow Meaning
                </label>
                <select
                  id="arrow-type"
                  value={(selectedObject as ArrowObject).arrowType}
                  onChange={(e) => {
                    const updated = currentDiagram.objects.map((o) =>
                      o.id === selectedId && o.type === "arrow" ? { ...o, arrowType: e.target.value as ArrowType } : o
                    );
                    onChange({ ...currentDiagram, objects: updated });
                  }}
                  className="mt-1 w-full rounded border border-[var(--fc-border-strong)] bg-white px-2 py-1 text-xs focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                >
                  <option value="pass">Pass (Dashed Blue)</option>
                  <option value="run">Player Run (Solid Forest Green)</option>
                  <option value="dribble">Dribble (Dotted Line)</option>
                </select>
              </div>
              <div>
                <label htmlFor="arrow-label" className="block font-semibold text-[var(--fc-text-muted)]">
                  Arrow Note / Step Label
                </label>
                <input
                  id="arrow-label"
                  type="text"
                  value={(selectedObject as ArrowObject).label || ""}
                  onChange={(e) => {
                    const updated = currentDiagram.objects.map((o) =>
                      o.id === selectedId && o.type === "arrow" ? { ...o, label: e.target.value } : o
                    );
                    onChange({ ...currentDiagram, objects: updated });
                  }}
                  className="mt-1 w-full rounded border border-[var(--fc-border-strong)] bg-white px-2 py-1 text-xs focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                />
              </div>
            </div>
          )}

          {!selectedObject && (
            <div className="rounded-lg border border-[var(--fc-border)] bg-[#f7f9f7] p-4 text-xs text-[var(--fc-text-muted)] space-y-2">
              <p className="font-semibold text-[var(--fc-forest)]">Quick Accessibility Guide:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>You can add, position, and edit tactical items without using a mouse.</li>
                <li>Use the dropdown list above to select any item, then use the arrow buttons to move it.</li>
                <li>Ensure every tactical diagram is accompanied by a written explanation.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
