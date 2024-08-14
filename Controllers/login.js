const bcrypt = require("bcrypt")
const jwt =  require("jsonwebtoken")
const loginRouter = require("express").Router()
const User = require("../Models/User")

loginRouter.post("/", async(request,response)=>{
  const {body} = request
  const{userName,password}=body

  const user = await User.findOne({userName})
  const passwordCorrect = user === null ? false
    :await bcrypt.compare(password,user.passwordHash)

  if (!(user && passwordCorrect)){
    response.status(401).json({error:"invalid user or password"})
  }

  const userForToken ={
    id:user._id,
    username:user.userName
  }

  const token = jwt.sign(userForToken,process.env.SECRET,
    {
      expiresIn:60*60*24*7 //para que cada 7 dias tenga que iniciar sesion de nuevo y no se quede guardada la sesion
    })

  response.send({
    name: user.name,
    userName: user.userName,
    token
  })
})

module.exports = loginRouter
