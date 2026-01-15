const fetch = require("node-fetch");

// ===============================
// FETCH SOURCE API
// ===============================
async function fetchCCSD(mapel, jumlah) {
  if (!mapel || !jumlah) {
    throw new Error("Parameter matapelajaran dan jumlahsoal wajib diisi");
  }

  const url = `https://api.siputzx.my.id/api/games/cc-sd?matapelajaran=${encodeURIComponent(
    mapel
  )}&jumlahsoal=${jumlah}`;

  const res = await fetch(url, {
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
  name: "CerdasCermatSD",
  desc: "Soal Cerdas Cermat SD",
  category: "Games",
  path: "/games/cc-sd?apikey=&matapelajaran=&jumlahsoal=",

  async run(req, res) {
    const { apikey, matapelajaran, jumlahsoal } = req.query;

    if (!apikey || !global.apikey?.includes(apikey)) {
      return res.json({ status: false, error: "Invalid API key" });
    }

    if (!matapelajaran || !jumlahsoal) {
      return res.json({
        status: false,
        error: "Parameter matapelajaran dan jumlahsoal harus diisi"
      });
    }

    try {
      const data = await fetchCCSD(matapelajaran, jumlahsoal);

      res.json({
        status: true,
        creator: "AanzDigital",
        input: {
          matapelajaran,
          jumlahsoal
        },
        result: data.data,
        timestamp: data.timestamp
      });

    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  }
};
