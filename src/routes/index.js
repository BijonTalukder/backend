const express = require('express');
// const { PrismaClient } = require('@prisma/client');
const AdminService = require('../services/Admin/adminService');
const AdminController = require('../controllers/adminController');
const AuthService = require('../services/Authentication/AuthService');
const BcryptHasher = require('../utility/BcryptPasswordHasher');
const AuthController = require('../controllers/AuthController');

const UserService = require('../services/User/userService');
const UserController = require('../controllers/userController');
const serviceRouter = require('./serviceRouter');
const serviceListRouter = require('./serviceListRouter');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const newsRouter = require('./newsRouter');
const breakingNewsRouter = require('./breakingNewsRouter');
const serviceListDetailsRouter = require('./serviceListDetails');
const serviceAreaRouter = require('./serviceAreaRoutes');
const auth = require('../utility/auth');
const router = express.Router();

const prisma = new PrismaClient()
const adminService = new AdminService(prisma);
const adminController = new AdminController(adminService);
const hasher = new BcryptHasher()
const authService = new AuthService(prisma, hasher)

const userService = new UserService(prisma);
const userController = new UserController(userService);
// user route
// [route("/users/create")]
router.post("/users/create", (req, res, next) => {
    userController.createUser(req, res, next);
})
router.get('/users', (req, res, next) => {
    userController.getAllUsers(req, res, next);
});
router.get('/users/:id', (req, res, next) => {
    userController.getSingleUser(req, res, next);
});

// Route to update a user by ID
router.put('/users/:id', (req, res, next) => {
    userController.updateUser(req, res, next);
});

// Route to delete a user by ID
router.delete('/users/:id', (req, res, next) => {
    userController.deleteUser(req, res, next);
});



// Define routes
router.post('/admin/create', (req, res, next) => adminController.createAdmin(req, res, next));

router.post('/admin/create-user-with-permissions', auth,(req, res, next) => {
    adminController.createUserWithPermissions(req, res, next);
});

//authentication
router.post('/login', (req, res, next) => {
    const authController = new AuthController(authService)
    authController.login(req, res, next)
})

router.use('/services', serviceRouter);
router.use('/services-list', serviceListRouter);

router.use("/news", newsRouter);
router.use("/breaking-news", breakingNewsRouter);
router.use("/service-list-details", serviceListDetailsRouter)
router.use('/service-areas', serviceAreaRouter);

// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// const baseUploadDir = "uploads";
// if (!fs.existsSync(baseUploadDir)) {
//   fs.mkdirSync(baseUploadDir, { recursive: true });
// }
// Function to process images and generate 3 sizes in WebP
// Function to process images and generate 3 sizes in WebP
// Function to process images and generate 3 sizes in WebP
// const processImage = async (buffer, originalname, folderPath, folderUrl) => {
//     const timestamp = Date.now();
//     const baseName = path.parse(originalname).name;

//     // Define file names for different sizes

//     const extraLargeFileName = `extra-large_${timestamp}-${baseName}.webp`;
//   const largeFileName = `large_${timestamp}-${baseName}.webp`;
//   const mediumFileName = `medium_${timestamp}-${baseName}.webp`;
//   const smallFileName = `small_${timestamp}-${baseName}.webp`;


//     const extraLargeFilePath = path.join(folderPath, "extra-large", extraLargeFileName);
//   const largeFilePath = path.join(folderPath, "large", largeFileName);
//   const mediumFilePath = path.join(folderPath, "medium", mediumFileName);
//   const smallFilePath = path.join(folderPath, "small", smallFileName);

//     // Create the directories for each size
//     fs.mkdirSync(path.join(folderPath, "extra-large"), { recursive: true });
//   fs.mkdirSync(path.join(folderPath, "large"), { recursive: true });
//   fs.mkdirSync(path.join(folderPath, "medium"), { recursive: true });
//   fs.mkdirSync(path.join(folderPath, "small"), { recursive: true });

//     // Process images with different sizes
//     await Promise.all([
//         sharp(buffer).resize(680).toFormat("webp", { quality: 100, lossless: false }).toFile(extraLargeFilePath),
//         sharp(buffer).resize(450).toFormat("webp", { quality: 100, lossless: false }).toFile(largeFilePath),
//         sharp(buffer).resize(350).toFormat("webp", { quality: 100, lossless: false }).toFile(mediumFilePath),
//         sharp(buffer).resize(250).toFormat("webp", { quality: 100, lossless: false }).toFile(smallFilePath),
//     ]);

//     return {
//         extraLarge: { filename: extraLargeFileName, imageUrl: `${folderUrl}/extra-large/${extraLargeFileName}` },
//         large: { filename: largeFileName, imageUrl: `${folderUrl}/large/${largeFileName}` },
//         medium: { filename: mediumFileName, imageUrl: `${folderUrl}/medium/${mediumFileName}` },
//         small: { filename: smallFileName, imageUrl: `${folderUrl}/small/${smallFileName}` },
//       };
//   };

//   router.post("/upload", upload.any(), async (req, res) => {
//     try {
//       let folder = req.body.folder || "default"; // Default folder if none provided
//       const title = req.body.title;

//       console.log("Title:", title);

//       // Create folder inside 'uploads' directory
//       const folderPath = path.join(baseUploadDir, folder);
//       if (!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath, { recursive: true });
//       }

//       // Folder URL (Ensuring it's a proper URL format)
//       const folderUrl = `${req.protocol}://${req.get("host")}/uploads/${folder}`;

//       let filesUploaded = [];

//       // Handle multiple files
//       if (req.files && req.files.length > 0) {
//         const processedFiles = await Promise.all(
//           req.files.map(async (file) => {
//             const processedFile = await processImage(file.buffer, file.originalname, folderPath, folderUrl);
//             return processedFile;
//           })
//         );
//         filesUploaded.push(...processedFiles);
//       }

//       res.json({ 
//         status: "Success",
//         folderUrl: folderUrl,
//         images: filesUploaded,
//       });
//     } catch (error) {
//       console.error("Error processing images:", error);
//       res.status(500).json({ message: "Error processing images" });
//     }
//   });



















module.exports = router;
