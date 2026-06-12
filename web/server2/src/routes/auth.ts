import { Router } from 'express';

export const router = Router();

const SCOPES = ["email"]

router.get("/:name", (req, resp) => {
  console.log("received", req.params.name)
  resp.json({ message: `hello ${req.params.name}`})
})
