export interface Column {
  id: string;
  title: string;
  order: number;
  created_at: string;
}

export interface Card {
  id: string;
  column_id: string;
  title: string;
  description?: string;
  due_date: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateColumnDto {
  title: string;
  order: number;
}

export interface UpdateColumnDto {
  title?: string;
  order?: number;
}

export interface CreateCardDto {
  column_id: string;
  title: string;
  description?: string;
  due_date?: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateCardDto {
  column_id?: string;
  title?: string;
  description?: string;
  due_date?: string | null;
  order?: number;
  updated_at?: string;
}
