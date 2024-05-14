export interface UserMethods {
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface User extends UserMethods {
  _id: string | null;
  name: string;
  userName: string;
  email: string;
  password: string | null;
  refreshToken: string | null;
}
