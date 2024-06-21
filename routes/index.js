const { Router } = require('express');
const { rootRoute } = require('../constants');
const router = Router();

router.get(rootRoute.url, (req, res) => {
  res.send(rootRoute.message);
});
module.exports = router;
