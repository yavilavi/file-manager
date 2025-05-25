/**
 * File Manager - Department.Exceptions
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
export class DepartmentNotFoundException extends Error {
  constructor(id?: number) {
    super(id ? `Department with ID ${id} not found` : 'Department not found');
    this.name = 'DepartmentNotFoundException';
  }
}

export class DepartmentNameAlreadyExistsException extends Error {
  constructor(name: string) {
    super(`A department with name "${name}" already exists`);
    this.name = 'DepartmentNameAlreadyExistsException';
  }
}

export class DepartmentCannotBeDeletedException extends Error {
  constructor(reason: string) {
    super(`Department cannot be deleted: ${reason}`);
    this.name = 'DepartmentCannotBeDeletedException';
  }
}

export class InvalidDepartmentDataException extends Error {
  constructor(field: string, reason: string) {
    super(`Invalid department ${field}: ${reason}`);
    this.name = 'InvalidDepartmentDataException';
  }
}
