# elastic-debounce

Library to debounce XHR requests based on server response time.

## Requirements

Make sure to set the `x-server-time` header in  your server, which returns the milliseconds of server response. The purpose of this is to avoid clients being punished for latency and computing delay based on true server time.

## Instructions

Add to your package json:

```json
  "elastic-debounce": "0.0.1"
```

## Usage

```javascript
import ED from 'elastic-debounce';

function sampleXhrFactory() {
  var req = new XMLHttpRequest();
  req.open("GET", "http://localhost:3000");
  return req;
};

window.addEventListener('resize', ED.debounce(sampleXhrFactory));
```
