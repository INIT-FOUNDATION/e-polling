import express, {  Request, Response, Express, NextFunction } from 'express';
import bodyParser from 'body-parser';
import * as CONSTANT from '../constants/CONST';
import { adminRouter, authRouter } from '../routes';

export default function (app: Express): void {
  app.use(express.json());

  // Enabling CORS
  app.use(function (req: Request, res: Response, next: NextFunction): void {
    if (req.body) {
      const riskyChars = ['=', '-', '@', '|'];
      for (const key in req.body) {
        if (req.body && req.body[key] && typeof req.body[key] === 'string') {
          if (riskyChars.indexOf(req.body[key].charAt(0)) >= 0) {
            req.body[key] = req.body[key].slice(1);
          }
          req.body[key] = req.body[key].replace(/{|}|>|<|=/g, '');
        }
      }
    }

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Server', '');
    res.header('Access-Control-Allow-Headers', CONSTANT.allowed_headers);
    next();
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/auth/admin', adminRouter);
}
