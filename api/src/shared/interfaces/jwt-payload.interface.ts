/**
 * File Manager - JWT Payload Interface
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */

export interface JwtPayloadInterface {
  aud: string;
  sub: number;
  iss: string;
}
