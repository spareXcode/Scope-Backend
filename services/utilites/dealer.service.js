const config=require('../../dbConfig')
const sql=require('mssql');
module.exports={
    getDealersBasedOnBrandID:async function(req){
        try{
            const pool = await sql.connect(config);
      console.log('Connected to the database successfully!');
      // Begin a transaction for inserting data
      const transaction = new sql.Transaction();
      await transaction.begin();
  
      // Prepare the SQL query for inserting data into SIMS_STOCK_FILE
      brand_id=req.brand_id;
      await new sql.Request(transaction);
      const query = `
         Select bigid,vcName from Dealer_Master where BrandID=@brand_id;
        `;
  
        // Execute the insert query for each row
       const result= await pool.request()
       .input('brand_id',brand_id)
          .query(query);
      
          // console.log("result ",result.recordset)
      // Commit the transaction
      await transaction.commit();
      console.log('Data fetched successfully.');
    //   console.log("result ",result.recordset);
      
      return result.recordset 
        }
        catch(err){
            console.log("error in fetching data",err.message);
            await transaction.rollback(); 
        }finally {
            // Close the SQL Server connection
            await sql.close();
          }
        
    }
}