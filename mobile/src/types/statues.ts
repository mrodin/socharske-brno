export type Statue = {
  id: number;
  created_at: string;
  name: string;
  lng: number;
  lat: number;
  visible: boolean;
  description: string | null;
  material: string | null;
  type: string | null;
  category: string | null;
  author: string | null;
  year: string | null;
  place: string | null;
  wiki_url: string | null;
  image_url: string | null;
  score: number;
};

export type StatueWithDistance = Statue & {
  distance?: number;
  isCollected: boolean;
};

export type CollectedStatue = {
  statue_id: number;
  created_at: string;
  value: number;
};
