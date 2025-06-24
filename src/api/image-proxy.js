// src/api/image-proxy.js
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const contentType = imageResponse.headers.get('content-type');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable'); // Cache de 1 dia

    const imageBuffer = await imageResponse.arrayBuffer();
    res.status(200).send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).send('Error fetching image');
  }
}