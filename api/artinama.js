const fetch = require("node-fetch");

// ===============================
// FETCH SOURCE API
// ===============================
async function fetchArtiNama(nama) {
  if (!nama) throw new Error("Parameter nama is required");

  const url = `https://api.siputzx.my.id/api/primbon/artinama?nama=${encodeURIComponent(nama)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "accept": "*/*"
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
  name: "ArtiNama",
  desc: "Primbon Arti Nama",
  category: "Primbon",

  /**
   * ===========================
   * ENDPOINT
   * ===========================
   */
  path: "/primbon/artinama?apikey=&nama=",

  async run(req, res) {
    const { nama } = req.query;

    if (!nama) {
      return res.json({
        status: false,
        error: "Parameter nama is required"
      });
    }

    try {
      const data = await fetchArtiNama(nama);

      if (!data?.status || !data?.data) {
        return res.status(500).json({
          status: false,
          error: "Invalid source response"
        });
      }

      res.json({
        status: true,
        creator: "AanzDigital",
        nama: data.data.nama,
        arti: data.data.arti,
        catatan: data.data.catatan,
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
