const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const server = require('http').Server(app);
const io = require('socket.io')(server); 

io.set('origins', '*:*');
//io.origins('*:*') // for latest version
mongoose.connect('mongodb+srv://<bd name>:<password>@cluster0-olv0g.mongodb.net/test?retryWrites=true&w=majority', 
{ userNewUrlParcer: true, });

//the midleys are interceptors meaning it leaves nothing behind it so we should add the next
//what comes after this midly will have access to io
app.use((req, res , next ) => {
    req.io = io;
    next();
})

app.use(cors());//allows any application to access the backend
app.use('/files', express.static(path.resolve(__dirname,'..','uploads', 'resized')));
app.use(require('./routes'));

server.listen(3333);


