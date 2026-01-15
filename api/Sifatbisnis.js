const fetch = require("node-fetch");

// ===============================
// FETCH SOURCE API
// ===============================
async function fetchSifatUsahaBisnis(tgl, bln, thn) {
  if (!tgl || !bln || !thn) {
    throw new Error("Parameter tgl, bln, dan thn wajib diisi");
  }

  const url = `https://api.siputzx.my.id/api/primbon/sifat_usaha_bisnis?tgl=${tgl}&bln=${bln}&thn=${thn}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "*/*"
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
  name: "SifatUsahaBisnis",
  desc: "Primbon Sifat Usaha dan Bisnis Berdasarkan Tanggal Lahir",
  category: "Primbon",

  /**
   * ===========================
   * ENDPOINT
   * ===========================
   */
  path: "/primbon/sifat-usaha-bisnis?apikey=&tgl=&bln=&thn=",

  async run(req, res) {
    const { apikey, tgl, bln, thn } = req.query;

    // 🔐 API KEY CHECK
    if (!apikey || !global.apikey?.includes(apikey)) {
      return res.json({
        status: false,
        error: "Invalid API key"
      });
    }

    if (!tgl || !bln || !thn) {
      return res.json({
        status: false,
        error: "Parameter tgl, bln, dan thn harus diisi"
      });
    }

    try {
      const data = await fetchSifatUsahaBisnis(tgl, bln, thn);

      if (!data?.status || !data?.data) {
        return res.status(500).json({
          status: false,
          error: "Invalid source response"
        });
      }

      res.json({
        status: true,
        creator: "AanzDigital",

        // 🔹 INPUT (buat tes API)
        input: {
          tanggal: tgl,
          bulan: bln,
          tahun: thn
        },

        // 🔹 HASIL PRIMBON
        result: {
          hari_lahir: data.data.hari_lahir,
          sifat_usaha: data.data.usaha,
          catatan: data.data.catatan
        },

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
