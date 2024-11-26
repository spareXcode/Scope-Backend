const dashboardService=require('../../services/dashboard/dashboard.service')
module.exports={
    getOrderType:async function(req,res){
        try{
            const result=await dashboardService.getOrderType(req);

            res.status(200).json({data:result})
        }
        catch(error){
            res.status(200).json({message:'Not Succesful'})
        }
    },

    getApprovedBy:async function(req,res){
        try{
            const result=await dashboardService.getApprovedBy(req.body);

            res.status(200).json({data:result})
        }
        catch(error){
            res.status(200).json({message:'Not Succesful'})
        }
    },

    getAllPartNotInMaster:async function(req,res){
        try{
            const result= await dashboardService.getPartNotInMaster(req.body);

            res.status(200).json({data:result})
        }
        catch(error){
            res.status(200).json({message:'Not Succesfull'})
        }
    },

    getPendingRequest:async function (req,res) {
        try{
            const result=await dashboardService.getPendingRequest(req.body);

            res.status(200).json({data:result})
        }
        catch(error){
            res.status(200).json({message:'Not Succesfull'})
        }
    },
  
    getApprovedRequest:async function(req,res){
        try{
            const result=await dashboardService.getApprovedRequest(req.body);

            res.status(200).json({data:result})
        }
        catch(error){
            res.status(200).json({message:'Not Succesful'})
        }
    },

    getRejectedRequest:async function(req,res){
        try{
            const result=await dashboardService.getRejectedRequest(req.body);

            res.status(200).json({data:result})
        }
        catch(error){
            res.status(200).json({message:'Not Succesfull'})
        }
    },

    getRejectedRequestBasedOnSelectedLocation:async function(req,res){
        try{
            const result=await dashboardService.getRejectedRequestBasedOnSelectedLocation(req.body);
            res.status(200).json({data:result})
        }
        catch(error){
            res.status(200).json({message:'Not fetched'})
        }
    },

    getPartNotInMasterBasedOnLocation:async function (req,res) {
        try{
            const result=await dashboardService.getPartNotInMasterOnSelectedLocation(req.body)
            // console.log("result in controller ",result)
            res.status(200).json({data:result})
            
        }
        catch(error){
            res.status(200).json({message:'Not fetched'})
        }
    },

    getPendingRequestBasedOnLocations:async function(req,res){
        try{
            const result=await dashboardService.getPendingRequestOnSelectedLocation(req.body)
            res.status(200).json({data:result})
        }
        catch(error){
            res.status(200).json({message:'Not fetched'})
        }
    },

    getLocationsBasedOnDealer:async function(req,res){
        try{
            const result=await dashboardService.getLocationsBasedOnDealer(req.body);
            res.status(200).json({data:result})
        }
        catch(error){
            res.status(200).json({message:'Not fetched'})
        }
    },

    getStockUploadOn:async function(req,res){
        try{
           const result=await dashboardService.getStockUploadOn(req.body);
           
           res.status(200).json({data:result})
        }
        catch(error){
            console.log("error ",error.message)
            res.status(200).json({message:"Not fetched successfully"})
        }
    },

    getApprovedRequestBasedOnSelectedLocation:async function(req,res){
        try{
            const result=await dashboardService.getApprovedRequestBasedOnSelectedLocation(req.body)
            res.status(200).json({data:result})
        }
        catch(error){
            res.status(200).json({message:'Not fetched'})
        }
    },

    getPartNotInMasterBasedOnAllBrands:async function (req,res) {
        try{
            const result=await getPartNotInMasterBasedAdminBoard(req.body);
            res.status(200).json({data:result})
        }
        catch(error){
            res.status(201).json({error:'Not fetched Successfully'})
        }
    },

    getAllInfoBasedAdminDashboard:async function (req,res) {
        try{
            const result=await dashboardService.getAllInfoBasedAdminDashboard(req.body);
            
            res.status(200).json({data:result})
        }catch(error){
            res.status(201).json({error:'Not fetched Successfully ....'})
        }
    },

    getAllInfoBasedOnLocations:async function(req,res){
        try{
            const result=await dashboardService.getAllInfoBasedOnLocations(req.body)
            res.status(200).json({data:result})
            console.log("_______________________",result)
        }catch(error){
            res.status(201).json({error:'Not fetched Successfully'})
        }
    }
}