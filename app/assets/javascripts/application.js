// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs

function debounced(f, period) {
  var lastTime = -Infinity;
  var timeoutId;

  return function() {
    var now = performance.now();
    var difference = now - lastTime;

    if (difference > period) {
      f.apply(null, arguments);
    } else {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(function() {
        f.apply(null, arguments);

        lastTime = now;
      }, period);
    }

    lastTime = now;
  }
}


function authenticityToken() {
  return document.querySelector('meta[name="csrf-token"]').getAttribute("content");
}

function fetching(action, args) {
  if (typeof args.headers !== 'object') {
    args.headers = {};
  }

  var defaultHeaders = {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-Token': authenticityToken(),
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }

  args.headers = Object.assign({}, defaultHeaders, args.headers);

  if (!args.credentials) {
    args.credentials = 'same-origin';
  }

  return fetch(action, args);
}

function fetchingHTML(action, args) {
  if (typeof args.headers !== 'object') {
    args.headers = {};
  }

  args.headers['Content-Type'] = 'text/html';
  args.headers['Accept'] = 'text/html';

  return fetching(action, args);
}

//= require_tree .
