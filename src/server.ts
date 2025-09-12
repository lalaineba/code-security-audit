import app from "./app";

// import server type definition
import { Server } from "http";

// initialize a port as either a string or 3000 by default
const PORT: string | 3000 = process.env.PORT || 3000;

// initialize server for the application to listen for requests on the specified ports
const server: Server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default server;