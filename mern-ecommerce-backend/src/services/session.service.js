const redis = require("redis");
const { newSessionId, hashToken } = require("./token.service");


const REFRESH_TTL = () => {
    const raw = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
    const m = /^(\d+)([smhd])$/.exec(raw);
    if (!m) return 7 *  86400; // 7 days in seconds
    const [,n , unit] = m;
    const mul = { s: 1, m:60, h:3600, d:86400 }[unit];
    return Number(n) * mul;
};


const sessionKey = (sid) => `auth:session:${sid}`;

const saveSession = async ({userId, refreshToken, userAgent}) => {
    const sid = newSessionId();
    const refreshHash = hashToken(refreshToken);

    await redis.hset(sessionKey(sid)), {
        userId: userId.toString(),
        refreshHash: refreshHash,
        createdAt: new Date.toISOString(),
        ua: userAgent || "unknown,"
    }
}


const getSession = async (sid) => {
    const data = await redis.hgetall(sessionKey(sid));
    if (!data || Object.keys(data).length === 0 ) return null;
    return data;
};

const deleteSession = async (sid) => {
    await redis.del(sessionKey(sid));
}

const rotateSession = async ({oldSid, userId, newRefreshToken, userAgent}) => {
    await deleteSession (oldsid);
    return saveSession({userId, refreshToken: newRefreshToken, userAgent });
};

module.exports = {saveSession, getSession, deleteSession, rotateSession};