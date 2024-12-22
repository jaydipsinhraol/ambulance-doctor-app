export interface RecordType {
  id?: number;
  title: string;
  description: string;
  location: string;
  image?: string; // Optional
}

export interface PaginatedResponse<T> {
  total: number;
  data: T[];
}