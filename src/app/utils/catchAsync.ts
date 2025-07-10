import { NextFunction, Request, Response } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

// here catchAsync  takes a function(as an argument) which is like  try block of createUser function but returns a function  like try ,catch createUser function.

const catchAsync =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    // fn(req, res, next) means calling the async (req, res, next) => { ... } function you received as an argument of catchAsync.
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.log(error);
      next(error);
    });
  };

export default catchAsync;