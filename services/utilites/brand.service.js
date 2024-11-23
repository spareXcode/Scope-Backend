const config=require('../../dbConfig')
const sql=require('mssql');
module.exports={
    getBrands:async function(){
        try{
            console.log("config ",config);
            
            console.log(typeof config.port, config.port);
            const pool = await sql.connect(config);
      console.log('Connected to the database successfully!');
      // Begin a transaction for inserting data
      const transaction = new sql.Transaction();
      await transaction.begin();
  
      const request = new sql.Request(transaction);
      const query = `
         Select bigid,vcbrand from Brand_Master
        `;
  
        // Execute the insert query for each row
       const result= await pool.request()
          .query(query);
      
  
      // Commit the transaction
      await transaction.commit();
      console.log('Data fetched successfully.');
      
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