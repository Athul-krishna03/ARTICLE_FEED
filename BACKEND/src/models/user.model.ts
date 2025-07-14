import mongoose ,{Schema, Types}from 'mongoose'

export interface UserDocument extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    dob: Date;
    password: string;
    preferences: Types.ObjectId[]; 
    refreshToken?: string;
}
const userSchema = new Schema<UserDocument>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    password: { type: String, required: true },
    preferences: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    refreshToken: {
        type: String,
        default:""
    }
},
{
    timestamps: true,
}
);


export const UserModel = mongoose.model('User',userSchema)