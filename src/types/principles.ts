export interface PrincipleSection {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  callout?: string;
}

export interface ClubPrinciplesData {
  version: "1.0";
  updatedAt: string;
  sections: PrincipleSection[];
}
