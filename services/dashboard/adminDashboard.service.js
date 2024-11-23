
const config=require('../../dbConfig');
const sql=require('mssql');
const { Transaction } = require('mssql2');
module.exports={
    getPartNotInMasterBasedOnBrand:async function(data){

        try{
            var pool=await sql.connect(config);
            var transaction=new sql.Transaction();
            await transaction.begin()
            new sql.Request(transaction);
            brandId=data.brandId
            const partNotInMasterData=[]
            for(let res of data.dealers){

               dealerId=res.DealerID
                const query1 = `
            DECLARE @sql NVARCHAR(MAX);
            SET @sql = N'SELECT COUNT(Yellow_line) as yellow_line_count 
                        FROM Create_Order_Request_TD001_' + @dealerId 
                        + ' WHERE DealerID = @dealerId AND BrandID=@brandId';
            EXEC sp_executesql @sql, N'@dealerId INT, @brandId INT', @dealerId, @brandId;
        `;
                const result=await pool.request()
                .input('dealerId',dealerId)
                .input('brandId',brandId)
                .query(query1);
                partNotInMasterData.push(result.recordset);
            }
            // console.log("part not in master data ",partNotInMasterData)
            await transaction.commit();
            return partNotInMasterData;
        }
        catch(error){
            console.log("error ",error.message)
            await transaction.rollback();
        }

    },

    getNoOfRequestApprovedBasedOnBrand:async function(data) {
        try{
            var pool=await sql.connect(config);
            var transaction=new sql.Transaction();
            await transaction.begin()
            new sql.Request(transaction);
            brandId=data.brandId
            const approvedRequest=[]
            for(let res of data.dealers){

               dealerId=res.DealerID
                const query1 = `
            DECLARE @sql NVARCHAR(MAX);
            SET @sql = N'SELECT COUNT(Current_status) as current_status_count 
                        FROM Create_Order_Request_TD001_' + @dealerId 
                        + ' WHERE DealerID = @dealerId AND BrandID=@brandId AND Current_status=''Approve''';
            EXEC sp_executesql @sql, N'@dealerId INT, @brandId INT', @dealerId, @brandId;
        `;
                const result=await pool.request()
                .input('dealerId',dealerId)
                .input('brandId',brandId)
                .query(query1);
                approvedRequest.push(result.recordset);
            }
            // console.log("approved request data ",approvedRequest)
            await transaction.commit();
            return approvedRequest;
        }
        catch(error){
            console.log("error ",error.message)
            await transaction.rollback();
        }
    },

    getNoOfRequestPendingBasedOnBrand:async function(data){
        try{
            var pool=await sql.connect(config);
            var transaction=new sql.Transaction();
            await transaction.begin()
            new sql.Request(transaction);
            brandId=data.brandId
            const pendingRequest=[]
            for(let res of data.dealers){

               dealerId=res.DealerID
                const query1 = `
            DECLARE @sql NVARCHAR(MAX);
            SET @sql = N'SELECT COUNT(Current_status) as current_status_count 
                        FROM CreateOrderRequestPending_TD001_' + @dealerId 
                        + ' WHERE DealerID = @dealerId AND BrandID=@brandId AND Current_status=''Pending''';
            EXEC sp_executesql @sql, N'@dealerId INT, @brandId INT', @dealerId, @brandId;
        `;
                const result=await pool.request()
                .input('dealerId',dealerId)
                .input('brandId',brandId)
                .query(query1);
                pendingRequest.push(result.recordset);
            }
            // console.log("pending request data ",pendingRequest)
            await transaction.commit();
            return pendingRequest;
        }
        catch(error){
            console.log("error ",error.message)
            await transaction.rollback();
        }
    },

    getNoOfRequestRejectedBasedOnBrand:async function(data){
        try{
            var pool=await sql.connect(config);
            var transaction=new sql.Transaction();
            await transaction.begin()
            new sql.Request(transaction);
            brandId=data.brandId
            const rejectedRequests=[]
            for(let res of data.dealers){

               dealerId=res.DealerID
                const query1 = `
            DECLARE @sql NVARCHAR(MAX);
            SET @sql = N'SELECT COUNT(Current_status) as current_status_count 
                        FROM Create_Order_Request_TD001_' + @dealerId 
                        + ' WHERE DealerID = @dealerId AND BrandID=@brandId AND Current_status=''Decline''';
            EXEC sp_executesql @sql, N'@dealerId INT, @brandId INT', @dealerId, @brandId;
        `;
                const result=await pool.request()
                .input('dealerId',dealerId)
                .input('brandId',brandId)
                .query(query1);
                rejectedRequests.push(result.recordset);
            }
            // console.log("rejected request data ",rejectedRequests)
            await transaction.commit();
            return rejectedRequests;
        }
        catch(error){
            console.log("error ",error.message)
            await transaction.rollback();
        }
    }
}