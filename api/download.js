import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { videoId } = req.query;

    if (!videoId) {
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
        quality: "320"
      })
    });

    const d = await r.json();

    const m = d?.modalHtml?.match(
      /window\.location\.href='(https:\/\/yt1s-worker-[^']+)'/i
    );

    if (!m) {
      return res.status(500).json({ success: false });
    }

    return res.json({
      success: true,
      videoId,
      quality: "320",
      downloadLink: m[1]
    });

  } catch (e) {
    return res.status(500).json({ success: false });
  }
}
