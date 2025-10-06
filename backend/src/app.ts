

const express = require('express');
const app = express();
app.get('/', (_req: any, res: any) => {
    res.send('BACKEND BABY!!!!!!!');
});

module.exports = app;
