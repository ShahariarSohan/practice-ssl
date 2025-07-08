import express, { Request, Response } from "express"

const app = express()

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message:"This is a Tour Management System"
    })
})

export default app;