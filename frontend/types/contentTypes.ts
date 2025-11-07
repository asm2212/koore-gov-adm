export interface BaseItem {
  id: number;
  createdAt: string;
  images?: { url: string; publicId?: string }[];
}

export interface NewsItem extends BaseItem {
  type: "news";
  title: string;
  content: string;
  category?: string;
  language?: string;
}

export interface TourismItem extends BaseItem {
  type: "tourism";
  name: string;
  description: string;
  location: string;
  language: string;
}

export type FormType = "news" | "tourism";