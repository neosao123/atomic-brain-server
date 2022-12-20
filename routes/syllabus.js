const router = require("express").Router();

const syllabusController = require("../controllers/syllabusController");

router.post("/create", syllabusController.create);
router.get("/list", syllabusController.list);
router.get("/:id", syllabusController.edit);
router.put("/update/:id", syllabusController.update);
router.delete("/remove/:id", syllabusController.remove);

module.exports = router;
