export default async function handler(req, res) {
  try {
    // Reconstruct URL to discord.com with path and query preserved
    const url = new URL(req.url, 'https://discord.com');

    // Prepare headers - clone and modify as needed
    const headers = new Headers(req.headers);
    headers.set('host', 'discord.com');  // Important: set host header to discord.com

    // Prepare fetch options
    const fetchOptions = {
      method: req.method,
      headers,
      redirect: 'manual'
    };

    // Include body if method allows
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = req.body;
    }

    // Use global fetch
    const response = await fetch(url.toString(), fetchOptions);

    // Prepare response headers, filtering problematic ones
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'content-encoding') return; // skip encoding header
      responseHeaders[key] = value;
    });

    // Stream response body
    const body = await response.arrayBuffer();

    res.writeHead(response.status, responseHeaders);
    res.end(Buffer.from(body));

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Internal Server Error');
  }
}
