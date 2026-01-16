// /api/download.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { videoId } = req.query;

    if (!videoId) {
      return res.json({ success: false });
    }

    const r = await fetch("https://dlsrv.online/api/download/mp3", {
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36",
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Origin": "https://yt1s.com.co",
        "Referer": "https://yt1s.com.co/",
        "sec-ch-ua":
          "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\""
      },
      body: JSON.stringify({
        videoId: videoId,
        quality: "320"
      })
    });

    const data = await r.json();

    if (!data || !data.modalHtml) {
      return res.json({ success: false });
    }

    const match = data.modalHtml.match(
      /window\.location\.href='(https:\/\/yt1s-worker-[^']+)'/i
    );

    if (!match) {
      return res.json({ success: false });
    }

    return res.json({
      success: true,
      videoId: videoId,
      quality: "320",
      downloadLink: match[1]
    });

  } catch (err) {
    return res.json({ success: false });
  }
}
