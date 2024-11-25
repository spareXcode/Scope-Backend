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
    trustServerCertificate:true,
    encrypt:true
   },

   connectionTimeout: 30000, // Set a higher timeout value (e.g., 30 seconds)
   requestTimeout: 30000,
   pool: {
    max: 100, // Set max pool size to 50
    min: 0,  // Minimum number of connections
    idleTimeoutMillis: 30000 // Time (in ms) before a connection is considered idle and can be closed
}
 }
