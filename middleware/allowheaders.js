module.exports= (req,res,next) => {
  res.setHeader(
    "Access-Control-Allow-Origin" , 
    "*"
  )
  res.setHeader(
    "Access-Control-Allow-Methods" , 
    "GET,PUT,POST,HEAD,PATCH,OPTIONS"
  )
  res.setHeader(
    "Access-Control-Allow-Methods" , 
    "GET,PUT,POST,HEAD,PATCH,OPTIONS"
  )
  res.setHeader(
    "Access-Control-Allow-Headers" , 
    "Content-Type"
  )
next()
}