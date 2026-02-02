// Employer model/DTO
export class Employer {
  constructor(data) {
    this.id = data.id;
    this.companyName = data.companyName;
    this.companyDescription = data.companyDescription;
    this.website = data.website;
    this.industry = data.industry;
    this.verificationStatus = data.verificationStatus;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
