const locationService=require('../../services/utilites/location.service')
module.exports={
    getLocations:async function(req,res){
        try{
             console.log("req ",req.body)
            const result=await locationService.getLocations(req.body);
            return res.json({status:200,data:result});
        }
        catch(error)
        {
            res.json({error:"Dealers are not fetched",status:500})
        }
    }
}