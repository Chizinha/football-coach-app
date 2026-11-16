import type { Exercise } from "../types/exercise";
import type { TrainingSession } from "../types/session";
import type { ClubPrinciplesData } from "../types/principles";

export const DEFAULT_CATEGORIES: string[] = [
  "Warm-up",
  "Passing & Receiving",
  "Possession",
  "Dribbling & 1v1",
  "Defending",
  "Shooting & Finishing",
  "Transition",
];

export const DEFAULT_AGE_GROUPS: string[] = [
  "U7–U9",
  "U10–U12",
  "U13–U15",
  "U16–U19",
  "Senior",
  "All ages",
];

export const SEED_EXERCISES: Exercise[] = [
  {
    id: "ex-1",
    title: "Rondo 4v2 with Quick Transitions",
    description: "High-tempo possession drill developing fast ball circulation, body shape, and immediate counter-pressing upon losing possession.",
    theme: "Warm-up",
    ageGroups: ["U13–U15", "U16–U19", "Senior"],
    durationMinutes: 15,
    playerCount: { min: 6, max: 8 },
    equipment: ["4 Cones", "1 Ball (plus spares)", "Bibs for 2 defenders"],
    playingArea: "10m x 10m square",
    setup: "Set out a 10m x 10m grid with 4 orange cones. Four attacking players position themselves on the outside perimeter (one per side). Two defending players work together in the middle.",
    instructions: [
      "Attacking players circulate the ball in 1 or 2 touches along the perimeter.",
      "Defenders press in pairs to intercept or force an error.",
      "If a defender wins the ball, the attacker who made the mistake swaps roles with that defender.",
      "Attackers score 1 point for every 10 consecutive passes.",
      "Play sets of 3 minutes with 45 seconds rest."
    ],
    coachingPoints: [
      "Open body shape receiving across the body on the back foot.",
      "Weight and accuracy of pass to teammate's safe side.",
      "Constant supporting angles and micro-adjustments along the perimeter line.",
      "Communication: early call of 'Turn', 'Man on', or 'Bounce'."
    ],
    progressions: [
      "Limit outer players to maximum 1 touch.",
      "Split pass between the two defenders counts as double points."
    ],
    diagramDescription: "10x10m square grid with four Team A blue players stationed on outer edges and two Team B red defenders pressing in the central corridor.",
    diagram: {
      version: "1.0",
      pitchType: "box",
      viewBox: "0 0 1000 600",
      objects: [
        { id: "c1", type: "cone", x: 250, y: 100, color: "orange" },
        { id: "c2", type: "cone", x: 750, y: 100, color: "orange" },
        { id: "c3", type: "cone", x: 750, y: 500, color: "orange" },
        { id: "c4", type: "cone", x: 250, y: 500, color: "orange" },
        // Attackers (Team A Blue)
        { id: "p1", type: "player", team: "teamA", number: "3", x: 250, y: 300, label: "Left Edge" },
        { id: "p2", type: "player", team: "teamA", number: "6", x: 500, y: 100, label: "Top Edge" },
        { id: "p3", type: "player", team: "teamA", number: "8", x: 750, y: 300, label: "Right Edge" },
        { id: "p4", type: "player", team: "teamA", number: "10", x: 500, y: 500, label: "Bottom Edge" },
        // Defenders (Team B Red)
        { id: "p5", type: "player", team: "teamB", number: "4", x: 440, y: 260, label: "Presser" },
        { id: "p6", type: "player", team: "teamB", number: "5", x: 550, y: 330, label: "Cover" },
        // Ball
        { id: "b1", type: "ball", x: 290, y: 300 },
        // Movement & Passes
        { id: "a1", type: "arrow", arrowType: "pass", startX: 290, startY: 280, endX: 470, endY: 130, label: "Firm Pass" },
        { id: "a2", type: "arrow", arrowType: "run", startX: 440, startY: 260, endX: 460, endY: 170, label: "Press" }
      ]
    },
    visibility: "club",
    creatorName: "Coach Marcus (Senior Academy)",
    createdAt: "2026-11-01T09:00:00Z",
    updatedAt: "2026-11-05T14:30:00Z"
  },
  {
    id: "ex-2",
    title: "Triangular Combination & 3rd Man Run",
    description: "Structured passing pattern to build rhythmic 1-touch combinations and dynamic forward runs breaking defensive lines.",
    theme: "Passing & Receiving",
    ageGroups: ["U13–U15", "U16–U19", "Senior"],
    durationMinutes: 20,
    playerCount: { min: 8, max: 12 },
    equipment: ["6 Cones / Mannequins", "Balls", "Pinnies"],
    playingArea: "25m x 20m channel",
    setup: "Set up a triangle with mannequin/cone stations 15m apart. Station players at points A, B, and C with rotation after each sequence.",
    instructions: [
      "Player A passes into the feet of Player B who checks off the mannequin.",
      "Player B sets the ball back with one touch to Player A.",
      "Player A plays a penetrating pass into Player C's dynamic third-man run.",
      "Player C controls and dribbles to the start station; all players follow their pass."
    ],
    coachingPoints: [
      "Check away from marker before checking toward the ball.",
      "Quality of the set pass: soft cushion allowing forward strike.",
      "Timing of the third-man run: sprint as the set pass is struck, not before.",
      "Accurate lead pass into space ahead of the runner."
    ],
    progressions: [
      "Add a live passive defender tracking Player B.",
      "Finish with a strike on a mini-goal."
    ],
    diagramDescription: "Triangle setup with Station A at bottom, Station B at right, Station C at top left, showing passing sequence A-B-A-C.",
    diagram: {
      version: "1.0",
      pitchType: "half",
      viewBox: "0 0 1000 600",
      objects: [
        { id: "c1", type: "cone", x: 200, y: 480, color: "orange" },
        { id: "c2", type: "cone", x: 700, y: 480, color: "orange" },
        { id: "c3", type: "cone", x: 450, y: 150, color: "orange" },
        // Players
        { id: "p1", type: "player", team: "teamA", number: "6", x: 200, y: 520, label: "Station A" },
        { id: "p2", type: "player", team: "teamA", number: "8", x: 670, y: 450, label: "Station B" },
        { id: "p3", type: "player", team: "teamA", number: "7", x: 450, y: 190, label: "Station C" },
        // Ball
        { id: "b1", type: "ball", x: 230, y: 505 },
        // Passes and runs
        { id: "a1", type: "arrow", arrowType: "pass", startX: 240, startY: 500, endX: 630, endY: 460, label: "1. Entry pass" },
        { id: "a2", type: "arrow", arrowType: "pass", startX: 650, startY: 440, endX: 300, endY: 460, label: "2. Set back" },
        { id: "a3", type: "arrow", arrowType: "run", startX: 450, startY: 230, endX: 520, endY: 340, label: "3. 3rd man run" },
        { id: "a4", type: "arrow", arrowType: "pass", startX: 320, startY: 450, endX: 520, endY: 350, label: "4. Through ball" }
      ]
    },
    visibility: "club",
    creatorName: "Coach Marcus (Senior Academy)",
    createdAt: "2026-11-03T11:00:00Z",
    updatedAt: "2026-11-06T16:00:00Z"
  },
  {
    id: "ex-3",
    title: "4v4 + 3 Neutrals Positional Possession",
    description: "Classic positional game reinforcing building through the central midfielder with defensive pressing and overload creation.",
    theme: "Possession",
    ageGroups: ["U13–U15", "U16–U19", "Senior"],
    durationMinutes: 20,
    playerCount: { min: 11, max: 11 },
    equipment: ["Cones", "Bibs (3 colors: Blue, Red, Yellow)", "Balls"],
    playingArea: "30m x 25m rectangle",
    setup: "Rectangle 30m x 25m with two neutral players (Yellow) on opposite end lines and one neutral in the center. Team A (Blue 4) and Team B (Red 4) contest inside.",
    instructions: [
      "Team in possession plays with the 3 neutrals to keep the ball (7v4 numerical superiority).",
      "Goal is to transfer the ball from one end-neutral to the other end-neutral.",
      "The team out of possession presses aggressively to win the ball.",
      "On winning possession, the defending team immediately becomes the attacking team.",
      "Limit neutral players to 2 touches."
    ],
    coachingPoints: [
      "Spacing: stretch the width and depth of the grid.",
      "Patience in circulation until the central penetrative line opens up.",
      "Body shape facing forward when receiving from end neutral.",
      "Instant counter-press when ball is lost (3-second rule)."
    ],
    progressions: [
      "Center neutral is restricted to 1 touch.",
      "Add mini-goals on the corners for the defending team on ball retrieval."
    ],
    diagramDescription: "30x25m pitch with 3 neutral players (ends and center), 4 blue attackers, and 4 red defenders.",
    diagram: {
      version: "1.0",
      pitchType: "box",
      viewBox: "0 0 1000 600",
      objects: [
        { id: "c1", type: "cone", x: 150, y: 80, color: "orange" },
        { id: "c2", type: "cone", x: 850, y: 80, color: "orange" },
        { id: "c3", type: "cone", x: 850, y: 520, color: "orange" },
        { id: "c4", type: "cone", x: 150, y: 520, color: "orange" },
        // Neutrals (Dark neutral jersey)
        { id: "n1", type: "player", team: "neutral", number: "N1", x: 150, y: 300, label: "End N" },
        { id: "n2", type: "player", team: "neutral", number: "N2", x: 500, y: 300, label: "Center N" },
        { id: "n3", type: "player", team: "neutral", number: "N3", x: 850, y: 300, label: "End N" },
        // Blue Team A
        { id: "b1", type: "player", team: "teamA", number: "2", x: 340, y: 160, label: "Fullback" },
        { id: "b2", type: "player", team: "teamA", number: "3", x: 340, y: 440, label: "Fullback" },
        { id: "b3", type: "player", team: "teamA", number: "8", x: 620, y: 160, label: "Winger" },
        { id: "b4", type: "player", team: "teamA", number: "10", x: 620, y: 440, label: "Winger" },
        // Red Team B
        { id: "r1", type: "player", team: "teamB", number: "4", x: 420, y: 230, label: "CB" },
        { id: "r2", type: "player", team: "teamB", number: "5", x: 420, y: 370, label: "CB" },
        { id: "r3", type: "player", team: "teamB", number: "6", x: 570, y: 230, label: "CM" },
        { id: "r4", type: "player", team: "teamB", number: "9", x: 570, y: 370, label: "CF" },
        // Ball
        { id: "ball", type: "ball", x: 180, y: 300 },
        // Pass arrow
        { id: "arr1", type: "arrow", arrowType: "pass", startX: 185, startY: 300, endX: 460, endY: 300, label: "Split pass" }
      ]
    },
    visibility: "club",
    creatorName: "Coach Sarah (Youth Coordinator)",
    createdAt: "2026-11-02T14:15:00Z",
    updatedAt: "2026-11-08T10:00:00Z"
  },
  {
    id: "ex-4",
    title: "1v1 Channel Duel with Counter Goals",
    description: "Intense individual attacking and defending drill focusing on change of pace, feints, body feints, and defensive delay techniques.",
    theme: "Dribbling & 1v1",
    ageGroups: ["U10–U12", "U13–U15"],
    durationMinutes: 15,
    playerCount: { min: 6, max: 10 },
    equipment: ["Cones", "2 Mini-goals", "Balls"],
    playingArea: "20m x 12m corridor",
    setup: "Set up a narrow corridor with 1 mini-goal on the attacker's target end line and 2 small gate counter-goals for the defender.",
    instructions: [
      "Attacker initiates the action by dribbling into the channel.",
      "Defender steps out from the goal line to engage and contain.",
      "Attacker attempts to beat the defender and score in the mini-goal.",
      "If the defender steals the ball, they can counter-attack through either side gate."
    ],
    coachingPoints: [
      "Attacker: Commit the defender with positive speed before executing a fake or shift.",
      "Attacker: Low center of gravity and explode into space behind the defender.",
      "Defender: Side-on body shape, force toward the weaker foot, do not dive in recklessly."
    ],
    progressions: [
      "Add a trailing recovery defender who starts 3 meters behind the attacker after 2 seconds."
    ],
    diagramDescription: "Corridor with attacker facing defender and mini goals at ends.",
    diagram: {
      version: "1.0",
      pitchType: "box",
      viewBox: "0 0 1000 600",
      objects: [
        { id: "c1", type: "cone", x: 200, y: 150, color: "orange" },
        { id: "c2", type: "cone", x: 800, y: 150, color: "orange" },
        { id: "c3", type: "cone", x: 800, y: 450, color: "orange" },
        { id: "c4", type: "cone", x: 200, y: 450, color: "orange" },
        // Target Goal
        { id: "g1", type: "goal", x: 800, y: 300, orientation: "west", size: "mini" },
        // Attacker
        { id: "p1", type: "player", team: "teamA", number: "7", x: 280, y: 300, label: "Attacker" },
        // Defender
        { id: "p2", type: "player", team: "teamB", number: "3", x: 620, y: 300, label: "Defender" },
        // Ball
        { id: "b1", type: "ball", x: 320, y: 300 },
        // Movement
        { id: "a1", type: "arrow", arrowType: "dribble", startX: 330, startY: 300, endX: 520, endY: 260, label: "Shift & accelerate" },
        { id: "a2", type: "arrow", arrowType: "run", startX: 620, startY: 300, endX: 560, endY: 280, label: "Jockey" }
      ]
    },
    visibility: "private",
    creatorName: "Demo Coach",
    createdAt: "2026-11-09T08:30:00Z",
    updatedAt: "2026-11-09T08:30:00Z"
  },
  {
    id: "ex-5",
    title: "Cut-back Cross & Box Finishing Circuit",
    description: "Realistic final-third attacking drill working on wide wing delivery, central box runs, cut-backs, and composed finishing under pressure.",
    theme: "Shooting & Finishing",
    ageGroups: ["U13–U15", "U16–U19", "Senior"],
    durationMinutes: 20,
    playerCount: { min: 10, max: 14 },
    equipment: ["Full goal with net", "Balls", "Mannequins", "Bibs"],
    playingArea: "Penalty box and wide attacking zones",
    setup: "Use the penalty area up to 35 meters out. Position a feeder in midfield, a winger wide, two strikers on the edge of the area, and a goalkeeper in goal.",
    instructions: [
      "Midfield feeder plays into the winger who dribbles down the wing line.",
      "Near-post striker makes a curved run towards the near post to drag a defender.",
      "Far-post striker holds up and cuts back into the penalty spot pocket.",
      "Winger delivers a low cut-back cross for a first-time strike on target."
    ],
    coachingPoints: [
      "Winger: Get head up before cross to locate runner timing.",
      "Strikers: Stagger runs so players do not occupy the same lane.",
      "Finishing technique: Composed side-foot strike through the ball, aiming low for the corners."
    ],
    progressions: [
      "Add a live recovery centre-back in the box to contest the cross."
    ],
    diagramDescription: "Half pitch showing wide wing run, two staggered striker runs into the box, and goalkeeper positioning.",
    diagram: {
      version: "1.0",
      pitchType: "half",
      viewBox: "0 0 1000 600",
      objects: [
        { id: "g1", type: "goal", x: 850, y: 300, orientation: "west", size: "standard" },
        { id: "gk", type: "goalkeeper", team: "teamB", x: 820, y: 300, label: "GK" },
        // Strikers
        { id: "s1", type: "player", team: "teamA", number: "9", x: 550, y: 240, label: "Near Post Run" },
        { id: "s2", type: "player", team: "teamA", number: "10", x: 520, y: 360, label: "Cut-back Run" },
        // Winger
        { id: "w1", type: "player", team: "teamA", number: "11", x: 450, y: 120, label: "Winger" },
        // Ball
        { id: "b1", type: "ball", x: 480, y: 130 },
        // Passes and runs
        { id: "a1", type: "arrow", arrowType: "dribble", startX: 490, startY: 130, endX: 720, endY: 160, label: "Drive to byline" },
        { id: "a2", type: "arrow", arrowType: "pass", startX: 720, startY: 165, endX: 660, endY: 330, label: "Cut-back pass" },
        { id: "a3", type: "arrow", arrowType: "run", startX: 550, startY: 240, endX: 720, endY: 270, label: "Near post decoy" },
        { id: "a4", type: "arrow", arrowType: "run", startX: 520, startY: 360, endX: 650, endY: 330, label: "Late box arrival" }
      ]
    },
    visibility: "club",
    creatorName: "Coach Marcus (Senior Academy)",
    createdAt: "2026-11-04T10:00:00Z",
    updatedAt: "2026-11-07T12:00:00Z"
  },
  {
    id: "ex-6",
    title: "Compact Defensive Block & Recovery Press",
    description: "Team tactical exercise coaching back 4 and midfield 2 to slide together, deny central space, and launch immediate counter-attacks.",
    theme: "Defending",
    ageGroups: ["U16–U19", "Senior"],
    durationMinutes: 25,
    playerCount: { min: 14, max: 18 },
    equipment: ["Full pitch markings", "Pinnies", "Cones", "Balls"],
    playingArea: "Two-thirds pitch",
    setup: "Two-thirds of pitch. Defending team sets up in a 4-2-0 block against an attacking team in a 3-4-2 shape.",
    instructions: [
      "Attacking team circulates ball trying to find pockets between lines.",
      "Defending unit shifts in unison, locking play to one sideline.",
      "On a loose touch or backward pass, trigger the collective pressing trap.",
      "When ball is won, defending team must score in mini-goals within 8 seconds."
    ],
    coachingPoints: [
      "Distances between lines: keep compact (maximum 12-15 meters between defensive and midfield lines).",
      "Body shape forcing play outside into pressing traps.",
      "Communication from goalkeeper and centre-backs pushing the line up.",
      "Immediate positive transition pass upon ball recovery."
    ],
    progressions: [
      "Add full pitch counter-attack to an opposing standard goal with goalkeeper."
    ],
    diagramDescription: "Defensive 4-2 block shifting towards left touchline as attacking team attempts wide progression.",
    diagram: {
      version: "1.0",
      pitchType: "half",
      viewBox: "0 0 1000 600",
      objects: [
        { id: "g1", type: "goal", x: 150, y: 300, orientation: "east", size: "standard" },
        { id: "gk", type: "goalkeeper", team: "teamB", x: 180, y: 300, label: "GK" },
        // Back 4 (Red)
        { id: "d1", type: "player", team: "teamB", number: "2", x: 320, y: 150, label: "RB" },
        { id: "d2", type: "player", team: "teamB", number: "4", x: 300, y: 250, label: "CB" },
        { id: "d3", type: "player", team: "teamB", number: "5", x: 290, y: 350, label: "CB" },
        { id: "d4", type: "player", team: "teamB", number: "3", x: 310, y: 470, label: "LB" },
        // Midfield 2 (Red)
        { id: "m1", type: "player", team: "teamB", number: "6", x: 440, y: 230, label: "DM" },
        { id: "m2", type: "player", team: "teamB", number: "8", x: 430, y: 370, label: "CM" },
        // Attackers (Blue)
        { id: "a1", type: "player", team: "teamA", number: "7", x: 580, y: 140, label: "RW" },
        { id: "a2", type: "player", team: "teamA", number: "9", x: 480, y: 290, label: "ST" },
        { id: "a3", type: "player", team: "teamA", number: "10", x: 620, y: 300, label: "AM" },
        // Ball
        { id: "b1", type: "ball", x: 600, y: 150 },
        // Press arrow
        { id: "arr1", type: "arrow", arrowType: "run", startX: 440, startY: 230, endX: 520, endY: 170, label: "Lock wide" }
      ]
    },
    visibility: "club",
    creatorName: "Coach Sarah (Youth Coordinator)",
    createdAt: "2026-11-05T13:00:00Z",
    updatedAt: "2026-11-08T09:00:00Z"
  },
  {
    id: "ex-7",
    title: "3v2 Continuous Overload Counter-Attack",
    description: "Fast wave transition game developing ruthless counter-attacking speed, numerical superiority exploitation, and rapid defensive recovery.",
    theme: "Transition",
    ageGroups: ["U13–U15", "U16–U19"],
    durationMinutes: 20,
    playerCount: { min: 10, max: 14 },
    equipment: ["2 Standard Goals", "Balls", "Pinnies"],
    playingArea: "Penalty box to penalty box (50m x 40m)",
    setup: "Two goals with keepers at opposite ends. 3 attackers attack 2 defenders. Once the play finishes, 2 new attackers enter from the opposite baseline.",
    instructions: [
      "Team of 3 attacks with pace to score within 12 seconds.",
      "The 2 defenders delay and protect the central goal.",
      "Whichever attacker takes the shot or loses the ball must immediately sprint back to defend.",
      "Opposite team releases 3 new players to counter in a new 3v2 wave."
    ],
    coachingPoints: [
      "Drive fast at the defender to force them to commit.",
      "Wide runners make diagonal crossing runs to confuse defensive tracking.",
      "Shoot early if the defender drops off too deep."
    ],
    progressions: [
      "Reduce shot clock to 8 seconds to promote direct vertical play."
    ],
    diagramDescription: "Wave transition with three attackers bearing down on two defenders with goalkeeper in goal.",
    diagram: {
      version: "1.0",
      pitchType: "half",
      viewBox: "0 0 1000 600",
      objects: [
        { id: "g1", type: "goal", x: 880, y: 300, orientation: "west", size: "standard" },
        { id: "gk", type: "goalkeeper", team: "teamB", x: 840, y: 300, label: "GK" },
        // 2 Defenders (Red)
        { id: "d1", type: "player", team: "teamB", number: "4", x: 620, y: 220, label: "Cover" },
        { id: "d2", type: "player", team: "teamB", number: "5", x: 590, y: 360, label: "Pressure" },
        // 3 Attackers (Blue)
        { id: "a1", type: "player", team: "teamA", number: "7", x: 380, y: 150, label: "Wide Runner" },
        { id: "a2", type: "player", team: "teamA", number: "9", x: 350, y: 300, label: "Ball Carrier" },
        { id: "a3", type: "player", team: "teamA", number: "11", x: 370, y: 460, label: "Overlapping Run" },
        // Ball
        { id: "b1", type: "ball", x: 390, y: 300 },
        // Movement
        { id: "arr1", type: "arrow", arrowType: "dribble", startX: 400, startY: 300, endX: 520, endY: 300, label: "Drive central" },
        { id: "arr2", type: "arrow", arrowType: "run", startX: 380, startY: 150, endX: 620, endY: 160, label: "Diagonal run" }
      ]
    },
    visibility: "private",
    creatorName: "Demo Coach",
    createdAt: "2026-11-09T10:00:00Z",
    updatedAt: "2026-11-09T10:00:00Z"
  }
];

export const SEED_SESSIONS: TrainingSession[] = [
  {
    id: "sess-1",
    title: "High-Tempo Passing, Combinations & Finishing",
    description: "Cohesive 75-minute training session structured to progress from tight-space rondos to functional wide delivery and clinical box finishes.",
    theme: "Attacking Combinations",
    ageGroup: "U14–U16",
    visibility: "club",
    creatorName: "Coach Marcus (Senior Academy)",
    items: [
      {
        id: "sitem-1",
        sourceExerciseId: "ex-1",
        sourceVisibility: "club",
        order: 1,
        plannedDurationMinutes: 15,
        sessionNotes: "Warm-up phase: focus on body shape, 2-touch rhythm, and energetic communication right from the start.",
        exerciseSnapshot: {
          id: "ex-1",
          title: "Rondo 4v2 with Quick Transitions",
          description: "High-tempo possession drill developing fast ball circulation, body shape, and immediate counter-pressing.",
          theme: "Warm-up",
          durationMinutes: 15,
          setup: "Set out a 10m x 10m grid with 4 orange cones.",
          instructions: [
            "Circulate the ball in 1 or 2 touches along perimeter.",
            "Defenders press in pairs."
          ],
          coachingPoints: [
            "Open body shape on back foot.",
            "Weight and accuracy of pass."
          ],
          diagram: SEED_EXERCISES[0].diagram,
          diagramDescription: SEED_EXERCISES[0].diagramDescription
        }
      },
      {
        id: "sitem-2",
        sourceExerciseId: "ex-2",
        sourceVisibility: "club",
        order: 2,
        plannedDurationMinutes: 20,
        sessionNotes: "Technical phase: emphasize timing of the 3rd man run. Ball should not wait for the runner.",
        exerciseSnapshot: {
          id: "ex-2",
          title: "Triangular Combination & 3rd Man Run",
          description: "Structured passing pattern to build rhythmic combinations and dynamic forward runs.",
          theme: "Passing & Receiving",
          durationMinutes: 20,
          setup: "Triangle with mannequin/cone stations 15m apart.",
          instructions: [
            "A passes into B who sets back to A.",
            "A plays into C's third-man run."
          ],
          coachingPoints: [
            "Check away before checking toward.",
            "Accurate set pass."
          ],
          diagram: SEED_EXERCISES[1].diagram,
          diagramDescription: SEED_EXERCISES[1].diagramDescription
        }
      },
      {
        id: "sitem-3",
        sourceExerciseId: "ex-5",
        sourceVisibility: "club",
        order: 3,
        plannedDurationMinutes: 25,
        sessionNotes: "Final phase: high concentration on near-post decoy run opening cut-back pocket.",
        exerciseSnapshot: {
          id: "ex-5",
          title: "Cut-back Cross & Box Finishing Circuit",
          description: "Realistic final-third attacking drill working on wide delivery, box runs, and composed finishing.",
          theme: "Shooting & Finishing",
          durationMinutes: 20,
          setup: "Penalty area up to 35m out with goalkeeper.",
          instructions: [
            "Winger drives down wide line.",
            "Near striker runs near post; far striker cuts back.",
            "Finish with first-time strike."
          ],
          coachingPoints: [
            "Head up before crossing.",
            "Staggered box runs."
          ],
          diagram: SEED_EXERCISES[4].diagram,
          diagramDescription: SEED_EXERCISES[4].diagramDescription
        }
      }
    ],
    createdAt: "2026-11-06T15:00:00Z",
    updatedAt: "2026-11-08T11:00:00Z"
  },
  {
    id: "sess-2",
    title: "Midfield Possession & Rapid Wave Counter-Attacks",
    description: "60-minute session combining positional overload retention with direct vertical transitions upon ball recovery.",
    theme: "Possession & Transition",
    ageGroup: "U15–U18",
    visibility: "private",
    creatorName: "Demo Coach",
    items: [
      {
        id: "sitem-201",
        sourceExerciseId: "ex-3",
        sourceVisibility: "club",
        order: 1,
        plannedDurationMinutes: 25,
        sessionNotes: "Demanding 4v4+3 drill. Reward teams that penetrate through the center neutral.",
        exerciseSnapshot: {
          id: "ex-3",
          title: "4v4 + 3 Neutrals Positional Possession",
          description: "Positional game reinforcing building through midfield with defensive pressing traps.",
          theme: "Possession",
          durationMinutes: 20,
          setup: "Rectangle 30m x 25m with two end neutrals and one center neutral.",
          instructions: [
            "Keep ball with 3 neutrals (7v4).",
            "Defenders press to win and transition."
          ],
          coachingPoints: [
            "Width and depth.",
            "Immediate counter-press on loss."
          ],
          diagram: SEED_EXERCISES[2].diagram,
          diagramDescription: SEED_EXERCISES[2].diagramDescription
        }
      },
      {
        id: "sitem-202",
        sourceExerciseId: "ex-7",
        sourceVisibility: "private",
        order: 2,
        plannedDurationMinutes: 25,
        sessionNotes: "Wave counter-attacks: enforce the 12-second shot clock to ensure game intensity.",
        exerciseSnapshot: {
          id: "ex-7",
          title: "3v2 Continuous Overload Counter-Attack",
          description: "Fast wave transition game developing counter-attacking speed and defensive delaying.",
          theme: "Transition",
          durationMinutes: 20,
          setup: "Two goals with keepers at opposite ends (50m x 40m).",
          instructions: [
            "3 attackers attack 2 defenders.",
            "Shooter recovers back to defend the next wave."
          ],
          coachingPoints: [
            "Drive fast at the defender.",
            "Shoot early if defender drops."
          ],
          diagram: SEED_EXERCISES[6].diagram,
          diagramDescription: SEED_EXERCISES[6].diagramDescription
        }
      }
    ],
    createdAt: "2026-11-09T09:00:00Z",
    updatedAt: "2026-11-09T09:00:00Z"
  }
];

export const SEED_PRINCIPLES: ClubPrinciplesData = {
  version: "1.0",
  updatedAt: "2026-11-10T12:00:00Z",
  sections: [
    {
      id: "sec-1",
      title: "Club Playing Identity",
      subtitle: "How our teams play across all age grades",
      content: [
        "We are proactive in and out of possession. We build play constructively from the back rather than kicking blindly under pressure.",
        "When in possession, we create width and depth to stretch opposition structures, seeking controlled vertical passes through defensive lines.",
        "Out of possession, our teams defend collectively as a compact unit. We prioritize aggressive counter-pressing within 3 seconds of losing the ball.",
        "We respect individual flair and bravery in 1v1 situations in the final third. Mistakes born from positive decision-making are embraced as part of development."
      ],
      callout: "Core club rule: Ball speed, unselfish movement, and positive body language define our style."
    },
    {
      id: "sec-2",
      title: "Coaching Philosophy & Session Standards",
      subtitle: "The methodology every club coach follows",
      content: [
        "Maximum ball contact: Minimize lines and queues. Design exercises where every player has frequent touches on the ball.",
        "Game-realistic context: Every drill should feature direction, opposition (passive or active), and a clear decision-making trigger.",
        "Questioning over lecturing: Use guided discovery ('What did you see before making that pass?') rather than constantly shouting commands from the sideline.",
        "Session Structure: Standard sessions follow a 4-part progression: 1) Dynamic activation / rondo, 2) Technical combination, 3) Positional game / functional practice, 4) Free match play."
      ],
      callout: "Coaching guideline: Limit coach interruptions to 45 seconds or less to maintain session flow and player heart rates."
    },
    {
      id: "sec-3",
      title: "Coach Conduct & Cultural Values",
      subtitle: "Our expectations on and off the training pitch",
      content: [
        "Punctuality: Arrive at least 20 minutes prior to scheduled pitch time. Setup must be complete before players arrive.",
        "Safety & Welfare: Inspect playing surfaces, secure goal frames, and ensure player hydration and proper equipment.",
        "Respect: Demonstrate calm, constructive leadership. Referees, parents, and opponents must always be treated with dignity.",
        "Sharing Knowledge: Coaches are encouraged to share well-tested exercises to the Club Library so all squads benefit from good ideas."
      ],
      callout: "Remember: We develop people first, athletes second, and football players third."
    }
  ]
};
