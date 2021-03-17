const path = require("path");
const express = require("express");
const process = require("process");

const DIST_DIR = path.join(__dirname, "dist");
const PORT = parseInt(process.env.PORT || '8080')
const app = express();

//Serving the files on the dist folder
app.use(express.static(DIST_DIR));

//Send index.html when the user access the web
app.get("*", function (req, res) {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
    console.log('Kill signal recieved, shutting down');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
}