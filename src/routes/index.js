const express = require('express');
// const { PrismaClient } = require('@prisma/client');
const AdminService = require('../services/Admin/adminService');
const AdminController = require('../controllers/adminController');
const AuthService = require('../services/Authentication/AuthService');
const BcryptHasher = require('../utility/BcryptPasswordHasher');
const AuthController = require('../controllers/AuthController');
const CategoryService = require('../services/Category/CategoryService');
const CategoryController = require('../controllers/categoryController');
const ProductService = require('../services/Product/ProductService');
const ProductController = require('../controllers/productController');
const BrandController = require('../controllers/BrandController');
const BrandService = require('../services/Brand/BrandService');
const AttributesService = require('../services/Attributes/AttributesService');
const AttributesController = require('../controllers/attributesController');
const OrderService = require('../services/Order/OrderService');
const OrderCOntroller = require('../controllers/orderController');
const SliderController = require('../controllers/sliderController');
const SliderService = require('../services/Slider/SliderService');
const SubscribeService = require('../services/Subscribe/SubscribeService');
const SubscribeController = require('../controllers/subscribeController');
const UserService = require('../services/User/userService');
const UserController = require('../controllers/userController');
const serviceRouter = require('./serviceRouter');
const serviceListRouter = require('./serviceListRouter');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const sharp =require("sharp");
const fs= require("fs");
const path= require("path");
const newsRouter = require('./newsRouter');
const router = express.Router();

const prisma = new PrismaClient()
const adminService = new AdminService(prisma);
const adminController = new AdminController(adminService);
const hasher = new BcryptHasher()
const authService = new AuthService(prisma, hasher)
const categoryService = new CategoryService(prisma)
const productService = new ProductService(prisma);
const brandService = new BrandService(prisma);
const attributeService = new AttributesService(prisma);
const sliderService = new SliderService(prisma);
const orderService = new OrderService(prisma)
const subscribeService = new SubscribeService(prisma)

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



//authentication
router.post('/login', (req, res, next) => {
    const authController = new AuthController(authService)
    authController.login(req, res, next)
})


//category route
router.post("/category/create", (req, res, next) => {
    const categoryController = new CategoryController(categoryService)
    categoryController.createCategory(req, res, next)

})

router.get("/category", (req, res, next) => {
    const categoryController = new CategoryController(categoryService)
    categoryController.getCategories(req, res, next)
})
router.get("/category/:id", (req, res, next) => {
    const categoryController = new CategoryController(categoryService)
    categoryController.getCategoryById(req, res, next)
})
router.put("/category/:id", (req, res, next) => {
    const categoryController = new CategoryController(categoryService)
    categoryController.updateCategory(req, res, next)
})
router.delete("/category/:id", (req, res, next) => {
    const categoryController = new CategoryController(categoryService)
    categoryController.deleteCategory(req, res, next)
})


//[route("/product/create")]
router.post("/product/create", (req, res, next) => {
    const productController = new ProductController(productService);
    productController.createProduct(req, res, next)

})
//[route("/product")]
router.get("/product", (req, res, next) => {
    const productController = new ProductController(productService);
    productController.getProducts(req, res, next);
})
//[route("/product/{id}")]
router.get("/product/:id", (req, res, next) => {
    const productController = new ProductController(productService);
    productController.getProductById(req, res, next);
})


//[route("/product/{id}")]
router.put("/product/:id", (req, res, next) => {
    const productController = new ProductController(productService);
    productController.updateProduct(req, res, next);
})

//[route("/product/{id}")]
router.delete("/product/:id", (req, res, next) => {
    const productController = new ProductController(productService);
    productController.deleteProduct(req, res, next)
})

//[route("/brand/create")]
router.post("/brand/create", (req, res, next) => {
    const brandController = new BrandController(brandService);
    brandController.create(req, res, next)
})
//[route("/brand")]
router.get("/brand", (req, res, next) => {
    const brandController = new BrandController(brandService);
    brandController.getAll(req, res, next)
})
//[route("/brand/{id}")]
router.get("/brand/:id", (req, res, next) => {
    const brandController = new BrandController(brandService);
    brandController.getSingle(req, res, next)
})
//[route("/brand/{id}")]
router.put("/brand/:id", (req, res, next) => {
    const brandController = new BrandController(brandService);
    brandController.update(req, res, next)
})
//[route("/brand/{id}")]
router.delete("/brand/:id", (req, res, next) => {
    const brandController = new BrandController(brandService);
    brandController.delete(req, res, next)
})



//[route("/attributes/create")]
router.post("/attributes/create", (req, res, next) => {
    const attributesController = new AttributesController(attributeService);
    attributesController.createAttribute(req, res, next)
})
//[route("/attributes")]
router.get("/attributes", (req, res, next) => {
    const attributesController = new AttributesController(attributeService);
    attributesController.getAllAttributes(req, res, next)
})
//[route("/attributes/{id}")]
router.get("/attributes/:id", (req, res, next) => {
    const attributesController = new AttributesController(attributeService);
    attributesController.getAttributeById(req, res, next)
})
//[route("/attributes/{id}")]
router.put("/attributes/:id", (req, res, next) => {
    const attributesController = new AttributesController(attributeService);
    attributesController.updateAttribute(req, res, next)
})
//[route("/attributes/{id}")]
router.delete("/attributes/:id", (req, res, next) => {
    const attributesController = new AttributesController(attributeService);
    attributesController.deleteAttribute(req, res, next)
})
//[route("/orders/create")]
router.post("/orders/create", (req, res, next) => {
    const orderController = new OrderCOntroller(orderService);
    orderController.createOrder(req, res, next);
})
router.get("/orders", (req, res, next) => {
    const orderController = new OrderCOntroller(orderService);
    orderController.getOrders(req, res, next);
})
router.get("/success", (req, res, next) => {
    const orderController = new OrderCOntroller(orderService);
    orderController.paymentSuccess(req, res, next);
})

//slider routes
//[route("/sliders/create")]
router.post("/sliders/create", (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.createSlider(req, res, next)
})
//[route("/sliders")]
router.get("/sliders", (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.getSliders(req, res, next)
})
//[route("/sliders/{id}")]
router.get("/sliders/:id", (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.getSliderById(req, res, next)
})
//[route("/sliders/{id}")]
router.put("/sliders/:id", (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.updateSlider(req, res, next)
})
//[route("/sliders/{id}")]
router.delete("/sliders/:id", (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.deleteSlider(req, res, next)
})

//subscribe routes
//[route("/subscribe/create")]
router.post("/subscribe/create", (req, res, next) => {
    const subscribeController = new SubscribeController(subscribeService);
    subscribeController.subscribe(req, res, next)
})
//[route("/unsubscribe")]
router.post("/unsubscribe", (req, res, next) => {
    const subscribeController = new SubscribeController(subscribeService);
    subscribeController.unsubscribe(req, res, next)
})
//[route("/subscriptions")]
router.get("/subscriptions", (req, res, next) => {
    const subscribeController = new SubscribeController(subscribeService);
    subscribeController.getSubscriptions(req, res, next)
})
//[route("/subscriptions/{email}")]
router.get("/subscriptions/:email", (req, res, next) => {
    const subscribeController = new SubscribeController(subscribeService);
    subscribeController.getSubscriptionByEmail(req, res, next)
})
router.use('/services',serviceRouter);
router.use('/services-list',serviceListRouter);

router.use("/news",newsRouter);



// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// const baseUploadDir = "uploads";
// if (!fs.existsSync(baseUploadDir)) {
//   fs.mkdirSync(baseUploadDir, { recursive: true });
// }

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
// // const IMAGE_DIR = path.join(__dirname, 'uploads');

// // const baseUploadDir = path.join(__dirname, "../../uploads"); // Adjust path to move out of src/routes

// router.get("/imageapi/:imagename", async (req, res) => {
//     const { imagename } = req.params;
//     let { width, height, quality, format, folder } = req.query;

//     console.log("Received Query Params:", { width, height, quality, format, folder });

//     // Default folder if not provided
//     folder = folder || "default";

//     // Convert query parameters to integers
//     width = width ? parseInt(width) : null;
//     height = height ? parseInt(height) : null;
//     quality = quality ? parseInt(quality) : 90; // Default quality 90
//     format = format ? format.toLowerCase() : "jpeg"; // Default format is JPEG

//     // Construct the correct dynamic image path
//     const imagePath = path.join(baseUploadDir, folder, imagename);

//     console.log("Checking file at:", imagePath);

//     // Check if image exists
//     if (!fs.existsSync(imagePath)) {
//         return res.status(404).send("Image not found");
//     }

//     try {
//         let image = sharp(imagePath).resize(width, height);

//         // Convert image based on requested format
//         if (format === "webp") {
//             res.setHeader("Content-Type", "image/webp");
//             image = image.webp({ quality });
//         } else {
//             res.setHeader("Content-Type", "image/jpeg");
//             image = image.jpeg({ quality });
//         }

//         image.pipe(res);
//     } catch (error) {
//         console.error("Error processing image:", error);
//         res.status(500).send("Error processing image");
//     }
// });



















module.exports = router;
