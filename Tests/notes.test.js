const {server} = require("../index")
const mongoose = require("mongoose")
const Note = require("../Models/Note")
const {api,initialNotes,getAllContentFromNotes} = require("./helpers")


beforeEach(async ()=>{
    await Note.deleteMany({})

    for (const note of initialNotes){
        const noteObject = new Note(note)
        await noteObject.save()
    }

    // console.log("beforeeach")
    // const note1 = new Note(initialNotes[0])
    // await note1.save()
    // const note2 = new Note(initialNotes[1])
    // await note2.save()

},30000)

describe("GET /api/notes",()=>{
    test("notes are returned as json", async()=>{
        await api
            .get("/api/notes")
            .expect(200)
            .expect("Content-Type",/application\/json/)
    },30000)

    test("there are notes", async()=>{

        const {response} = await getAllContentFromNotes()
        expect(response.body).toHaveLength(initialNotes.length)
    },30000)

    test("the first note is about first note", async ()=>{
        const {contents} = await getAllContentFromNotes()
        expect(contents).toContain("primera nota")
    })
})

describe("POST /api/notes",()=>{
    test("a valid note ca be added",async ()=>{

        const newNote =
            {
                content:"nota de test",
                important: true
            }

        await api
            .post("/api/notes")
            .send(newNote)
            .expect(200)
            .expect("Content-Type",/application\/json/);

        const {response,contents} = await getAllContentFromNotes()

        expect(response.body).toHaveLength(initialNotes.length+1)
        expect(contents).toContain(newNote.content)
    })

    test("note without content cant be added",async ()=>{

        const newNote =
            {
                important: true
            }

        await api
            .post("/api/notes")
            .send(newNote)
            .expect(400)


        const {response} = await getAllContentFromNotes()

        expect(response.body).toHaveLength(initialNotes.length)
    })
})

describe("DELETE /api/notes/:id",()=>{
    test("a note can be deleted",async ()=>{

        const {response} = await getAllContentFromNotes()

        const noteTodelete = response.body[0]

        await api.delete(`/api/notes/${noteTodelete.id}`).expect(204)

        const {response:second,contents} = await getAllContentFromNotes()

        expect(second.body,).toHaveLength(initialNotes.length-1)
        expect(contents).not.toContain(noteTodelete.content)
    })

    test("a note that doesnt exist cannot be deleted",async ()=>{

        await api.delete(`/api/notes/1234`)
            .expect(400)

        const {response} = await getAllContentFromNotes()
        expect(response.body,).toHaveLength(initialNotes.length)

    },20000)
})

describe("PUT /api/notes/:id",()=>{

    test("a note can be edit",async ()=>{

        const {response} = await getAllContentFromNotes()

        const newNote = {
            content:"probando el put",
            important:false
        }

        await api.put(`/api/notes/${response.body[0].id}`).send(newNote)

        const {contents} = await getAllContentFromNotes()
        expect(contents).toContain(newNote.content)
    })

    test("a note that doesnt exist cannot be updated",async()=>{

        const newNote = {
            content:"probando el put",
            important:false
        }

        await api.put(`/api/notes/123`).send(newNote).expect(400)

        const {contents} = await getAllContentFromNotes()
        expect(contents).toBe(contents)

    })
})

afterAll(async()=>{
    await mongoose.connection.close()
    server.close()
})