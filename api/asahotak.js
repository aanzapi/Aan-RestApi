const fetch = require("node-fetch");

// ===============================
// SESSION STORAGE
// ===============================
global.asahOtakSession = global.asahOtakSession || {};

// ===============================
// FETCH SOURCE API
// ===============================
async function fetchAsahOtak() {
  const res = await fetch("https://api.siputzx.my.id/api/games/asahotak", {
    method: "GET",
    headers: {
      "accept": "*/*",
      "api_key": "aan"
    }
  });

  if (!res.ok) {
    throw new Error(`Source API error ${res.status}`);
  }

  return await res.json();
}

// ===============================
// GET SOAL (HIDE ANSWER)
// ===============================
async function getSoal() {
  const data = await fetchAsahOtak();

  if (!data?.status || !data?.data) {
    throw new Error("Invalid source response");
  }

  const sessionId = Math.random().toString(36).slice(2, 10);

  global.asahOtakSession[sessionId] = {
    soal: data.data.soal,
    jawaban: data.data.jawaban,
    created: Date.now()
  };

  return {
    session_id: sessionId,
    soal: data.data.soal
  };
}

// ===============================
// EXPORT
// ===============================
module.exports = {
  name: "AsahOtak",
  desc: "Game Asah Otak",
  category: "Games",

  /**
   * ===========================
   * GET SOAL
   * ===========================
   */
  path: "/games/asahotak?apikey=",

  async run(req, res) {
    try {
      const soal = await getSoal();

      res.json({
        status: true,
        creator: "AanzDigital",
        session_id: soal.session_id,
        soal: soal.soal,
        note: "Gunakan /games/asahotak/answer?apikey=&session_id="
      });

    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message
      });
    }
  },

  /**
   * ===========================
   * GET JAWABAN
   * ===========================
   */
  answer: {
    path: "/games/asahotak/answer?apikey=&session_id=",

    async run(req, res) {
      const { session_id } = req.query;

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
        creator: "AanzDigital",
        soal: session.soal,
        jawaban: session.jawaban
      });

      delete global.asahOtakSession[session_id];
    }
  }
};
