class ResponseHandler{
    static success(res,message,data,statusCode=200){
        console.log(message);
        
        res.status(statusCode).json({
            success:true,
            message,
            data
        })
    }
    static error (res, message, statusCode = 500, error = null) {
        res.status(statusCode).json({
          success: false,
          message,
          error: error ? error.message : undefined,
        });
      }
}

module.exports = ResponseHandler