import express, { Request, Response, Express, NextFunction } from 'express';
import * as CONSTANT from '../constants/CONST';
import { adminRouter } from '../routes/adminRouter';
import { rolesRouter } from '../routes/rolesRouter';
import { passwordPolicyRouter } from '../routes/passwordPolicyRouter';
import { usersRouter } from '../routes/usersRouter';
import { categoriesRouter } from '../routes/categoriesRouter';
import { menusRouter } from '../routes/menusRouter'
;
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

  app.use("/api/v1/admin/roles", rolesRouter);
  app.use("/api/v1/admin/passwordPolicies", passwordPolicyRouter);
  app.use("/api/v1/admin/users", usersRouter);
  app.use("/api/v1/admin/categories", categoriesRouter);
  app.use("/api/v1/admin/menus", menusRouter);
  app.use('/api/v1/admin', adminRouter);
}
