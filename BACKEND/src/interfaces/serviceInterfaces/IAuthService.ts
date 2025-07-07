import { User } from "../../entities/user.entity";

export interface IAuthService {
  register(user: User): Promise<User>;
  login(
    email: string,
    password: string
  ): Promise<{ user: User; access_token: string ,refresh_token:string} | null>;
  updateProfile(id: string, updates: Partial<User>): Promise<User | null>;
  refreshTokenVerify(refresh:string,access:string):Promise<{newAccessToken:string,newRefreshToken:string}>
}
