const fetch = require("node-fetch");

// ===============================
// FETCH SOURCE API
// ===============================
async function fetchLengkapiKalimat() {
  const res = await fetch("https://api.siputzx.my.id/api/games/lengkapikalimat", {
    method: "GET",
    headers: { accept: "*/*" }
  });

  if (!res.ok) throw new Error(`Source API error ${res.status}`);
  return await res.json();
}

// ===============================
// EXPORT MODULE
// ===============================
module.exports = {
  name: "LengkapiKalimat",
  desc: "Game Lengkapi Kalimat",
  category: "Games",
  path: "/games/lengkapikalimat?apikey=",

  async run(req, res) {
    const { apikey } = req.query;

    if (!apikey || !global.apikey?.includes(apikey)) {
      return res.json({ status: false, error: "Invalid API key" });
    }

    try {
      const data = await fetchLengkapiKalimat();

      res.json({
        status: true,
        creator: "AanzDigital",
        result: {
          pertanyaan: data.data.pertanyaan,
          jawaban: data.data.jawaban
        },
        timestamp: data.timestamp
      });

    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  }
};
