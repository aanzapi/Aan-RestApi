const fetch = require("node-fetch");

// ===============================
// FETCH SOURCE API
// ===============================
async function fetchTekaTeki() {
  const res = await fetch("https://api.siputzx.my.id/api/games/tekateki", {
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
  name: "TekaTeki",
  desc: "Game Teka-Teki Lucu",
  category: "Games",
  path: "/games/tekateki?apikey=",

  async run(req, res) {
    const { apikey } = req.query;

    if (!apikey || !global.apikey?.includes(apikey)) {
      return res.json({ status: false, error: "Invalid API key" });
    }

    try {
      const data = await fetchTekaTeki();

      res.json({
        status: true,
        creator: "AanzDigital",
        result: {
          soal: data.data.soal,
          jawaban: data.data.jawaban
        },
        timestamp: data.timestamp
      });

    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  }
};
