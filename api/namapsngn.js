const fetch = require("node-fetch");

// ===============================
// FETCH SOURCE API
// ===============================
async function fetchKecocokanNama(nama1, nama2) {
  if (!nama1 || !nama2) {
    throw new Error("Parameter nama1 dan nama2 wajib diisi");
  }

  const url = `https://api.siputzx.my.id/api/primbon/kecocokan_nama_pasangan?nama1=${encodeURIComponent(
    nama1
  )}&nama2=${encodeURIComponent(nama2)}`;

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
  name: "KecocokanNamaPasangan",
  desc: "Primbon Kecocokan Nama Pasangan",
  category: "Game",

  /**
   * ===========================
   * ENDPOINT
   * ===========================
   */
  path: "/primbon/kecocokan-nama-pasangan?apikey=&nama1=&nama2=",

  async run(req, res) {
    const { nama1, nama2 } = req.query;

    if (!nama1 || !nama2) {
      return res.json({
        status: false,
        error: "Parameter nama1 dan nama2 harus diisi"
      });
    }

    try {
      const data = await fetchKecocokanNama(nama1, nama2);

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
          nama_anda: nama1,
          nama_pasangan: nama2
        },

        // 🔹 HASIL PRIMBON
        result: {
          nama_anda: data.data.nama_anda,
          nama_pasangan: data.data.nama_pasangan,
          sisi_positif: data.data.sisi_positif,
          sisi_negatif: data.data.sisi_negatif,
          gambar: data.data.gambar,
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