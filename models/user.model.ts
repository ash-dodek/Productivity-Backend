import mongoose, { Document, InferSchemaType, model, Schema } from "mongoose"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    settings: {
        timeFormat: {
            type: String,
            enum: ["24h", "12h"],
            default: "12h"
        }
    },
}, { timestamps: true })

type userType = InferSchemaType<typeof UserSchema>

interface IUserWithMethods extends userType {
    generateRefreshToken(): string | null;
}

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 9)
    return next()
})

UserSchema.methods.generateRefreshToken = async function() {
    try{
        return await jwt.sign(
            {
                userId: this._id.toString(),
            },
            process.env.JWT_SECRET_RF!
        )
        
    }catch(error){
        console.error(error)
    }
}




export const UserModel = model<IUserWithMethods>("User", UserSchema)