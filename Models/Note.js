const mongoose = require("mongoose")
const {Schema,model} = mongoose

const noteSchema = new Schema({
  content: String,
  date:Date,
  important:Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
})


/*para que devuelva la nota en formato json como la queremos sin lo que pone por defecto mongo pero no se altera la base de datps*/
noteSchema.set("toJSON",{
  transform:(document,returnedObject)=>{
    returnedObject.id=returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = model("Note",noteSchema)

module.exports = Note

// Note.find({}).then(result=>{
//   console.log(result)
//   mongoose.connection.close()
// })

// const  note = new Note ({
//   content: "HOLA, UTILIZANDO ESQUEMAS Y MODELOS",
//   date:new Date,
//   important:true
// })
//
// note.save()
// .then(result=>{
//   console.log(result)
//   mongoose.connection.close()
// }).catch(err =>{
//   console.error(err)
// })