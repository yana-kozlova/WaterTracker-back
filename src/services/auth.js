import UsersCollection from "../db/models/User.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import {randomBytes} from "crypto";
import SessionCollection from "../db/models/Session.js";
import { accessTokenLifetime, refreshTokenLifetime } from "../constants/users.js";


const createSession = ()=>{
    const accessToken = randomBytes(30).toString("base64");
    const refreshToken = randomBytes(30).toString("base64");
    return{
        accessToken,
        refreshToken,
        accessTokenValidUntil: Date.now() + accessTokenLifetime,
        refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
    };
};
export const register = async(payload) =>{
    const {email, password} = payload;
    const user = await UsersCollection.findOne({email});
    if(user){
      throw createHttpError(409, "Email already used");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = UsersCollection.create({...payload, password: hashPassword} );
    return newUser;
};

export const login = async({email, password}) =>{
    const user = await UsersCollection.findOne({email});

    if(!user){
        throw createHttpError(401, "Email or password is invalid");
    }

    const passwordCompare = bcrypt.compare(password, user.password);
    if(!passwordCompare){
        throw createHttpError(401, "Email or password is invalid");
    }

    await SessionCollection.deleteOne({userId: user._id});

    const newSession = createSession();

    return SessionCollection.create({
        userId: user._id,
        ...newSession,
    });
};

export const logout = async(sessionId) =>{
    await SessionCollection.deleteOne({_id: sessionId});
};

export const refreshUserSession = async({sessionId, refreshToken})=>{
    const session = await SessionCollection.findOne({_id: sessionId, refreshToken});
    if(!session){
        throw createHttpError(401, "Session not found");
    }
    if(Date.now() > session.refreshTokenValidUntil){
        throw createHttpError(401, "Session token expired");
    }
    await SessionCollection.deleteOne({userId: session.userId});

    const newSession = createSession();

    return SessionCollection.create({
        userId: session.userId,
        ...newSession,
    });
};
export const findSession = filter => SessionCollection.findOne(filter);

export const findUser = filter => UsersCollection.findOne(filter);
