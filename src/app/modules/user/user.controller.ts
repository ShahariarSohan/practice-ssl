
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";
const createUser = async (req: Request, res: Response) => {
  try {
    
    const user=await userServices.createUser(req.body)
      res.status(httpStatus.CREATED).json({
          message: "User created Successfully",
          user
      })
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({
      message: `Something Went Wrong ${error}`,
      error,
    });
  }
};

export const userControllers = {
    createUser
}