export interface MovieResponse {
  _id: string;
  name: string;
  description: string;
  is_thumbnail: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MovieImage {
  imageUrl: string;
  isThumbnail: boolean;
  isBanner: boolean;
}
