import { Server } from './server';

let server = new Server().app
let port = process.env.PORT || 3900;

server.listen(port, () => {
    console.log(`Server connected successfully at port ${port}`)
});