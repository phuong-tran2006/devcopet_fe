export interface LoginDto {
  email: string;
  password?: string;
}

export interface RegisterDto {
  email: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  username: string;
  dateOfBirth?: string;
  experienceLevel?: string;
  termsAccepted?: boolean;
}
