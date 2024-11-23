const { log } = require("console");
const XLSX = require("xlsx");
const config = require("../../dbConfig");
const sql = require("mssql");
async function readExcelFile(filePath) {
  try {
    // console.log("filePath ",filePath)
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    // Process each sheet
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert worksheet to JSON data
    let data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); //1st row as header

    // Function to clean column names (headers)
    function cleanColumnNames(headers) {
      columnNames = headers.map((col) => cleanColumnesText(col));
      return columnNames;
    }
    const cleanedHeaders = cleanColumnNames(data[0]); // First row is the headers
    const cleanedData = data.slice(1); // Remove the header row from the data

    // Map over each row and clean the values based on the cleaned headers
    const cleanedRows = cleanedData.map((row) => {
      return cleanedHeaders.reduce((acc, header, index) => {
        acc[header] = cleanRowData(row[index]); // Clean the data values as well
        return acc;
      }, {});
    });

    // console.log("cleaned rows ", cleanedRows);
    function cleanColumnesText(str) {
      convertedStr = String(str);
      str2 = convertedStr.replace(/[\?#&_\-+=}{[\]!@`~$%^()\/?]+/g, "").trim()// Remove spaces, ?, and #,-,...etc
      return str2
    }
    function cleanRowData(str) {
      if(str<0 )
      {
        str=0;
      }
      convertedStr = String(str);
      // console.log("converted str ",str)
      return convertedStr.replace(/[]+/g, "").trim();
    }

    // Initialize an object to store sheet data
    const result = {
      headers: cleanedHeaders,
      data: cleanedRows,
    };
    console.log("excel headers ",result.headers)
    return result;
  } catch (error) {
    console.error("Error processing Excel file:", error);
    throw new Error("Failed to read the Excel file");
  }
}
async function processExcelFile(req) {
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
  // console.log(partNumberColumnName,qtyColumnName)
  // Extract rows with PartNo and Quantity values
  const parsedData = fileData.data.map((row) => ({
    part_number: row[partNumberColumnName],
    quantity: row[qtyColumnName],
  }));
  //  console.log("parsed data ",parsedData);
  await insertDataToDatabase(parsedData,req);
  return parsedData;
}

// Function to insert data into the SQL Server database
async function insertDataToDatabase(excelData,req) {
  try {
    
    // console.log("config ",config);

    // Connect to the SQL Server database
    const pool = await sql.connect(config);
    console.log("Connected to the database successfully!");
    // Begin a transaction for inserting data
    const transaction = new sql.Transaction();
    await transaction.begin();

    // Prepare the SQL query for inserting data into SIMS_STOCK_FILE
    const request = new sql.Request(transaction);
    const { brand_id,dealer_id,location_id,stock_date,added_by } = req.body;
    let su_id=0;
 
    const query2=`Select su_id as suId from SIMS_SU where location_id=@location_id`; 
    const resultedLocationId=await pool.request()
    .input('location_id', sql.BigInt, location_id) .query(query2);
    // suId=resultedLocationId.recordset[0].suId;

    
    if(!resultedLocationId.recordset.length){
      
      const stockUpload_Query=`INSERT INTO SIMS_SU(brand_id,dealer_id,location_id,stock_date,added_by) 
      VALUES(@brand_id,@dealer_id,@location_id,@stock_date,@added_by)`
      const result =await pool
      .request()
      .input("brand_id", sql.BigInt, brand_id)
      .input("dealer_id", sql.BigInt, dealer_id)
      .input("location_id", sql.BigInt, location_id)
      .input('stock_date',sql.VarChar,stock_date)
      .input('added_by',sql.VarChar,added_by)
      .query(stockUpload_Query);

    }
    else{
      su_id=resultedLocationId.recordset[0].suId
      const deleteExistedDataQuery=`DELETE from SIMS_STOCK_FILE where su_id=su_id`
      const result=await pool.request()
      .input("su_id",sql.BigInt,su_id).query(deleteExistedDataQuery)

      const updateQuery = `UPDATE SIMS_SU SET added_on = @added_on WHERE su_id = @su_id`;
      const utcDate = new Date();
      const indiaOffset = 5.5 * 60; // IST offset in minutes
      const indiaTime = new Date(utcDate.getTime() + indiaOffset * 60000);
      // console.log("india time ",indiaTime,indiaTime.toISOString())
    const result1 = await pool.request()
    .input('added_on', sql.DateTime, indiaTime.toISOString()) 
    .input('su_id', sql.Int, su_id)              
    .query(updateQuery);
      console.log("existed location id ",su_id)
    }

    location_ID=req.body.location_id;
    const query1=`Select su_id from SIMS_SU where location_id=@location_ID`;
    
    const resultedId=await pool.request()
    .input('location_id', sql.BigInt, location_ID) .query(query1);
    // console.log("result stock upload ",resultedId.recordset)

     su_id=resultedId.recordset[0].su_id;
    console.log("su_id ",resultedId.recordset,su_id)
    // Loop through the Excel data and insert each row into the table
    for (const row of excelData) {
      // console.log("row ",row,excelData)
      const { part_number, quantity  } = row;
      let convertedQuantity = Math.floor(quantity * 100) / 100;

      if(convertedQuantity>0.00){
        const query = `
            INSERT INTO SIMS_STOCK_FILE (su_id, part_id, quantity)
            VALUES (@su_id, @part_number, @convertedQuantity);
          `;
  
        // Execute the insert query for each row
        await pool
          .request()
          .input("su_id", sql.BigInt, su_id)
          .input("part_number", sql.NVarChar, part_number)
          .input("convertedQuantity", sql.Decimal(18, 2), convertedQuantity)
          .query(query);
      }

      }
    const countPartsQuery=`SELECT COUNT(part_id) as count_of_parts from SIMS_STOCK_FILE where su_id=@su_id`

    const countPartsResult=await pool.request()
    .input('su_id',sql.BigInt,su_id).query(countPartsQuery);

    const count_of_parts=countPartsResult.recordset[0].count_of_parts;
    console.log("count parts ",count_of_parts);

    const sumQuantityQuery=`SELECT SUM(quantity) as sumQuantity from SIMS_STOCK_FILE where su_id=@su_id`

    const sumQuantityResult=await pool.request()
    .input('su_id',sql.BigInt,su_id)
    .query(sumQuantityQuery)
     const sum_of_quantity=sumQuantityResult.recordset[0].sumQuantity;
    console.log("sum of quantity ",sum_of_quantity)

    const logsQuery=`INSERT INTO SIMS_SU_LOGS(location_id,added_by,count_of_parts,sum_of_quantity)
    VALUES(@location_id,@added_by,@count_of_parts,@sum_of_quantity)`

    await pool
      .request()
      .input('location_id',sql.BigInt,location_id)
      .input('added_by',sql.BigInt,added_by)
      .input('count_of_parts',sql.BigInt,count_of_parts)
      .input('sum_of_quantity',sql.Decimal(18,2),sum_of_quantity)
      .query(logsQuery)
    // Commit the transaction
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

module.exports = {
  processExcelFile,
  readExcelFile,
};
