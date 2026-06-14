export interface LoginDto {
  email: string;
  password?: string;
}

export interface RegisterDto {
  email: string;
  password?: string;
  fullName?: string;
  username?: string;
  codingExperience?: string;
  dateOfBirth?: string;
}
