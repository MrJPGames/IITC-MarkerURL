// ==UserScript==
// @id hello-iitc
// @name IITC Plugin: Marker URLs
// @category Tweaks
// @version 1.0.0
// @namespace https://fakeuri.org/iitc/marker-url
// @description Allow intel URLs to drop a marker
// @include http://www.ingress.com/intel*
// @match http://www.ingress.com/intel*
// @include https://www.ingress.com/intel*
// @match https://www.ingress.com/intel*
// @include http://intel.ingress.com/*
// @match http://intel.ingress.com/*
// @include https://intel.ingress.com/*
// @match https://intel.ingress.com/*
// @grant none
// ==/UserScript==

// Wrapper function that will be stringified and injected
// into the document. Because of this, normal closure rules
// do not apply here.
function wrapper(plugin_info) {
  // Make sure that window.plugin exists. IITC defines it as a no-op function,
  // and other plugins assume the same.
  if(typeof window.plugin !== 'function') window.plugin = function() {};

  // Name of the IITC build for first-party plugins
  plugin_info.buildName = 'iitcMarker';

  // Datetime-derived version of the plugin
  plugin_info.dateTimeVersion = '20200115000000';

  // ID/name of the plugin
  plugin_info.pluginId = 'iitcMarker';

  // The entry point for this plugin.
  function setup() {
    var latLng = {lat: window.getURLParam("mlat"), lng: window.getURLParam("mlng")};

    var obj = {}
    obj.layer = L.layerGroup();

    if(latLng) {
      L.marker(latLng, {
        icon: L.divIcon.coloredSvg('red'),
        title: "Title"
      }).addTo(obj.layer);

      map.addLayer(obj.layer);
    }

    map.setView(latLng, 18);
  }

  // Add an info property for IITC's plugin system
  setup.info = plugin_info;

  // Make sure window.bootPlugins exists and is an array
  if (!window.bootPlugins) window.bootPlugins = [];
  // Add our startup hook
  window.bootPlugins.push(setup);
  // If IITC has already booted, immediately run the 'setup' function
  if (window.iitcLoaded && typeof setup === 'function') setup();
}

// Create a script element to hold our content script
var script = document.createElement('script');
var info = {};

// GM_info is defined by the assorted monkey-themed browser extensions
// and holds information parsed from the script header.
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
  info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description
  };
}

// Create a text node and our IIFE inside of it
var textContent = document.createTextNode('('+ wrapper +')('+ JSON.stringify(info) +')');
// Add some content to the script element
script.appendChild(textContent);
// Finally, inject it... wherever.
(document.body || document.head || document.documentElement).appendChild(script);
