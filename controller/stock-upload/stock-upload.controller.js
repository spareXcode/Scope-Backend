const stockUploadService=require('../../services/stock-upload/stock-upload.service')

module.exports={
    uploadFile:async function(req,res) {
        
        try{

        // Call service to process the uploaded Excel file
        const result = await stockUploadService.processExcelFile(req);
    
        // Send back the data to the client
        res.json({ message: 'File processed successfully', data: result });
      } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ error: 'Failed to process the Excel file' });
      }
    
}
}