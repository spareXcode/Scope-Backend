const express=require('express')
const router=express();
const dashboardController=require('../../controller/dashboard/dashboard.controller')

// spm dashbaord route
router.post('/approved-by',dashboardController.getApprovedBy);
router.post('/part-not-in-master',dashboardController.getAllPartNotInMaster)
router.post('/pending-request',dashboardController.getPendingRequest)
router.post('/approved-request',dashboardController.getApprovedRequest)
router.get('/approved-request-loc',dashboardController.getApprovedRequestBasedOnSelectedLocation)
router.post('/rejected-request',dashboardController.getRejectedRequest)
router.get('/rejected-request-loc',dashboardController.getRejectedRequestBasedOnSelectedLocation)
router.get('/part-not-in-master-loc',dashboardController.getPartNotInMasterBasedOnLocation)
router.get('/pending-request-loc',dashboardController.getPendingRequestBasedOnLocations)
router.post('/locations',dashboardController.getLocationsBasedOnDealer)
router.post('/stock-uploaded-date',dashboardController.getStockUploadOn)

router.post('/fetch-data-locations',dashboardController.getAllInfoBasedOnLocations)

//admin dashboard route

 router.post('/fetch-data',dashboardController.getAllInfoBasedAdminDashboard)
// router.get('/:brandId/:dealerId',dashboardController.getAllInfoBasedOnDealer)
module.exports=router;