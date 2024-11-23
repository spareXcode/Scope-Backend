const express=require('express')
const router=express.Router();
const stockUploadRoutes = require('./stock-upload/stock-upload.route');
const utilitesRoutes=require('./utilities/utilites.route')
const mappingRoutes=require('./mapping/mapping.route')
const bulkStockRoutes=require('./bulk-stock-upload/bulk-stock-upload.route')
const dashboardRoutes=require('./dashboard/dashboard.route')
router.use('/stock-upload',stockUploadRoutes)
router.use('/mapping',mappingRoutes)
router.use('/utilities',utilitesRoutes)
router.use('/bulk-stock',bulkStockRoutes)
router.use('/dashboard',dashboardRoutes)
module.exports=router;