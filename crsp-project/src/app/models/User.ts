// Model for a user
export class User {
    name: string;
    password: string;
    email: string;
    wakeUpTime: number;
    goToBedTime: number;
    tasks: Array<Object>;
  
    constructor(name: string, password: string, email: string)
    {
      this.name = name;
      this.password = password;
      this.email = email;
      this.wakeUpTime = 6;
      this.goToBedTime = 10.5;
      this.tasks = [];
    }
  }