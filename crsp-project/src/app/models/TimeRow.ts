// Model for a single row on schedule page (time, task)
export class TimeRow {
    title: string;
    task: any;
  
    constructor(title: string, task: any) {
      this.title = title;
      this.task = task;
    }
  }