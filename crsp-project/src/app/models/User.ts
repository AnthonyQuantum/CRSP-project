export class User {
    name: string;
    password: string;
    email: string;
    wakeUpTime: string;
    goToBedTime: string;
    tasks: {};
  
    constructor(name: string, password: string, email: string)
    {
      this.name = name;
      this.password = password;
      this.email = email;
      this.wakeUpTime = "6am";
      this.goToBedTime = "10pm";
      this.tasks = {};
    }
  }