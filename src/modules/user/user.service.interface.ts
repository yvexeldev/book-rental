export interface IUserService {
  signUp(): Promise<{
    message: string;
    userId: number;
  }>;
}
