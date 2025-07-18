import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Construct the URL to discord.com, preserving path and query
  const url = new URL(req.url, 'https://discord.com');

  // Make the fetch request to Discord
  const response = await fetch(url.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
  });

  // Get response body
  const body = await response.text();

  // Copy status and headers
  res.status(response.status);
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  // Send back Discord's response body
  res.send(body);
}
