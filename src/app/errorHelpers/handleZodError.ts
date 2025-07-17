/* eslint-disable @typescript-eslint/no-explicit-any */
import { IErrorResponse, IErrorSources } from "../interfaces/errorTypes";

export const handleZodError = (err: any): IErrorResponse => {
     const errorSources:IErrorSources[]=[]
     err.issues.forEach((issue: any) => {
       errorSources.push({
         //   path: issue.path.slice().reverse().join(" inside "),
         path: issue.path[issue.path.length - 1],
         message: issue.message,
       });
     });
    return {
        statusCode: 400,
        message : "Zod Error",
        errorSources
    }
}