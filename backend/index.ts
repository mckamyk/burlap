import express from 'express'
import morgan from 'morgan'
import { appRouter, createContext } from './trpc';
import * as trpcExpress from "@trpc/server/adapters/express"
import cors from 'cors'

const app = express();
app.use(morgan('common'));
app.use(cors())

app.use('/trpc', trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext
}))

app.listen(4000, () => console.log("Backend listening on 4000"))

