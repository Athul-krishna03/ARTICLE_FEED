import { inject, injectable } from "tsyringe";
import { User } from "../entities/user.entity";
import { IUserRepository } from "../interfaces/repositoryInterfaces/IUserRepository";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import {
  createAccessToken,
  createRefreshToken,
  CustomJwtPayload,
  verifyRefreshToken,
} from "../utils/jwt.service";
import { IAuthService } from "../interfaces/serviceInterfaces/IAuthService";
import { ERROR_MESSAGES } from "../constants/messages";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async register(user: User): Promise<User> {
    user.password = await hashPassword(user.password);
    const existingUser = await this.userRepository.findByEmailOrPhone(
      user.email
    );
    if (existingUser) {
      throw new Error("already exists with this email or phone number");
    }
    return this.userRepository.create(user);
  }

  async login(
    email: string,
    password: string
  ): Promise<{
    user: User;
    access_token: string;
    refresh_token: string;
  } | null> {
    const user = await this.userRepository.findByEmailOrPhone(email);
    if (!user || !(await comparePassword(password, user.password))) {
      return null;
    }
    const access_token = createAccessToken({ id: user._id, email: user.email });
    const refresh_token = createRefreshToken({
      id: user._id,
      email: user.email,
    });
    await this.userRepository.update(user._id, { refreshToken: refresh_token });
    return { user, access_token, refresh_token };
  }

  async updateProfile(
    id: string,
    updates: Partial<User>
  ): Promise<User | null> {
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }
    return this.userRepository.update(id, updates);
  }

  async refreshTokenVerify(
    refresh: string,
    access: string
  ): Promise<{ newAccessToken: string; newRefreshToken: string }> {
    const decoded: any = verifyRefreshToken(refresh);
    const user = await this.userRepository.findBy(decoded.id);
    console.log("user Data",user,"refresh",refresh);
    

    if (!user || user.refreshToken !== refresh) {
      throw new Error(
        ERROR_MESSAGES.TOKEN_INVALID_REUSED
      );
    }

    const payload: CustomJwtPayload = {
      id: user._id,
      email: user.email,
    };

    const newAccessToken = createAccessToken(payload);

    const newRefreshToken = createRefreshToken(payload);

    user.refreshToken = newRefreshToken;
    await this.userRepository.update(user._id, {
      refreshToken: newRefreshToken,
    });

    return { newAccessToken, newRefreshToken };
  }
}
