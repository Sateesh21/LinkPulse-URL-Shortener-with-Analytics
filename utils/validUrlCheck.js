const axios = require("axios");

const validUrlCheck = async (url) => {
    try {
        await axios.head(url, {
            timeout: 5000,
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        return true;
    } catch (error) {
        // some servers don't support HEAD — try GET as fallback
        try {
            await axios.get(url, {
                timeout: 5000,
                headers: { "User-Agent": "Mozilla/5.0" }
            });
            return true;
        } catch (err) {
            return false;
        }
    }
};

module.exports = validUrlCheck;