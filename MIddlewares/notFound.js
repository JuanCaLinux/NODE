module.exports = (request,response)=>{
  console.log("no existe la ruta");
  response.status(404).json({
    error: "not found"
  })
}