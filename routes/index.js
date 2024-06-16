const { Router } = require('express');
const { rootRoute } = require('../constants/routes');
const router = Router();

router.get(rootRoute.url, (req, res) => {
  res.send(rootRoute.message);
});
module.exports = router;
