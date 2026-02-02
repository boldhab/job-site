// Application model/DTO
export class Application {
  constructor(data) {
    this.id = data.id;
    this.jobId = data.jobId;
    this.jobSeekerId = data.jobSeekerId;
    this.status = data.status;
    this.coverLetter = data.coverLetter;
    this.cvId = data.cvId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
