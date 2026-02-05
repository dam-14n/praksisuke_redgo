import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

const validate =
  (schema: ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        type: req.query.type,
      });
      next();
    } catch (error: any) {
      res.status(400);
      if (error instanceof ZodError) {
        console.log(`Zod validation error: ${error.message.toString()}`);
        res.send(`Badly formatted request: ${error.message}`);
      } else {
        console.log(`Unexpected validation error: ${error}`);
        res.send("Invalid request.");
      }
    }
  };

export default validate;
