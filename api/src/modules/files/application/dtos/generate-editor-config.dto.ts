/**
 * File Manager - Generate Editor Config DTOs
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

export class GenerateEditorConfigDto {
  fileId: number;
  userId: number;
  userDepartmentName: string;
  userName: string;
  tenantId: string;
  token: string;

  constructor(params: {
    fileId: number;
    userId: number;
    userDepartmentName: string;
    userName: string;
    tenantId: string;
    token: string;
  }) {
    this.fileId = params.fileId;
    this.userId = params.userId;
    this.userDepartmentName = params.userDepartmentName;
    this.userName = params.userName;
    this.tenantId = params.tenantId;
    this.token = params.token;
  }
}

export interface DocumentConfig {
  key: string;
  fileType: string;
  title: string;
  url: string;
  permissions: {
    edit: boolean;
  };
}

export interface EditorUserConfig {
  id: string;
  name: string;
}

export interface EditorConfig {
  callbackUrl: string;
  user: EditorUserConfig;
}

export interface OnlyOfficeConfig {
  key: string;
  document: DocumentConfig;
  documentType: string;
  editorConfig: EditorConfig;
  token?: string;
}

export class GenerateEditorConfigResponseDto {
  token: string;
  config: OnlyOfficeConfig;

  constructor(params: { token: string; config: OnlyOfficeConfig }) {
    this.token = params.token;
    this.config = params.config;
  }
}