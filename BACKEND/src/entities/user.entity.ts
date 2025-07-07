import Schema from "mongoose";

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    dob: Date;
    password: string;
    preferences: Schema.Types.ObjectId[];
    refreshToken?:string;
}