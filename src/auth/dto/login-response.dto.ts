export class LoginResponseDto {
  access_token: string;
  expires_in: number;

  constructor({ accessToken, expiresIn }) {
    this.access_token = accessToken;
    this.expires_in = expiresIn;
  }
}
