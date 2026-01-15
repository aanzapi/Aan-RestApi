const axios = require("axios");

const tokens = [
    "315ee94ea5fb3439757bc2c75db908589cfc53113ac1be1cd38f5e0772db6caf"
];

let currentTokenIndex = 0;

/**
 * Execute reaction to WA channel post using rotating tokens
 */
async function reactToChannel(postUrl, emojis) {
    let attempts = 0;
    const maxAttempts = tokens.length;

    while (attempts < maxAttempts) {

        const apiKey = tokens[currentTokenIndex];

        try {
            const response = await axios({
                method: "POST",
                url: `https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/channel/react-to-post?apiKey=${apiKey}`,
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'content-type': 'application/json',
                    'origin': 'https://asitha.top',
                    'referer': 'https://asitha.top/',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139 Mobile Safari/537.36'
                },
                data: {
                    post_link: postUrl,
                    reacts: Array.isArray(emojis) ? emojis : [emojis]
                }
            });

            return {
                success: true,
                data: response.data
            };

        } catch (err) {
            const e = err.response?.data || err.message;

            // Token limit → pindah
            if (err.response?.status === 402 ||
                e?.message?.includes("limit") ||
                e?.message?.includes("Limit")) {
                currentTokenIndex = (currentTokenIndex + 1) % tokens.length;
                attempts++;
                continue;
            }

            // Error fatal → keluar
            return {
                success: false,
                error: e,
                status: err.response?.status || 500
            };
        }
    }

    return {
        success: false,
        error: "All tokens are limited",
        status: 402
    };
}

module.exports = {
  name: "React Channel WhatsApp",
  desc: "React emoji to WhatsApp Channel Post",
  category: "Tools",
  path: "/tools/react-channel?apikey=&postUrl=&emoji=",

  async run(req, res) {
    const { apikey, postUrl, emoji } = req.query;

    if (!apikey || !global.apikey?.includes(apikey)) {
      return res.json({ status: false, error: "Invalid API key" });
    }

    if (!postUrl) {
      return res.json({ status: false, error: "postUrl is required" });
    }

    if (!emoji) {
      return res.json({ status: false, error: "emoji is required" });
    }

    try {
      const result = await reactToChannel(postUrl, emoji);

      if (!result.success) {
        return res.status(result.status).json({
          status: false,
          error: result.error
        });
      }

      res.json({
        status: true,
        data: result.data
      });

    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};
