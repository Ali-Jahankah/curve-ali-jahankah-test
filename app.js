const express = require('express'); // app.js
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4001;
const routes = require('./routes/index');
const { rootRoute } = require('./constants/routes');
app.get(rootRoute.url, require('./routes/index'));

app.listen(PORT, () => {
  console.log(`server running at on port ==> ${PORT}`);
});
module.exports = app;
