const bcrypt = require('bcrypt');
const User = require("../Models/User")
const {api} = require("./helpers")
const mongoose = require("mongoose");
const {server} = require("../index");


beforeEach(async()=>{
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd',10)

    const user = new User({userName:"juantest", passwordHash})

    await user.save()
},30000)

test("creating a new user", async () => {
    const usersDB = await User.find({})
    const usersAtStart = usersDB.map(user=>user.toJSON())

    const newUser = {
        userName:"juantest2",
        name:"carlos2",
        password:"juanc"
    }

    await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type",/application\/json/)

    const usersDBAfter = await User.find({})
    const usersAtEnd = usersDBAfter.map(user=>user.toJSON())

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const userNames = usersAtEnd.map(u=>u.userName)
    expect(userNames).toContain(newUser.userName)
},300000);

test("creation fails with proper statuscode and message if username isalrady taken", async()=>{
    const usersDB = await User.find({})
    const usersAtStart = usersDB.map(user=>user.toJSON())

    const newUser = {
        userName:"juantest",
        name:"carlos3",
        password:"juan1234"
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type",/application\/json/)

    const usersDB2 = await User.find({})
    const usersAtEnd = usersDB2.map(user=>user.toJSON());

    expect(usersAtEnd).toHaveLength(usersAtStart);
},300000)

afterAll(async()=>{
    await mongoose.connection.close()
    server.close()
})