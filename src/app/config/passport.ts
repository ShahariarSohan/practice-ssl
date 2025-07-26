
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";

import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";


passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
          return done(null, false, { message: "User doesn't exist" });
        }
        if (!isUserExist.isVerified) {
        return  done(null, false, { message: "User is not Verified" });
        }
        if (
          isUserExist.isActive === IsActive.BLOCKED ||
          isUserExist.isActive === IsActive.INACTIVE
        ) {
          return done(null,false,{message:`User is ${isUserExist.isActive}`});
        }
        if (isUserExist.isDeleted) {
        return done(null, false, { message: "User is deleted" });
        }
        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObject) => providerObject.provider === "google"
        );
        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(
            "You are already google logged in so if you want to login with email and password ,at first you have to login with google and then set a password then you can login with email and password"
          );
        }
        const isPasswordMatched = await bcrypt.compare(
          password as string,
          isUserExist?.password as string
        );
        if (!isPasswordMatched) {
          return done(null, false, { message: "Password doesn't match " });
        }
        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No email found" });
        }
        let isUserExist = await User.findOne({ email });
         
         if (isUserExist&&!isUserExist.isVerified) {
           return done(null, false, { message: "User is not Verified" });
         }
         if (isUserExist&&
           (isUserExist.isActive === IsActive.BLOCKED ||
           isUserExist.isActive === IsActive.INACTIVE)
         ) {
           return done(null, false, {
             message: `User is ${isUserExist.isActive}`,
           });
         }
         if (isUserExist&&isUserExist.isDeleted) {
           return done(null, false, { message: "User is deleted" });
         }
        if (!isUserExist) {
          isUserExist = await User.create({
            email: email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, isUserExist);
      } catch (error) {
        console.log("google strategy error", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
