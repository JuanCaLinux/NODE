const bcrypt = require('bcrypt');
const usersRouter = require("express").Router()
const User = require("../Models/User")

usersRouter.get("/",async(request,response)=>{
    const users = await User.find({}).populate("notes",{
        content:1,
        date:1
    })
    response.json(users)
})
usersRouter.post("/",async(request,response) => {
try {
    const { body } = request
    const { userName, name, password } = body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        userName,
        name,
        passwordHash
    })
    const savedUser = await user.save()
    response.status(201)
    response.json(savedUser)
}catch (error){
    response.status(400)

}

})

module.exports = usersRouter