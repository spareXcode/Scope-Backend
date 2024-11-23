const express=require('express')
const router=express();
const dashboardController=require('../../controller/dashboard/dashboard.controller')

// spm dashbaord route
router.get('/order-type',dashboardController.getOrderType);
router.get('/approved-by',dashboardController.getApprovedBy);
router.get('/part-not-in-master',dashboardController.getAllPartNotInMaster)
router.get('/pending-request',dashboardController.getPendingRequest)
router.get('/approved-request',dashboardController.getApprovedRequest)
router.get('/approved-request-loc',dashboardController.getApprovedRequestBasedOnSelectedLocation)
router.get('/rejected-request',dashboardController.getRejectedRequest)
router.get('/rejected-request-loc',dashboardController.getRejectedRequestBasedOnSelectedLocation)
router.get('/part-not-in-master-loc',dashboardController.getPartNotInMasterBasedOnLocation)
router.get('/pending-request-loc',dashboardController.getPendingRequestBasedOnLocations)
router.get('/locations',dashboardController.getLocationsBasedOnDealer)
router.get('/stock-uploaded-date',dashboardController.getStockUploadOn)
module.exports=router;


//admin dashboard

router.get('/:brandId',dashboardController.getAllInfoBasedOnBrand)