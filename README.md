vigour-wrapper
==============

wrapper tools and cordova plugins

## Store plugin
API: [StoreAPI.js](StoreAPI.js)

Usage: [examples/storeBasicUsage.js](examples/storeBasicUsage.js)

Uses [EventEmitter3](https://www.npmjs.org/package/eventemitter3) to provide `Store.on`, `Store.off`, `Store.once`, etc. This is the event emitter we use in vigour-js so it's only logical to use the same one here.