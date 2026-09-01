const apiResponse =(statusCode,data=null,message="")=>({
    success:statusCode<400,
    statusCode,
    data,
    message
});

module.exports = apiResponse;