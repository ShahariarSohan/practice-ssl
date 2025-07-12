import  bcrypt  from 'bcryptjs';
import { envVars } from "../config/env"
import { User } from "../modules/user/user.model"
import { IAuthProvider, IUser, Role } from '../modules/user/user.interface';

export const seedSuperAdmin = async () => {
    try { 
        const isSuperAdmin = await User.find({ email: envVars.SUPER_ADMIN_EMAIL })
        if (isSuperAdmin) {
            console.log("super admin already exist")
            return
        }
        console.log("Trying to create super admin ....")
        const hashPassword = await bcrypt.hash(
          envVars.SUPER_ADMIN_PASSWORD,
          Number(envVars.BCRYPT_SALT_ROUND)
        );
        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId:envVars.SUPER_ADMIN_EMAIL
        }
        const payload: IUser = {
            name: "Super",
            email: envVars.SUPER_ADMIN_EMAIL,
            role: Role.SUPER_ADMIN,
            password: hashPassword,
            isVerified: true,
            auths:[authProvider]
            
        }
        const superAdmin=await User.create(payload)
        console.log("super admin successfully created",superAdmin)
    }
    catch (error) {
        console.log(error)
    }
}