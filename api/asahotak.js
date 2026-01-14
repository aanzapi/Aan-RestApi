const fetch = require("node-fetch");

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
// EXPORT MODULE
// ===============================
module.exports = {
  name: "AsahOtak",
  desc: "Game Asah Otak (With Answer)",
  category: "Games",

  /**
   * ===========================
   * ENDPOINT
   * ===========================
   */
  path: "/games/asahotak?apikey=",

  async run(req, res) {
    try {
      const data = await fetchAsahOtak();

      if (!data?.status || !data?.data) {
        return res.status(500).json({
          status: false,
          error: "Invalid source response"
        });
      }

      res.json({
        status: true,
        creator: "AanzDigital",
        index: data.data.index,
        soal: data.data.soal,
        jawaban: data.data.jawaban,
        timestamp: data.timestamp
      });

    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};
