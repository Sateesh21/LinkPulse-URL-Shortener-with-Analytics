const express = require("express");
const { shortenURL, redirectURL, getAllURLs, deactivateURL } = require("../controllers/urls.controllers");
const authMiddleware = require("../middleware/auth.middleware");

const urlRouter = express.Router();

urlRouter.post('/shortenurl', authMiddleware, shortenURL);
urlRouter.get('/redirecturl/:shortCode',  redirectURL);
urlRouter.get('/getallurls', authMiddleware, getAllURLs);
urlRouter.put('/deactivateurl/:id', authMiddleware, deactivateURL);

module.exports = urlRouter;