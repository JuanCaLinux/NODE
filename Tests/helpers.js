const supertest = require("supertest");
const {app} = require("../index");

const api = supertest(app)
const initialNotes =[
    {
        content: "primera nota",
        date:new Date(),
        important: false
    },
    {
        content: "segunda nota",
        date:new Date(),
        important: true
    }
]

const getAllContentFromNotes = async ()=>{
    const response = await api.get("/api/notes")

    return{
        contents : response.body.map(note=>note.content),
        response
    }

}

module.exports={initialNotes,api,getAllContentFromNotes}

