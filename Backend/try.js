console.log("hey soham")
const http = require('http');

http.createServer((req,res)=>{
    console.log(req)
}).listen(5500,()=>{
    console.log('server is live !')
})