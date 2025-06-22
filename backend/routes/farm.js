const router = require("express").Router();
const {
  getAllFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm,
  getFarmsByLocation,
  getFarmsByCertification,
} = require("../controllers/farm.controller");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const multer = require("multer");
const storage = require("../middleware/saveFile");

const upload = multer({
  storage,
});

// Public routes - anyone can view farms
router.get("/", getAllFarms);
router.get("/:id", getFarmById);
router.get("/location/:location", getFarmsByLocation);
router.get("/certification/:certification", getFarmsByCertification);

// Admin only routes - require authentication and admin role
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  createFarm
);
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  updateFarm
);
router.delete("/:id", verifyToken, verifyAdmin, deleteFarm);

module.exports = router; 