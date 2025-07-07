import { User } from "../entities/user.entity";
import { IUserRepository } from "../interfaces/repositoryInterfaces/IUserRepository";
import { UserModel } from "../models/user.model";

function mapUser(doc: any | null): User | null {
  if (!doc) {
    return null;
  } else {
    return {
      _id: doc._id.toString(),
      firstName: doc.firstName,
      lastName: doc.lastName,
      phone: doc.phone,
      email: doc.email,
      dob: doc.dob,
      password: doc.password,
      preferences: doc.preferences,
      refreshToken:doc.refreshToken
    };
  }
}

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const newUser = await UserModel.create(user);
    const userObj = newUser.toObject();
    return { 
      ...userObj, 
      _id: userObj._id.toString(),
      refreshToken: userObj.refreshToken === null ? undefined : userObj.refreshToken
    };
  }
  async findByEmailOrPhone(identifier: string): Promise<User | null> {
    const userData = await UserModel
      .findOne({email: identifier})
      .lean();
    return mapUser(userData);
  }
  async findBy(id: string): Promise<User | null> {
    const userData =await UserModel.findById({_id:id}).lean();
    return mapUser(userData);
  }
  async update(id: string, user: Partial<User>): Promise<User | null> {
    const userData = await UserModel
      .findByIdAndUpdate(id, user, { new: true })
      .lean();
    return mapUser(userData);
  }
}
