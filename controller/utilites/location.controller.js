const locationService=require('../../services/utilites/location.service')
module.exports={
    getLocations:async function(req,res){
        try{
            //console.log("req ",req)
            const result=await locationService.getLocations(req.query);
            return res.json({status:200,data:result});
        }
        catch(error)
        {
            res.json({error:"Dealers are not fetched",status:500})
        }
    }
}