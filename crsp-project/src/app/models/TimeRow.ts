// Model for a single row on schedule page (time, task)
export class TimeRow {
    title: string;
    task1: any;
    task2: any;
    sleep: number;
  
    constructor(title: string) {
      this.sleep = null;
      this.title = title;
      this.task1 = null;
      this.task2 = null;
    }
  }