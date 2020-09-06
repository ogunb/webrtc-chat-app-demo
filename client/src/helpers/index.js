export function getRTCConfig() {
    const ICE_SERVERS = JSON.parse(process.env.ICE_SERVERS);
    const configuration = Object.freeze({
        iceServers: ICE_SERVERS,
    });
    return configuration
}
