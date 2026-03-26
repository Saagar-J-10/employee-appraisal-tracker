const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()

// Middleware
app.use(express.json())

// 🔥 SERVE STATIC FILES (VERY IMPORTANT)
app.use(express.static(path.join(__dirname, "public")))


// ===================== LOGIN =====================
app.post("/login", (req, res) => {

  const { username, password, role } = req.body

  try {
    const users = JSON.parse(
      fs.readFileSync(path.join(__dirname, "users.json"), "utf-8")
    )

    const user = users.find(u =>
      u.username === username &&
      u.password === password &&
      u.role === role
    )

    if(user){
      res.json({ success: true, role: user.role })
    } else {
      res.json({ success: false })
    }

  } catch(err){
    console.log(err)
    res.status(500).json({ success: false })
  }

})


// ===================== SAVE DATA =====================
app.post("/save", (req, res) => {

  try {
    const filePath = path.join(__dirname, "data.json")

    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2))

    res.json({ success: true })

  } catch(err){
    console.log(err)
    res.status(500).json({ success: false })
  }

})


// ===================== GET DATA =====================
app.get("/data", (req, res) => {

  try {
    const filePath = path.join(__dirname, "data.json")

    if (!fs.existsSync(filePath)) {
      return res.json({})
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))

    res.json(data)

  } catch(err){
    console.log(err)
    res.json({})
  }

})


// ===================== DEFAULT ROUTE =====================
// 🔥 THIS FIXES YOUR ERROR
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"))
})


// ===================== START SERVER =====================
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000")
})