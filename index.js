require("./ConexionBD/mongo") /*importa la clase mongo o mas bien la ejecuta que es la que se conecta a la DB*/
const express = require("express") /*forma de importar*/
const logger = require("./MIddlewares/loggerMiddleware")
const notFound = require("./MIddlewares/notFound")
const handleErrors = require("./MIddlewares/handleErrors")
const cors = require('cors')
const Note = require("./Models/Note")
const mongoose = require("mongoose")
const usersRouter = require("./Controllers/users")
const loginRouter = require("./Controllers/login")
const User = require("./Models/User")
const userExtractor = require("./MIddlewares/userExtractor")

/*DECIR QUE LA APP VA A USAR EXPRESS*/
const app = express()
app.use(cors()) //dependencia que se instala para que acepte que cualquiera use nuestra api

/*PARA QUE SE PUEDA ENVIAR UN JSON EN EL POST*/
app.use(express.json()); //middleware
app.use(logger) /*middleware para ver que se ejecuta cada que cambia*/

/*ESTO ES LA PAGINA DE BIENVENIDA */
app.get("/",(request,response)=>{
    response.send("<h1>HELLO WORLD</h1>")
})

/*OBTENER TODAS LAS NOTAS*/
app.get("/api/notes",async (request,response)=> {
    // Note.find({}).then(notes=>{
    //     response.json(notes)
    // })

    const notes = await Note.find({}).populate("user",{
      userName:1,
      name:1
    })
    response.json(notes)

})

/*OBTENER UNA NOTA EN CONCRETO*/
app.get("/api/notes/:id",async (request,response,next)=>{
   const id = request.params.id

    try{
        const note = await Note.findById(id)
        note ? response.json(note): response.status(404).end
    }catch (err){
       next(err)
        response.status(400).end
    }



    // Note.findById(id).then(note=>{
    //     if (note){
    //         response.json(note)
    //     }else{
    //         response.status(404).end()
    //     }
    // }).catch(err=>{
    //     next(err)
    //     console.log(err)
    //     response.status(400).end()
    // })


})

/*MODIFICAR UNA NOTA*/
app.put("/api/notes/:id",userExtractor,(request,response,next)=>{
    const {id} = request.params
    const note = request.body

    const newNoteInfo ={
        content:note.content,
        important:note.important
    }

    Note.findByIdAndUpdate(id,newNoteInfo,{new:true})
      .then(result=>{
          response.json(result)
      }).catch(next)
})
/*BORRAR UNA NOTA EN CONCRETO*/
app.delete("/api/notes/:id",userExtractor,(request,response,next)=>{

    const id = request.params.id

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return response.status(400).send('Invalid note ID format hola');
    // }
    Note.findByIdAndDelete(id).then(()=>{
        response.status(204).end()
    }).catch(err=>{
        next(err)
    })

})


/* CREAR UNA NUEVA NOTA */
app.post("/api/notes",userExtractor,async (request,response,next)=>{
     const {content,important = false} = request.body

  //usando middleware user extractor para recuperar el usuario
  const {userId} = request

     const user = await User.findById(userId)

    if(!content){
        return response.status(400).json({
            error:"note.content is missing"
        })
    }

    const newNote = new Note({
        content: content,
        date: new Date(),
        important,
        user: user._id
    })

    // newNote.save()
    //   .then(savedNote=>{
    //     response.json(savedNote)
    // })

    const savedNote =  await newNote.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    response.json(savedNote)

})

app.use("/api/users",usersRouter)
app.use("/api/login",loginRouter)

app.use(notFound)
app.use(handleErrors)

/*SE PONE UN SERVIDOR Y HACE QUE LA APP EMPIEZE A ESCUCHAR EN ESE SERVIDOR, QUE LO OCUPE BASICAMENTE*/
const PORT = process.env.PORT || 3001
const server = app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})

module.exports = {app}