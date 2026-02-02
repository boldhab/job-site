// Job model/DTO
export class Job {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.company = data.company;
    this.location = data.location;
    this.salary = data.salary;
    this.type = data.type;
    this.status = data.status;
    this.employerId = data.employerId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
