import fetch from "node-fetch";

const ALLOWED_QUALITIES = ["64", "128", "192", "256", "320"];

export default async function handler(req, res) {
  try {
    const { videoId, quality } = req.query;

    if (!videoId) {
      return res.status(400).json({ success: false });
    }

    const q = quality || "320";

    if (!ALLOWED_QUALITIES.includes(q)) {
      return res.status(400).json({ success: false });
    }

    const r = await fetch("https://dlsrv.online/api/download/mp3", {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
        "Content-Type": "application/json",
        "Origin": "https://yt1s.com.co",
        "Referer": "https://yt1s.com.co/"
      },
      body: JSON.stringify({
        videoId: videoId,
        quality: q
      })
    });

    const d = await r.json();

    if (!d.modalHtml) {
      return res.status(500).json({ success: false });
    }

    const m = d.modalHtml.match(
      /https:\/\/yt1s-worker-[^"]+/i
    );

    if (!m) {
      return res.status(404).json({ success: false });
    }

    return res.json({
      success: true,
      videoId: videoId,
      quality: q,
      downloadLink: m[0]
    });

  } catch (e) {
    return res.status(500).json({ success: false });
  }
}
