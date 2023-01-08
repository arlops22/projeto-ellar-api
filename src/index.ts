import express from "express";
import cors from "cors";
import routes from "./routes";

import './database';

const app = express();


app.use(express.json());
app.use(cors());
app.use('/api', routes);
 
app.listen(8000, () => console.log('App listened in PORT 8000!'));