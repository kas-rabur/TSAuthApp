import mongoose, { Schema, Document, Model } from "mongoose";

interface Authentication {
  passwordHash: string;
  salt: string;
  sessionToken?: string;
}

export interface UserDocument extends Document {
  username: string;
  email: string;
  authentication: Authentication;
}

const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  authentication: {
    passwordHash: { type: String, required: true, select: false },
    salt: { type: String, required: true, select: false },
    sessionToken: { type: String, select: false },
  },
});

export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  userSchema
);

// Queries
export const getUsers = () => UserModel.find();

export const getUserByEmail = (email: string) =>
  UserModel.findOne({ email });

export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });

export const getUserByID = (id: string) =>
  UserModel.findById(id);

// Mutations
export const createUser = (values: Partial<UserDocument>) =>
  new UserModel(values).save().then((user) => user.toObject());

export const deleteUserByID = (id: string) =>
  UserModel.findByIdAndDelete(id);

export const updateUserByID = (id: string, values: Partial<UserDocument>) =>
  UserModel.findByIdAndUpdate(id, values, { new: true });
