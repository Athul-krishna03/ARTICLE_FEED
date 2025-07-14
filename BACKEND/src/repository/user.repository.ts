

import { BaseRepository } from "./base.respository";
import { IUserRepository } from "../interfaces/repositoryInterfaces/IUserRepository";
import { UserModel, UserDocument } from "../models/user.model";
import { User } from "../entities/user.entity";

function toUser(doc: UserDocument): User {
  return {
    _id: doc._id.toString(),
    firstName: doc.firstName,
    lastName: doc.lastName,
    phone: doc.phone,
    email: doc.email,
    dob: doc.dob,
    password: doc.password,
    preferences: doc.preferences,
    refreshToken: doc.refreshToken ?? undefined,
  };
}

export class UserRepository extends BaseRepository<User, UserDocument> implements IUserRepository {
  constructor() {
    super(UserModel, toUser);
  }

  async findByEmailOrPhone(identifier: string): Promise<User | null> {
    const doc = await this.model.findOne({ email: identifier }).lean<UserDocument>();
    return doc ? toUser(doc as UserDocument) : null;
  }
}
