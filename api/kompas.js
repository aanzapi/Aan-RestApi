const fetch = require("node-fetch");

// ===============================
// FETCH SOURCE API
// ===============================
async function fetchKompas() {
  const res = await fetch("https://api.siputzx.my.id/api/berita/kompas", {
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
  name: "BeritaKompas",
  desc: "Berita Terkini Kompas",
  category: "News",
  path: "/berita/kompas?apikey=",

  async run(req, res) {
    const { apikey } = req.query;

    if (!apikey || !global.apikey?.includes(apikey)) {
      return res.json({ status: false, error: "Invalid API key" });
    }

    try {
      const data = await fetchKompas();

      res.json({
        status: true,
        creator: "AanzDigital",
        total: data.data.length,
        result: data.data,
        timestamp: data.timestamp
      });

    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  }
};
