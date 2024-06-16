const express = require('express'); // app.js
const app = express();
const PORT = process.env.PORT || 4001;
const routes = require('./routes/index');
const { rootRoute } = require('./constants/routes');
// Define a route for the root URL
app.get(rootRoute.url, require('./routes/index'));

// Start the server
app.listen(PORT, () => {
  console.log(`Express app listening at http://localhost:${PORT}`);
});
