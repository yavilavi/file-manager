/**
 * File Manager - OnlyOffice Callback DTOs
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class OnlyOfficeCallbackDto {
  @IsNotEmpty()
  @IsNumber()
  status: number;

  @IsString()
  @IsOptional()
  url: string;

  @IsNotEmpty()
  @IsString()
  key: string;

  @IsOptional()
  users: string;

  @IsNotEmpty()
  actions: string;
}

export class OnlyOfficeCallbackResponseDto {
  error: number;

  constructor(error: number) {
    this.error = error;
  }

  toJSON(): string {
    return JSON.stringify({ error: this.error });
  }
}

export enum OnlyOfficeCallbackStatus {
  BEING_EDITED = 0, // Document is being edited
  READY_FOR_SAVING = 1, // Document is ready for saving
  SAVE_ERROR = 2, // Error saving document
  CLOSED_NO_CHANGES = 3, // Document is closed with no changes
  SAVED_WHILE_EDITING = 4, // Document is being edited, but current state is saved
  SAVED_BY_TIMEOUT = 6, // Document is being edited, but current state is saved by timeout
  EDITING_ERROR = 7, // Document editing error has occurred
}
