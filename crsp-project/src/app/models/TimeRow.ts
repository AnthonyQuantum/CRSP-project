// Model for a single row on schedule page (time, task)
export class TimeRow {
    title: string;
    task: any;
    sleep: number;
  
    constructor(title: string, task: any, sleep: number) {
      this.title = title;
      this.task = task;
      this.sleep = sleep;
    }
  }