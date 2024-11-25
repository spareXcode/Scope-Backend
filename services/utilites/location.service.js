const config=require('../../dbConfig')
const sql=require('mssql')
module.exports={
    // getLocations:async function(req){
    //     try{
    //         const pool = await sql.connect(config);
    //   console.log('Connected to the database successfully!');
    //   // Begin a transaction for inserting data
    //   const transaction = new sql.Transaction();
    //   await transaction.begin();
    //   brand_id=req.brand_id;
    //   dealer_id=req.dealer_id;
    //   const request = new sql.Request(transaction);
    //   const query = `
    //      Select LocationID,Location from LocationInfo where brandID=@brand_id and dealerID=@dealer_id
    //     `;
  
    //     // Execute the insert query for each row
    //    const result= await pool.request()
    //    .input('brand_id',brand_id)
    //    .input('dealer_id',dealer_id)
    //       .query(query);
      
    //       // console.log("result ",result.recordset)
    //   // Commit the transaction
    //   await transaction.commit();
    //   console.log('Data fetched successfully.');
    // //   console.log("result ",result.recordset);
      
    //   return result.recordset 
    //     }
    //     catch(err){
    //         console.log("error in fetching data",err.message);
    //         await transaction.rollback(); 
    //     }finally {
    //         // Close the SQL Server connection
    //         await sql.close();
    //       }
    // },

    getLocations:async function(req){
      try{
          const pool = await sql.connect(config);
    console.log('Connected to the database successfully!');
    // Begin a transaction for inserting data
    const transaction = new sql.Transaction();
    await transaction.begin();
    dealer_id=req.dealer_id;
    const request = new sql.Request(transaction);
    const query = `
       Select LocationID,Location from LocationInfo where dealerID=@dealer_id
      `;

      // Execute the insert query for each row
     const result= await pool.request()
     .input('dealer_id',dealer_id)
        .query(query);
    
        console.log("result ",result.recordset)
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