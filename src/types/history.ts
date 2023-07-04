export interface HistoryRecord {
  name: string;
  context: any;
  reverse: () => void;
  obverse: () => void;
}
