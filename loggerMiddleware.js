const logger = ((request,response,next)=>{
  console.log("METHOD:",request.method)
  console.log("PATH:",request.path)
  console.log("--------------")
  next()
})

module.exports = logger