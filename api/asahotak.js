const fetch = require("node-fetch");

// =======================
// GLOBAL SESSION STORAGE
// =======================
global.asahOtakSession = global.asahOtakSession || {};

// =======================
// FETCH DARI SOURCE API
// =======================
async function fetchAsahOtak() {
  const res = await fetch("https://api.siputzx.my.id/api/games/asahotak", {
    method: "GET",
    headers: {
      "accept": "*/*",
      "api_key": "aan"
    }
  });

  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }

  return await res.json();
}

// =======================
// GENERATE SOAL (HIDE ANSWER)
// =======================
async function generateSoal() {
  const apiData = await fetchAsahOtak();

  if (!apiData.status) {
    throw new Error("Source API error");
  }

  const sessionId = Math.random().toString(36).substring(2, 10);

  global.asahOtakSession[sessionId] = {
    soal: apiData.data.soal,
    jawaban: apiData.data.jawaban,
    created_at: Date.now()
  };

  return {
    session_id: sessionId,
    soal: apiData.data.soal
  };
}

// =======================
// MAIN EXPORT (2 ENDPOINT)
// =======================
module.exports = {
  name: "AsahOtak",
  desc: "Game Asah Otak Full Version",
  category: "Games",

  /**
   * ======================
   * GET SOAL
   * /games/asahotak?apikey=xxx
   * ======================
   */
  path: "/games/asahotak",

  async run(req, res) {
    const { apikey } = req.query;

    if (!apikey || !global.apikey?.includes(apikey)) {
      return res.json({
        status: false,
        error: "Invalid API key"
      });
    }

    try {
      const soal = await generateSoal();

      res.json({
        status: true,
        game: "Asah Otak",
        session_id: soal.session_id,
        soal: soal.soal,
        hint: "Gunakan /games/asahotak/answer untuk melihat jawaban",
        timestamp: new Date().toISOString()
      });

    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message
      });
    }
  },

  /**
   * ======================
   * CEK JAWABAN
   * /games/asahotak/answer?apikey=xxx&session_id=xxx
   * ======================
   */
  answer: {
    path: "/games/asahotak/answer",

    async run(req, res) {
      const { apikey, session_id } = req.query;

      if (!apikey || !global.apikey?.includes(apikey)) {
        return res.json({
          status: false,
          error: "Invalid API key"
        });
      }

      if (!session_id) {
        return res.json({
          status: false,
          error: "session_id is required"
        });
      }

      const session = global.asahOtakSession[session_id];

      if (!session) {
        return res.json({
          status: false,
          error: "Session not found or expired"
        });
      }

      res.json({
        status: true,
        soal: session.soal,
        jawaban: session.jawaban,
        solved_at: new Date().toISOString()
      });

      // hapus session setelah dijawab
      delete global.asahOtakSession[session_id];
    }
  }
};
