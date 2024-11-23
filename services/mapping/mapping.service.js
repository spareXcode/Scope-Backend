const sql=require('mssql');
const config=require('../../dbConfig');
module.exports={
    mappedColumns:async function(req,res){
        try{
            const pool = await sql.connect(config);
      console.log('Connected to the database successfully!');
      // Begin a transaction for inserting data
      const transaction = new sql.Transaction();
      await transaction.begin();
  
      // Prepare the SQL query for inserting data into SIMS_STOCK_FILE
      
      const request = new sql.Request(transaction);
    //   console.log("req ",req)
      const {part_number,stock_qty,added_by,loc,brand_id}=req
      const query = `
          INSERT INTO SIMS_MAPPING(brand_id,part_number, stock_qty,loc, added_on, added_by)
          VALUES (@brand_id,@part_number, @stock_qty, @loc, GETDATE(), @added_by);
        `;
  
        // Execute the insert query for each row
        await pool.request().input('brand_id', sql.BigInt, brand_id)
          .input('part_number', sql.NVarChar, part_number)
          .input('stock_qty',sql.NVarChar, stock_qty)
          .input('added_by', sql.BigInt, added_by)
          .input('loc',sql.VarChar,loc)
          .query(query);
      
  
      // Commit the transaction
      await transaction.commit();
      console.log('Data inserted successfully.');
        }
        catch(err){
            console.log("error in mapping columns",err.message);
            await transaction.rollback(); 
        }finally {
            // Close the SQL Server connection
            await sql.close();
          }
    }
}