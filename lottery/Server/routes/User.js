import express from "express";

import * as controller from "../controller/User.js";

const router = express.Router();

router.post("/sign-up", controller.createUser);
router.post("/login",controller.loginUser); 
router.get("/", controller.getUsers);
router.get("/:id", controller.getUser);
router.delete("/:id", controller.deleteUser);
router.put("/:id", controller.updateUser);

export default router;