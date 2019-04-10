import express from 'express';
import path from 'path';
import cors from 'cors';
import indexRoute from './api';
import uploadRoute from './api/upload';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoute);
app.use('/upload', uploadRoute);

export default app;
