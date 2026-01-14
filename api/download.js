import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { videoId, type } = req.query;

    if (!videoId || !type) {
      return res.status(400).json({ success: false });
    }

    let apiUrl = "";
    let quality = "";

    if (type === "audio") {
      apiUrl = "https://dlsrv.online/api/download/mp3";
      quality = "320";
    }

    if (type === "video") {
      apiUrl = "https://dlsrv.online/api/download/mp4";
      quality = "720";
    }

    if (!apiUrl) {
      return res.status(400).json({ success: false });
    }

    const r = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
        "Content-Type": "application/json",
        "Origin": "https://yt1s.com.co",
        "Referer": "https://yt1s.com.co/"
      },
      body: JSON.stringify({
        videoId: videoId,
        quality: quality
      })
    });

    const d = await r.json();

    if (!d.modalHtml) {
      return res.status(500).json({ success: false });
    }

    const m = d.modalHtml.match(
      /window\.location\.href='(https:\/\/yt1s-worker-[^']+)'/i
    );

    if (!m) {
      return res.status(404).json({ success: false });
    }

    return res.json({
      success: true,
      type: type,
      videoId: videoId,
      quality: type === "video" ? quality + "p" : quality,
      downloadLink: m[1]
    });

  } catch {
    return res.status(500).json({ success: false });
  }
}
