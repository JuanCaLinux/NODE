const express = require("express") /*forma de importar*/
const logger = require("./loggerMiddleware")
const cors = require('cors')

/*DECIR QUE LA APP VA A USAR EXPRESS*/
const app = express()

/*PARA QUE SE PUEDA ENVIAR UN JSON EN EL POST*/
app.use(cors()) //dependencia que se instala para que acepte que cualquiera use nuestra api
app.use(express.json()); //middleware
app.use(logger)

let notes =[
    {
        userId: 1,
        id: 1,
        title: "hola",
        body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
    },
    {
        userId: 1,
        id: 2,
        title: "segunda",
        body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
    },
    {
        userId: 1,
        id: 3,
        title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
        body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
    }
]

/*
ASI SE CREABA SIN EXPRESS EL SERVIDOS

const app = http.createServer((request,response)=> {
    response.writeHead(200,{"Content-Type":"application/json"})
    response.end(JSON.stringify(notes))
}
)*/

/*ESTO ES LA PAGINA DE BIENVENIDA */
app.get("/",(request,response)=>{
    response.send("<h1>HELLO WORLD</h1>")
})

/*OBTENER TODAS LAS NOTAS*/
app.get("/api/notes",(request,response)=>{
    response.json(notes)
})

/*OBTENER UNA NOTA EN CONCRETO*/
app.get("/api/notes/:id",(request,response)=>{
   const id = Number(request.params.id)
    const note = notes.find(note=>note.id===id)

    if (note){
        response.json(note)
    }else{
        response.status(404).end()
    }
})

/*BORRAR UNA NOTA EN CONCRETO*/
app.delete("/api/notes/:id",(request,response)=>{
    const id = Number(request.params.id)
    notes = notes.filter(note=>note.id !== id)
    response.status(404).end()
})


/* CREAR UNA NUEVA NOTA */
app.post("/api/notes",(request,response)=>{
    const note = request.body

    if(!note || !note.body || !note.title){
        return response.status(400).json({
            error:"note.body is missing or note.title is missing"
        })
    }

    const ids = notes.map(note =>note.id);
    const maxId = Math.max(...ids) //siempre las anteriores ids para que si alguien al mismo tiempo sobreescribe la api, no haya error

    const newNote ={
        userId:maxId+1,
        id: maxId +1,
        title:note.title,
        body:note.body
    }

    notes = [...notes,newNote]
    response.status(201).json(newNote)
})

app.use((request,response)=>{
    console.log("no existe la ruta");
    response.status(404).json({
        error: "not found"
    })
})


/*SE PONE UN SERVIDOR Y HACE QUE LA APP EMPIEZE A ESCUCHAR EN ESE SERVIDOR, QUE LO OCUPE BASICAMENTE*/
const PORT = 3001
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})
