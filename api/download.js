import fetch from "node-fetch";

const ALLOWED_AUDIO_QUALITIES = ["64", "128", "192", "256", "320"];
const VIDEO_QUALITY = "1080"; // hard-coded

export default async function handler(req, res) {
  try {
    const { videoId, type, quality } = req.query;

    if (!videoId || !type) {
      return res.status(400).json({ success: false, message: "Missing params" });
    }

    /* ================= AUDIO ================= */
    if (type === "audio") {
      const q = quality || "320";

      if (!ALLOWED_AUDIO_QUALITIES.includes(q)) {
        return res.status(400).json({ success: false, message: "Invalid audio quality" });
      }

      const r = await fetch("https://dlsrv.online/api/download/mp3", {
        method: "POST",
        headers: {
          "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
          "Content-Type": "application/json",
          "Origin": "https://yt1s.com.co",
          "Referer": "https://yt1s.com.co/"
        },
        body: JSON.stringify({ videoId, quality: q })
      });

      const d = await r.json();

      const m = d?.modalHtml?.match(
        /window\.location\.href='(https:\/\/yt1s-worker-[^']+)'/i
      );

      if (!m) {
        return res.status(404).json({ success: false });
      }

      return res.json({
        success: true,
        type: "audio",
        videoId,
        quality: q,
        downloadLink: m[1]
      });
    }

    /* ================= VIDEO ================= */
    if (type === "video") {
      const r = await fetch("https://dlsrv.online/api/download/mp4", {
        method: "POST",
        headers: {
          "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
          "Content-Type": "application/json",
          "Origin": "https://yt1s.com.co",
          "Referer": "https://yt1s.com.co/"
        },
        body: JSON.stringify({
          videoId,
          quality: VIDEO_QUALITY
        })
      });

      const d = await r.json();

      const m = d?.modalHtml?.match(
        /window\.location\.href='(https:\/\/yt1s-worker-[^']+)'/i
      );

      if (!m) {
        return res.status(404).json({ success: false });
      }

      return res.json({
        success: true,
        type: "video",
        videoId,
        quality: VIDEO_QUALITY,
        downloadLink: m[1]
      });
    }

    return res.status(400).json({ success: false, message: "Invalid type" });

  } catch (e) {
    return res.status(500).json({ success: false });
  }
}
