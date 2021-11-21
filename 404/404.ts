import express = require('express')
import format = require('string-format')
var page_404 = express.Router();
var page_404_html = `<!DOCTYPE HTML>
<html><head>
<title>404 Not Found</title>
</head><body>
<h1>Not Found</h1>
<p>The requested URL "{0}" was not found on this server.</p>
</body></html>`;

page_404.get('/*', (req, res) => {
  res.send(format(page_404_html, req.path));
});

page_404.post('/*', (req, res) => {
  res.send(format(page_404_html, req.path));
});

export = page_404;
