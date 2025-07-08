import mongoose ,{Schema}from 'mongoose'

const userSchema = new Schema({
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