// config.js
require('dotenv').config(); // Load environment variables from the .env file
const sql=require('mssql')
 module.exports={
   //  server: 'DESKTOP-ONAE3K9\\SQLEXPRESS01',  // Server name and instance
   //  database: 'Scope',
   //  driver:'msnodesqlv8',
   //  user:'newAdmin',
   //  password:'root',
   //  options: {
   //   trustedConnection:true,
   //   trustServerCertificate:true
   //  }

   server: '4.240.64.61',  // Server name and instance
   database: 'z_scope',
   port:1232,
   driver:'msnodesqlv8',
   user:'Kirti',
   password:'sadfs324@#$sdf',
   options: {
    trustedConnection:true,
    trustServerCertificate:true
   }

 }
