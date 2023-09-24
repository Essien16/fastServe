import { Server } from './server';

let server = new Server().app
let port = 3500

server.listen(port, () => {
    console.log(`Server connected successfully at port ${port}`)
});