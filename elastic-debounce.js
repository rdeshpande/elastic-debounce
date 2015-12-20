/*
  Library to debounce an XHR request based on response time. This relies
  on the x-server-time header (configurable) to return a number of milliseconds
  to delay the request.
  ------------------------------------------------------------------
  Example Use:

  function sampleXhrFactory() {
    var req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000");
    return req;
  };

  window.addEventListener('resize', ED.debounce(sampleXhrFactory));
*/

var ED = {
  calculatedTimeout: 0,
  defaultTimeout: 200,
  lastRun: null,
  debugMode: true,
  serverTimeHeader: "x-server-time",

  log: function(msg) {
    if (this.debugMode) {
      console.log(msg);
    }
  },

  calculateWait: function() {
    if (this.calculatedTimeout > 0) {
      return this.calculatedTimeout;
    } else {
      return this.defaultTimeout;
    }
  },

  // If the server time header is not present, use the
  // naive approach of measuring the request end-to-end time,
  // which is not as accurate as serverTime but better than nothing.
  //
  setPendingTimeout: function(event) {
    var xhr = event.target;
    var serverTime = xhr.getResponseHeader(this.serverTimeHeader);

    if (serverTime) {
      this.calculatedTimeout = serverTime;
    } else {
      this.calculatedTimeout = new Date() - this.lastRun;
    }
  },

  xhrLoad: function(event) {
    ED.setPendingTimeout(event);
    ED.log("Finished Request: " + (new Date()) + ", new timeout: " + ED.calculatedTimeout + "ms");
  },

  xhrError: function(event) {
    ED.setPendingTimeout(event);
  },

  debounce: function(xhrBuilder) {
    var timeout;
    var that = this;

    return function() {
      that.log("CALL ED.debounce, current wait: " + that.calculatedTimeout + "ms, last run: +" + that.lastRun);

      var xhr = xhrBuilder();
      xhr.addEventListener("load", that.xhrLoad);
      xhr.addEventListener("error", that.xhrError);

      var later = function() {
        timeout = null;
        that.log("Started Request:  " + (new Date()));
        that.lastRun = new Date();
        xhr.send();
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, that.calculateWait());
    };
  }
};

module.exports = ED;
