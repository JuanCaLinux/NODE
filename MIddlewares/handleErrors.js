module.exports= (error,request,response,next) =>{
  console.log(error.name)
  if(error.name === "CastError"){
    response.status(400).send({error:"id is used malformed"})
  }else{

    response.status(500).end()
  }
}