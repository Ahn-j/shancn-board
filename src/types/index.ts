export interface Todo {
  id: number;
  title: string;
  start_date: string | Date;
  end_date: string | Date;
  contents: BoardContent[];
}

export interface BoardContent {
  boardId: string | number;
  inCompleted: boolean;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  content: string;
}
