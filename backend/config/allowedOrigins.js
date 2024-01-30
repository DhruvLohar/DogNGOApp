require("dotenv").config();

const allowedOrigins = [
    "http://localhost:8081",
    "http://j-app.in", "http://www.j-app.in", 
    "https://j-app.in", "https://www.j-app.in", 
    "http://api.j-app.in", "https://api.j-app.in",
    
    "https://mb.j-app.in", "http://mb.j-app.in",
    "https://kd.j-app.in", "http://kd.j-app.in",
    "https://ic.j-app.in", "http://ic.j-app.in",
    "https://nk.j-app.in", "http://nk.j-app.in",
    process.env.REMOTE_CLIENT_APP];

module.exports = allowedOrigins;