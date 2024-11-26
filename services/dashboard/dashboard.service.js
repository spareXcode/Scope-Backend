const { Transaction } = require('mssql2');
const config=require('../../dbConfig')
const sql=require('mssql')
const adminDashboardService=require('../dashboard/adminDashboard.service')
module.exports={
    getOrderType:async function(req,res){

        try{

            var pool=await sql.connect(config)
            const transaction=new Transaction();
            await transaction.begin();
            new sql.Request(transaction)
            const query=``;
            const result=await pool.request().query(query);

            await transaction.commit();
            return result;

        }
        catch(err){
            console.log("error message ",err.message)
            await transaction.rollback();
        }

    },
    
    getApprovedBy:async function(req,res){
        try{

            var pool=await sql.connect(config)
    
            const transaction=new sql.Transaction();
            await transaction.begin();
            new sql.Request(transaction)
            locationId=req.location_id;
            const query1=`SELECT DealerID from LocationInfo where LocationID=@locationId`;
            const result1=await pool.request()
            .input('locationId',locationId).query(query1)
            dealerId=result1.recordset.DealerID;

            const query=`SELECT a.vcFirstName,a.vcLastName from AdminMaster_GEN a LEFT JOIN CreateOrderRequest_TD001_${dealerId} c ON a.bintId_Pk=c.SCSby where LocationID=@LocationId`;
            const result=await pool.request()
            .input('dealerId',dealerId)
            .input('locationId',dealerId).query(query);
            await transaction.commit();
            return result;

        }
        catch(err){
            console.log("error message ",err.message)
            await transaction.rollback();
        }
    },

    getPendingRequest:async function(req,res){
        try{
            var pool=await sql.connect(config)
    
            const transaction= new sql.Transaction();
            await transaction.begin();
            new sql.Request(transaction)
            dealerId=req.dealer_id;
            console.log("dealer ",dealerId);
            const query=`SELECT LocationID from LocationInfo where DealerID=@dealerId`

            const result=await pool.request()
            .input('dealerId',dealerId)
            .query(query);
            console.log("result loc",result.recordset);
            const pendingRequests=[]
            for(let res of result.recordset){
                var pool=await sql.connect(config)
                locationId=res.LocationID
                const query1 = `
            SELECT COUNT(Current_status) as current_status_count 
                        FROM CreateOrderRequestPending_TD001_${dealerId} 
                        WHERE LocationID = @locationId AND Current_status = 'Pending'`
                const result=await pool.request()
                .input('dealerId',dealerId)
                .input('locationId',locationId)
                .query(query1);
                pendingRequests.push(result.recordset);
            }
            console.log("pending request ",pendingRequests)
            await transaction.commit();
            return pendingRequests;

        }
        catch(err){
            console.log("error message ",err.message)
            await transaction.rollback();
        }
    },

    getPendingRequestOnSelectedLocation:async function(req){
        try{
            var pool=await sql.connect(config);
            var transaction=new sql.Transaction();
            await transaction.begin();
            new sql.Request(transaction)
            locationIdArray=req.location_id;
            const res=await this.getBrandAndDealerBasedOnLocation(locationIdArray);
            console.log("dealerId",res)
            dealerId=req.dealer_id;
            const partNotInMasterData=[]
            for(let id of res){
                console.log("id ",id);
                
                // dealerId=id.result.DealerID
                locationId=id.locationId
                // console.log("location ",locationId);
                
                const query1 = `
            DECLARE @sql NVARCHAR(MAX);
            SET @sql = N'SELECT COUNT(Current_status) as current_status_count
                        FROM CreateOrderRequestPending_TD001_' + @dealerId 
                        + ' WHERE LocationID = @locationId AND Current_status = ''Pending''';
            EXEC sp_executesql @sql, N'@dealerId INT, @locationId INT', @dealerId, @locationId;
        `;
                const result=await pool.request()
                .input('locationId',locationId)
                .input('dealerId',dealerId)
                .query(query1);
                partNotInMasterData.push(result.recordset);
                console.log("result ",result.recordset)
            }
            await transaction.commit();
            return partNotInMasterData;
        }
        catch(error){
            console.log("error ",error.message)
            await transaction.rollback();
        }
    },


    getRejectedRequest:async function(req,res){
        try{
            var pool=await sql.connect(config)
    
            const transaction= new sql.Transaction();
            await transaction.begin();
            new sql.Request(transaction)
            dealerId=req.dealer_id;
            console.log("dealer ",dealerId);
            const query=`SELECT LocationID from LocationInfo where DealerID=@dealerId`

            const result=await pool.request()
            .input('dealerId',dealerId)
            .query(query);
            console.log("result loc",result.recordset);
            const rejectedRequests=[]
            for(let res of result.recordset){
                var pool=await sql.connect(config)

                locationId=res.LocationID
                const query1 = `
            SELECT COUNT(Current_status) as current_status_count
                        FROM Create_Order_Request_TD001_${dealerId}
                    WHERE LocationID = @locationId AND Current_status = 'Decline'
        `;
                const result=await pool.request()
                .input('dealerId',dealerId)
                .input('locationId',locationId)
                .query(query1);
                rejectedRequests.push(result.recordset);
            }
            console.log("rejected request ",rejectedRequests)
            await transaction.commit();
            return rejectedRequests;

        }
        catch(err){
            console.log("error message ",err.message)
            await transaction.rollback();
        }
    },
    
    getRejectedRequestBasedOnSelectedLocation:async function(req,res){
        try{
            var pool=await sql.connect(config);
            var transaction=new sql.Transaction();
            await transaction.begin();
            new sql.Request(transaction)
            locationIdArray=req.location_id;
            const res=await this.getBrandAndDealerBasedOnLocation(locationIdArray);
            console.log("dealerId",res)
            dealerId=req.dealer_id;
            const rejectedRequests=[]
            for(let id of res){
                console.log("id ",id);
                
                // dealerId=id.result.DealerID
                locationId=id.locationId
                // console.log("location ",locationId);
                
                const query1 = `
            DECLARE @sql NVARCHAR(MAX);
            SET @sql = N'SELECT COUNT(Current_status) as current_status_count 
                        FROM Create_Order_Request_TD001_' + @dealerId 
                        + ' WHERE LocationID = @locationId AND Current_status = ''Decline''';
            EXEC sp_executesql @sql, N'@dealerId INT, @locationId INT', @dealerId, @locationId;
        `;
                const result=await pool.request()
                .input('locationId',locationId)
                .input('dealerId',dealerId)
                .query(query1);
                rejectedRequests.push(result.recordset);
                console.log("result ",result.recordset)
            }
            await transaction.commit();
            return rejectedRequests;
        }
        catch(error){
            console.log("error ",error.message)
            await transaction.rollback();
        }
    },

    getApprovedRequest:async function(req,res){
        try{
            var pool=await sql.connect(config)
    
            const transaction= new sql.Transaction();
            await transaction.begin();
            new sql.Request(transaction)
            dealerId=req.dealer_id;
            console.log("dealer ",dealerId);
            const query=`SELECT LocationID from LocationInfo where DealerID=@dealerId`

            const result=await pool.request()
            .input('dealerId',dealerId)
            .query(query);
            console.log("result loc",result.recordset);
            const approvedRequests=[]
            for(let res of result.recordset){
                var pool=await sql.connect(config)
                locationId=res.LocationID
                const query1 = `
           SELECT Count(Current_status) as current_status_count 
                        FROM Create_Order_Request_TD001_${dealerId} 
                        WHERE LocationID = @locationId AND Current_status='Approve'
            
        `;
                const result=await pool.request()
                .input('dealerId',dealerId)
                .input('locationId',locationId)
                .query(query1);
                approvedRequests.push(result.recordset);
            }
            console.log("approved request ",approvedRequests)
            await transaction.commit();
            return approvedRequests;

        }
        catch(err){
            console.log("error message ",err.message)
            await transaction.rollback();
        }
       
    },

    getApprovedRequestBasedOnSelectedLocation:async function(req,res){
        try{
            var pool=await sql.connect(config);
            var transaction=new sql.Transaction();
            await transaction.begin();
            new sql.Request(transaction)
            locationIdArray=req.location_id;
            const res=await this.getBrandAndDealerBasedOnLocation(locationIdArray);
            console.log("dealerId",res)
            dealerId=req.dealer_id;
            const approvedRequests=[]
            for(let id of res){
                // console.log("id ",id);
                
                // dealerId=id.result.DealerID
                locationId=id.locationId
                // console.log("location ",locationId);
                
                const query1 = `
            DECLARE @sql NVARCHAR(MAX);
            SET @sql = N'SELECT Count(Current_status) as current_status_count
                        FROM Create_Order_Request_TD001_' + @dealerId 
                        + ' WHERE LocationID = @locationId AND Current_status = ''Approve''';
            EXEC sp_executesql @sql, N'@dealerId INT, @locationId INT', @dealerId, @locationId;
        `;
                const result=await pool.request()
                .input('locationId',locationId)
                .input('dealerId',dealerId)
                .query(query1);
                approvedRequests.push(result.recordset);
                console.log("result ",result.recordset)
            }
            await transaction.commit();
            return approvedRequests;
        }
        catch(error){
            console.log("error ",error.message)
            await transaction.rollback();
        }
    },

    getPartNotInMasterOnSelectedLocation:async function(req,res){
        try{
            var pool=await sql.connect(config);
            var transaction=new sql.Transaction();
            await transaction.begin();
            new sql.Request(transaction)
            locationIdArray=req.location_id;
            const res=await this.getBrandAndDealerBasedOnLocation(locationIdArray);
            // console.log("dealerId",res)
            dealerId=req.dealer_id
            const partNotInMasterData=[]
            for(let id of res){
                // console.log("id ",id);
                locationId=id.locationId
                // console.log("location ",locationId);
                
                const query = `
                DECLARE @sql NVARCHAR(MAX);
                SET @sql = N'SELECT Count(Yellow_line) as yellow_line_count FROM Create_Order_Request_TD001_${dealerId} WHERE LocationID = @locationId and Yellow_line=1';
                EXEC sp_executesql @sql, N'@locationId INT', @locationId;
                `;
                const result=await pool.request()
                .input('locationId',locationId)
                .input('dealerId',dealerId)
                .query(query);
                partNotInMasterData.push(result.recordset);
                // console.log("result ",result.recordset)
            }
            await transaction.commit();
            console.log("part not in master ",partNotInMasterData)
            return partNotInMasterData;
        }
        catch(error){
            console.log("error ",error.message)
            await transaction.rollback();
        }
     
    },

    getBrandAndDealerBasedOnLocation:async function(idArray){
        try{
            var pool= await sql.connect(config);
            const transaction=new sql.Transaction();

            await transaction.begin();
            new sql.Request(transaction)
            const obj=[];
            for(let id of idArray){

                const query=`Select BrandID, DealerID from LocationInfo where LocationId=@id `
    
                const result =await pool.request()
                .input('id',id)
                .query(query)
                obj.push({locationId:id,result:result.recordset[0]});
                // console.log("",result.recordset)
            }
            return obj

        }
        catch(error){
            console.log("error in fetching ",error.message)
        }
    },

    getPartNotInMaster:async function(req){

        try{
            var pool=await sql.connect(config);
            var transaction= await new sql.Transaction(pool);
            await transaction.begin();
            new sql.Request(transaction)
            dealerId=req.dealer_id;
            console.log("dealer ",dealerId);
            const query=`SELECT LocationID from LocationInfo where DealerID=@dealerId`

            const result=await pool.request()
            .input('dealerId',sql.Int,dealerId)
            .query(query);
            console.log("result loc",result.recordset);
            const partNotInMasterData=[]
            
            for(let id of result.recordset){
                var pool=await sql.connect(config);
                console.log("id ",id);
                locationId=id.LocationID
                // console.log("location ",locationId);
                
                // const query = `
                // DECLARE @sql NVARCHAR(MAX);
                // SET @sql = N'SELECT COUNT(Yellow_line) as yellow_line_count FROM Create_Order_Request_TD001_${dealerId} WHERE LocationID = @locationId and Yellow_line=1';
                // EXEC sp_executesql @sql, N'@locationId INT', @locationId ;
                // `;
                const query = `
                SELECT COUNT(Yellow_line) as yellow_line_count FROM Create_Order_Request_TD001_${dealerId} WHERE LocationID = @locationId and Yellow_line=1;
                `;
                const result1=await pool.request()
                .input('locationId',sql.Int,locationId)
                 .input('dealerId',sql.Int,dealerId)
                .query(query);
                partNotInMasterData.push(result1.recordset);
                console.log("result ",result1.recordset)
            }
            console.log("result in partnot ",partNotInMasterData)
            await transaction.commit();
            return partNotInMasterData
        }
        catch(error){
            console.log("error ",error)
            await transaction.rollback();
        }
        finally{
            await pool.close()
        }
        
    
    },

    getLocationsBasedOnDealer:async function(req){
        try{

            var pool=await sql.connect(config);
            var transaction=new sql.Transaction();
            await transaction.begin();
            new sql.Request(transaction);
            dealerId=req.dealer_id;

            const query=`Select LocationID,Location,Dealer from LocationInfo where DealerID=@dealerId`;
            const result=await pool.request()
            .input('dealerId',dealerId)
            .query(query);

            console.log("result ",result.recordset);

            return result.recordset
        }
        catch(eror){
            console.log("error ",error.message)
        }
    },

    getStockUploadOn:async function(req){
        try{
            const pool=await sql.connect(config);
            const transaction=new sql.Transaction();
            await transaction.begin();
            new sql.Request(transaction)
           
            locationId=req.location_id;
            console.log("location id ",locationId)
            const query=`Select StockDate from CurrentStock1 where LocationID=@locationId`;

            const result=await pool.request()
            .input('locationId',locationId)
            .query(query);
            console.log("result ",result.recordset)
            return result.recordset;

        }
        catch(error){
            console.log("error ",error.message)
        }
    },

    getPartNotInMasterBasedAdminBoard:async function(req){
        try{
            var pool=await sql.connect(config)

            var transaction=new sql.Transaction();
            await transaction.begin();
            new sql.Request(transaction)
            brand_id=req.brand_id;
            dealer_id=req.dealer_id
            // const query=`SELECT BrandID,DealerID,LocationID from LocationInfo`;
            // const result=await pool.request().query(query);

            // for(let record in result.recordset){
            //     brandId=record.BrandID;
            //     dealerId=record.DealerID;
            //     locationId=record.LocationID
                const query2 = `
                DECLARE @sql NVARCHAR(MAX);
                SET @sql = N'SELECT COUNT(Yellow_line) as yellow_line_count FROM Create_Order_Request_TD001_${dealerId} WHERE BrandID = @brandId and Yellow_line=1';
                EXEC sp_executesql @sql, N'@brandId INT', @brandId ;
                `;
                const result1=await pool.request()
                .input('brandId',brandId)
                // .input('dealerId',dealerId)
                .query(query2);
                partNotInMasterData.push(result1.recordset);
                console.log("result ",result1.recordset)
            // }

        }
        catch{
            console.log("error ",error.message)
        }
    },

    getAllInfoBasedOnBrand:async function(req){
        var pool=await sql.connect(config);
        var transaction=new sql.Transaction();
        await transaction.begin()
        new sql.Request(transaction);

        const brandId=req.params.brandId;
        const query=`SELECT DealerID from LocationInfo where brandId=@brandId`;

        const result=await pool.request()
        .input('brandId',brandId).query(query);
        const data={
            brandId:brandId,
            dealers:result.recordset
        }
        //  const partNotInMasterDetails=await 
        //  const noOfRequestApprovedDetails=await adminDashboardService.getNoOfRequestApprovedBasedOnBrand(data);
        //  const noOfRequestPendingDetails=await adminDashboardService.getNoOfRequestPendingBasedOnBrand(data);
        //  const noOfRequestRejectedDetails=await adminDashboardService.getNoOfRequestRejectedBasedOnBrand(data);

        
        const [partNotInMasterDetails,noOfRequestApprovedDetails, noOfRequestPendingDetails, noOfRequestRejectedDetails] = await Promise.all([
            adminDashboardService.getPartNotInMasterBasedOnBrand(data),
            adminDashboardService.getNoOfRequestApprovedBasedOnBrand(data),
            adminDashboardService.getNoOfRequestPendingBasedOnBrand(data),
            adminDashboardService.getNoOfRequestRejectedBasedOnBrand(data)
        ]);
        const responseData = {
            partNotInMasterData: partNotInMasterDetails,
            noOfRequestPendingData: noOfRequestPendingDetails,
            noOfRequestApprovedData: noOfRequestApprovedDetails,
            noOfRequestRejectedData: noOfRequestRejectedDetails,
          };
          return responseData

    }
  
    
   

}