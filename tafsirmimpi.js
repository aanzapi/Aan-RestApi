const fetch = require("node-fetch");

// ===============================
// FETCH SOURCE API
// ===============================
async function fetchTafsirMimpi(mimpi) {
  if (!mimpi) {
    throw new Error("Parameter mimpi wajib diisi");
  }

  const url = `https://api.siputzx.my.id/api/primbon/tafsirmimpi?mimpi=${encodeURIComponent(
    mimpi
  )}`;

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
  name: "TafsirMimpi",
  desc: "Primbon Tafsir Mimpi",
  category: "Primbon",

  /**
   * ===========================
   * ENDPOINT
   * ===========================
   */
  path: "/primbon/tafsir-mimpi?apikey=&mimpi=",

  async run(req, res) {
    const { apikey, mimpi } = req.query;

    // 🔐 API KEY CHECK
    if (!apikey || !global.apikey?.includes(apikey)) {
      return res.json({
        status: false,
        error: "Invalid API key"
      });
    }

    if (!mimpi) {
      return res.json({
        status: false,
        error: "Parameter mimpi harus diisi"
      });
    }

    try {
      const data = await fetchTafsirMimpi(mimpi);

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
          mimpi
        },

        // 🔹 HASIL PRIMBON
        result: {
          keyword: data.data.keyword,
          hasil: data.data.hasil,
          total: data.data.total,
          solusi: data.data.solusi
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
