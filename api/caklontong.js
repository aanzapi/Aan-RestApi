const fetch = require("node-fetch");

// ===============================
// FETCH SOURCE API
// ===============================
async function fetchCakLontong() {
  const res = await fetch("https://api.siputzx.my.id/api/games/caklontong", {
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
  name: "CakLontong",
  desc: "Soal Tebak Logika Cak Lontong",
  category: "Games",
  path: "/games/caklontong?apikey=",

  async run(req, res) {
    const { apikey } = req.query;

    if (!apikey || !global.apikey?.includes(apikey)) {
      return res.json({ status: false, error: "Invalid API key" });
    }

    try {
      const data = await fetchCakLontong();

      res.json({
        status: true,
        creator: "AanzDigital",
        result: {
          index: data.data.index,
          soal: data.data.soal,
          jawaban: data.data.jawaban,
          deskripsi: data.data.deskripsi
        },
        timestamp: data.timestamp
      });

    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  }
};
