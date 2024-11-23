const stockUploadService=require('../stock-upload/stock-upload.service')
const config=require('../../dbConfig');
const sql=require('mssql')
module.exports={
    processBulkStock:async function(req,res){
        try{
            const excelData=await stockUploadService.readExcelFile(req.file.path);
            await processExcelFile(req,res,excelData);
        }
        catch(error){
            res.send({status:200,message:"Stock is not uploaded successfully"})
        }
    },
    
    processExcelFile: async function (req,res,excelData) {
        const filePath = req.file.path;
        const fileData = await readExcelFile(filePath);
        console.log("req brand id",req.body.brand_id)
        const brandID = req.body.brand_id;
        const pool = await sql.connect(config);
        const mappedColumnsQuery = `Select * from SIMS_MAPPING where brand_id=@brandID`;
        // Execute the query with the parameterized value
        const mappedColumnsResult = await pool
        .request()
        .input("brandID", sql.BigInt, brandID)
        .query(mappedColumnsQuery);
        // console.log("req body ",req.body.mapping_id)
        const mappedColumns = mappedColumnsResult.recordset;
        // You can access the result here
        console.log("mapped columns",mappedColumns); // Logs the data fetched from the query
        // console.log("header result",fileData.headers);
      
        partNumberColumnName=mappedColumns[0].part_number;
        qtyColumnName=mappedColumns[0].stock_qty;
        locColumnName=mappedColumns[0].loc
        // console.log(partNumberColumnName,qtyColumnName)
        // Extract rows with PartNo and Quantity values
        const parsedData = fileData.data.map((row) => ({
          part_number: row[partNumberColumnName],
          quantity: row[qtyColumnName],
          location:row[locColumnName]
        }));
        //  console.log("parsed data ",parsedData);
        await insertDataToDatabase(parsedData,req);
        return parsedData;
      },
      
      // Function to insert data into the SQL Server database
      insertDataToDatabase:   async function (excelData,req) {
        try {
          
          // Connect to the SQL Server database
          const pool = await sql.connect(config);
          console.log("Connected to the database successfully!");
          // Begin a transaction for inserting data
          const transaction = new sql.Transaction();
          await transaction.begin();
      
          // Prepare the SQL query for inserting data into SIMS_STOCK_FILE
          const request = new sql.Request(transaction);
          for(const row of excelData){
            const {part_number,quantity,locId,added_by,stock_date}=row;

            const query=`Select su_id from SIMS_SU where locationId=@locId`
            const result=await pool.request()
            .input('locId',sql.BigInt,locId)
            .query(query);

            if(result.recordset.length>0){
                su_id=result.recordset[0].su_id;
                const updateQuery=`UPDATE SIMS_SU SET added_on=@added_on where su_id=@su_id`;

                await pool.request()
                .input('su_id',sql.BigInt,su_id).query(updateQuery);
            }
            else{
                const insertQuery=`INSERT INTO SIMS_SU(location_id ,added_by,stock_date) OUTPUT inserted.*
                values(@locId,@added_by,@stock_date)`

              const insertQueryResult=  await pool.request()
                .input('locId',sql.BigInt,locId)
                .input('added_by',sql.BigInt,added_by)
                .input('stock_date',sql.NVarChar,stock_date)
                .query(insertQuery)

                const resultedData=insertQueryResult.recordset[0]
                su_id=resultedData.su_id;

                const stockInsertQuery= `INSERT INTO SIMS_STOCK_FILE(su_id,part_number,quantity) 
                values(@su_id,@part_number,@quantity)`

                await pool.request()
                .input('su_id',sql.BigInt,su_id)
                .input('part_number',sql.NVarChar,part_number)
                .input('quantity',sql.BigInt,quantity)
                .query(stockInsertQuery)

                const query2=`SELECT COUNT(*) as count_of_parts from SIMS_STOCK_FILE`;

                const result2=await pool.request().query(query2);
                const count_of_parts=result2.recordset[0].count_of_parts;

                const query3=`SELECT SUM(quantity) as sum_of_quantity from SIMS_STOCK_FILE where su_id=@su_id`;
                const result3=await pool.request()
                .input('su_id',sql.BigInt,su_id)
                .query(query3);

                const sum_of_quantity=result3.recordset[0].sum_of_quantity;
                
                logsQuery=`INSERT INTO SIMS_SU_LOGS(location_id,count_of_parts,sum_of_quantity)
                values(@locId,@count_of_parts,@sum_of_quantity)`

                await pool.request()
                .input('locId',sql.BigInt,locId)
                .input('count_of_parts',sql.BigInt,count_of_parts)
                .input('sum_of_quantity',sql.BigInt,sum_of_quantity)
                .query(logsQuery)
            }

          }
         
          await transaction.commit();
          console.log("Data inserted successfully.");
        } catch (error) {
          console.error("Error inserting data:", error);
          await transaction.rollback(); // Rollback in case of error
        } finally {
          // Close the SQL Server connection
          await sql.close();
        }
      }
}