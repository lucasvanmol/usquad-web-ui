export default {
    host: process.env.HOST || "broker.emqx.io",
    port: parseInt(process.env.PORT) || 8083,
    clientID: process.env.CLIENT_ID || "clientID",
}