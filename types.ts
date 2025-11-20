export interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  themeColor: string;
  votes: number;
  imageUrl: string;
}

export interface NewGroupResponse {
  name: string;
  description: string;
  themeColor: string;
  members: string[];
}

export interface CheerResponse {
  cheer: string;
}
