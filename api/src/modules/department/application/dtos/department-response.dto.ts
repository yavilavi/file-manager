/**
 * File Manager - department-response.dto DTO
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
export class DepartmentResponseDto {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(id: number, name: string, createdAt: Date, updatedAt?: Date) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDomain(department: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt?: Date;
  }): DepartmentResponseDto {
    return new DepartmentResponseDto(
      department.id,
      department.name,
      department.createdAt,
      department.updatedAt,
    );
  }
}
