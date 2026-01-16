import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const r = await fetch("https://dlsrv.online/api/download/mp3", {
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36",
        "Content-Type": "application/json",
        "Origin": "https://yt1s.com.co",
        "Referer": "https://yt1s.com.co/"
      },
      body: JSON.stringify({
        videoId: "cZCtEw1gNG8",
        quality: "320"
      })
    });

    const text = await r.text();

    // 👇 THIS IS THE TRUTH
    return res.status(200).send({
      success: true,
      raw: text
    });

  } catch (e) {
    return res.status(500).send({
      error: String(e)
    });
  }
}
