;(function() {
    /*!
 * Socket.IO v2.3.0
 * (c) 2014-2019 Guillermo Rauch
 * Released under the MIT License.
 */
    !function(t, e) {
        "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.gacllio = e() : t.gacllio = e()
    }(this, function() {
        return function(t) {
            function e(n) {
                if (r[n])
                    return r[n].exports;
                var o = r[n] = {
                    exports: {},
                    id: n,
                    loaded: !1
                };
                return t[n].call(o.exports, o, o.exports, e),
                o.loaded = !0,
                o.exports
            }
            var r = {};
            return e.m = t,
            e.c = r,
            e.p = "",
            e(0)
        }([function(t, e, r) {
            "use strict";
            function n(t, e) {
                "object" === ("undefined" == typeof t ? "undefined" : o(t)) && (e = t,
                t = void 0),
                e = e || {};
                var r, n = i(t), s = n.source, p = n.id, h = n.path, u = c[p] && h in c[p].nsps, f = e.forceNew || e["force new connection"] || !1 === e.multiplex || u;
                return f ? r = a(s, e) : (c[p] || (c[p] = a(s, e)),
                r = c[p]),
                n.query && !e.query && (e.query = n.query),
                r.socket(n.path, e)
            }
            var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            }
            : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            }
              , i = r(1)
              , s = r(4)
              , a = r(9);
            r(3)("socket.io-client");
            t.exports = e = n;
            var c = e.managers = {};
            e.protocol = s.protocol,
            e.connect = n,
            e.Manager = r(9),
            e.Socket = r(33)
        }
        , function(t, e, r) {
            "use strict";
            function n(t, e) {
                var r = t;
                e = e || "undefined" != typeof location && location,
                null == t && (t = e.protocol + "//" + e.host),
                "string" == typeof t && ("/" === t.charAt(0) && (t = "/" === t.charAt(1) ? e.protocol + t : e.host + t),
                /^(https?|wss?):\/\//.test(t) || (t = "undefined" != typeof e ? e.protocol + "//" + t : "https://" + t),
                r = o(t)),
                r.port || (/^(http|ws)$/.test(r.protocol) ? r.port = "80" : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")),
                r.path = r.path || "/";
                var n = r.host.indexOf(":") !== -1
                  , i = n ? "[" + r.host + "]" : r.host;
                return r.id = r.protocol + "://" + i + ":" + r.port,
                r.href = r.protocol + "://" + i + (e && e.port === r.port ? "" : ":" + r.port),
                r
            }
            var o = r(2);
            r(3)("socket.io-client:url");
            t.exports = n
        }
        , function(t, e) {
            var r = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
              , n = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
            t.exports = function(t) {
                var e = t
                  , o = t.indexOf("[")
                  , i = t.indexOf("]");
                o != -1 && i != -1 && (t = t.substring(0, o) + t.substring(o, i).replace(/:/g, ";") + t.substring(i, t.length));
                for (var s = r.exec(t || ""), a = {}, c = 14; c--; )
                    a[n[c]] = s[c] || "";
                return o != -1 && i != -1 && (a.source = e,
                a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":"),
                a.authority = a.authority.replace("[", "").replace("]", "").replace(/;/g, ":"),
                a.ipv6uri = !0),
                a
            }
        }
        , function(t, e) {
            "use strict";
            t.exports = function() {
                return function() {}
            }
        }
        , function(t, e, r) {
            function n() {}
            function o(t) {
                var r = "" + t.type;
                if (e.BINARY_EVENT !== t.type && e.BINARY_ACK !== t.type || (r += t.attachments + "-"),
                t.nsp && "/" !== t.nsp && (r += t.nsp + ","),
                null != t.id && (r += t.id),
                null != t.data) {
                    var n = i(t.data);
                    if (n === !1)
                        return m;
                    r += n
                }
                return r
            }
            function i(t) {
                try {
                    return JSON.stringify(t)
                } catch (t) {
                    return !1
                }
            }
            function s(t, e) {
                function r(t) {
                    var r = l.deconstructPacket(t)
                      , n = o(r.packet)
                      , i = r.buffers;
                    i.unshift(n),
                    e(i)
                }
                l.removeBlobs(t, r)
            }
            function a() {
                this.reconstructor = null
            }
            function c(t) {
                var r = 0
                  , n = {
                    type: Number(t.charAt(0))
                };
                if (null == e.types[n.type])
                    return u("unknown packet type " + n.type);
                if (e.BINARY_EVENT === n.type || e.BINARY_ACK === n.type) {
                    for (var o = ""; "-" !== t.charAt(++r) && (o += t.charAt(r),
                    r != t.length); )
                        ;
                    if (o != Number(o) || "-" !== t.charAt(r))
                        throw new Error("Illegal attachments");
                    n.attachments = Number(o)
                }
                if ("/" === t.charAt(r + 1))
                    for (n.nsp = ""; ++r; ) {
                        var i = t.charAt(r);
                        if ("," === i)
                            break;
                        if (n.nsp += i,
                        r === t.length)
                            break
                    }
                else
                    n.nsp = "/";
                var s = t.charAt(r + 1);
                if ("" !== s && Number(s) == s) {
                    for (n.id = ""; ++r; ) {
                        var i = t.charAt(r);
                        if (null == i || Number(i) != i) {
                            --r;
                            break
                        }
                        if (n.id += t.charAt(r),
                        r === t.length)
                            break
                    }
                    n.id = Number(n.id)
                }
                if (t.charAt(++r)) {
                    var a = p(t.substr(r))
                      , c = a !== !1 && (n.type === e.ERROR || d(a));
                    if (!c)
                        return u("invalid payload");
                    n.data = a
                }
                return n
            }
            function p(t) {
                try {
                    return JSON.parse(t)
                } catch (t) {
                    return !1
                }
            }
            function h(t) {
                this.reconPack = t,
                this.buffers = []
            }
            function u(t) {
                return {
                    type: e.ERROR,
                    data: "parser error: " + t
                }
            }
            var f = (r(3)("socket.io-parser"),
            r(5))
              , l = r(6)
              , d = r(7)
              , y = r(8);
            e.protocol = 4,
            e.types = ["CONNECT", "DISCONNECT", "EVENT", "ACK", "ERROR", "BINARY_EVENT", "BINARY_ACK"],
            e.CONNECT = 0,
            e.DISCONNECT = 1,
            e.EVENT = 2,
            e.ACK = 3,
            e.ERROR = 4,
            e.BINARY_EVENT = 5,
            e.BINARY_ACK = 6,
            e.Encoder = n,
            e.Decoder = a;
            var m = e.ERROR + '"encode error"';
            n.prototype.encode = function(t, r) {
                if (e.BINARY_EVENT === t.type || e.BINARY_ACK === t.type)
                    s(t, r);
                else {
                    var n = o(t);
                    r([n])
                }
            }
            ,
            f(a.prototype),
            a.prototype.add = function(t) {
                var r;
                if ("string" == typeof t)
                    r = c(t),
                    e.BINARY_EVENT === r.type || e.BINARY_ACK === r.type ? (this.reconstructor = new h(r),
                    0 === this.reconstructor.reconPack.attachments && this.emit("decoded", r)) : this.emit("decoded", r);
                else {
                    if (!y(t) && !t.base64)
                        throw new Error("Unknown type: " + t);
                    if (!this.reconstructor)
                        throw new Error("got binary data when not reconstructing a packet");
                    r = this.reconstructor.takeBinaryData(t),
                    r && (this.reconstructor = null,
                    this.emit("decoded", r))
                }
            }
            ,
            a.prototype.destroy = function() {
                this.reconstructor && this.reconstructor.finishedReconstruction()
            }
            ,
            h.prototype.takeBinaryData = function(t) {
                if (this.buffers.push(t),
                this.buffers.length === this.reconPack.attachments) {
                    var e = l.reconstructPacket(this.reconPack, this.buffers);
                    return this.finishedReconstruction(),
                    e
                }
                return null
            }
            ,
            h.prototype.finishedReconstruction = function() {
                this.reconPack = null,
                this.buffers = []
            }
        }
        , function(t, e, r) {
            function n(t) {
                if (t)
                    return o(t)
            }
            function o(t) {
                for (var e in n.prototype)
                    t[e] = n.prototype[e];
                return t
            }
            t.exports = n,
            n.prototype.on = n.prototype.addEventListener = function(t, e) {
                return this._callbacks = this._callbacks || {},
                (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e),
                this
            }
            ,
            n.prototype.once = function(t, e) {
                function r() {
                    this.off(t, r),
                    e.apply(this, arguments)
                }
                return r.fn = e,
                this.on(t, r),
                this
            }
            ,
            n.prototype.off = n.prototype.removeListener = n.prototype.removeAllListeners = n.prototype.removeEventListener = function(t, e) {
                if (this._callbacks = this._callbacks || {},
                0 == arguments.length)
                    return this._callbacks = {},
                    this;
                var r = this._callbacks["$" + t];
                if (!r)
                    return this;
                if (1 == arguments.length)
                    return delete this._callbacks["$" + t],
                    this;
                for (var n, o = 0; o < r.length; o++)
                    if (n = r[o],
                    n === e || n.fn === e) {
                        r.splice(o, 1);
                        break
                    }
                return this
            }
            ,
            n.prototype.emit = function(t) {
                this._callbacks = this._callbacks || {};
                var e = [].slice.call(arguments, 1)
                  , r = this._callbacks["$" + t];
                if (r) {
                    r = r.slice(0);
                    for (var n = 0, o = r.length; n < o; ++n)
                        r[n].apply(this, e)
                }
                return this
            }
            ,
            n.prototype.listeners = function(t) {
                return this._callbacks = this._callbacks || {},
                this._callbacks["$" + t] || []
            }
            ,
            n.prototype.hasListeners = function(t) {
                return !!this.listeners(t).length
            }
        }
        , function(t, e, r) {
            function n(t, e) {
                if (!t)
                    return t;
                if (s(t)) {
                    var r = {
                        _placeholder: !0,
                        num: e.length
                    };
                    return e.push(t),
                    r
                }
                if (i(t)) {
                    for (var o = new Array(t.length), a = 0; a < t.length; a++)
                        o[a] = n(t[a], e);
                    return o
                }
                if ("object" == typeof t && !(t instanceof Date)) {
                    var o = {};
                    for (var c in t)
                        o[c] = n(t[c], e);
                    return o
                }
                return t
            }
            function o(t, e) {
                if (!t)
                    return t;
                if (t && t._placeholder)
                    return e[t.num];
                if (i(t))
                    for (var r = 0; r < t.length; r++)
                        t[r] = o(t[r], e);
                else if ("object" == typeof t)
                    for (var n in t)
                        t[n] = o(t[n], e);
                return t
            }
            var i = r(7)
              , s = r(8)
              , a = Object.prototype.toString
              , c = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === a.call(Blob)
              , p = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === a.call(File);
            e.deconstructPacket = function(t) {
                var e = []
                  , r = t.data
                  , o = t;
                return o.data = n(r, e),
                o.attachments = e.length,
                {
                    packet: o,
                    buffers: e
                }
            }
            ,
            e.reconstructPacket = function(t, e) {
                return t.data = o(t.data, e),
                t.attachments = void 0,
                t
            }
            ,
            e.removeBlobs = function(t, e) {
                function r(t, a, h) {
                    if (!t)
                        return t;
                    if (c && t instanceof Blob || p && t instanceof File) {
                        n++;
                        var u = new FileReader;
                        u.onload = function() {
                            h ? h[a] = this.result : o = this.result,
                            --n || e(o)
                        }
                        ,
                        u.readAsArrayBuffer(t)
                    } else if (i(t))
                        for (var f = 0; f < t.length; f++)
                            r(t[f], f, t);
                    else if ("object" == typeof t && !s(t))
                        for (var l in t)
                            r(t[l], l, t)
                }
                var n = 0
                  , o = t;
                r(o),
                n || e(o)
            }
        }
        , function(t, e) {
            var r = {}.toString;
            t.exports = Array.isArray || function(t) {
                return "[object Array]" == r.call(t)
            }
        }
        , function(t, e) {
            function r(t) {
                return n && Buffer.isBuffer(t) || o && (t instanceof ArrayBuffer || i(t))
            }
            t.exports = r;
            var n = "function" == typeof Buffer && "function" == typeof Buffer.isBuffer
              , o = "function" == typeof ArrayBuffer
              , i = function(t) {
                return "function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer
            }
        }
        , function(t, e, r) {
            "use strict";
            function n(t, e) {
                if (!(this instanceof n))
                    return new n(t,e);
                t && "object" === ("undefined" == typeof t ? "undefined" : o(t)) && (e = t,
                t = void 0),
                e = e || {},
                e.path = e.path || "/socket.io",
                this.nsps = {},
                this.subs = [],
                this.opts = e,
                this.reconnection(e.reconnection !== !1),
                this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0),
                this.reconnectionDelay(e.reconnectionDelay || 1e3),
                this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3),
                this.randomizationFactor(e.randomizationFactor || .5),
                this.backoff = new f({
                    min: this.reconnectionDelay(),
                    max: this.reconnectionDelayMax(),
                    jitter: this.randomizationFactor()
                }),
                this.timeout(null == e.timeout ? 2e4 : e.timeout),
                this.readyState = "closed",
                this.uri = t,
                this.connecting = [],
                this.lastPing = null,
                this.encoding = !1,
                this.packetBuffer = [];
                var r = e.parser || c;
                this.encoder = new r.Encoder,
                this.decoder = new r.Decoder,
                this.autoConnect = e.autoConnect !== !1,
                this.autoConnect && this.open()
            }
            var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            }
            : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            }
              , i = r(10)
              , s = r(33)
              , a = r(5)
              , c = r(4)
              , p = r(35)
              , h = r(36)
              , u = (r(3)("socket.io-client:manager"),
            r(32))
              , f = r(37)
              , l = Object.prototype.hasOwnProperty;
            t.exports = n,
            n.prototype.emitAll = function() {
                this.emit.apply(this, arguments);
                for (var t in this.nsps)
                    l.call(this.nsps, t) && this.nsps[t].emit.apply(this.nsps[t], arguments)
            }
            ,
            n.prototype.updateSocketIds = function() {
                for (var t in this.nsps)
                    l.call(this.nsps, t) && (this.nsps[t].id = this.generateId(t))
            }
            ,
            n.prototype.generateId = function(t) {
                return ("/" === t ? "" : t + "#") + this.engine.id
            }
            ,
            a(n.prototype),
            n.prototype.reconnection = function(t) {
                return arguments.length ? (this._reconnection = !!t,
                this) : this._reconnection
            }
            ,
            n.prototype.reconnectionAttempts = function(t) {
                return arguments.length ? (this._reconnectionAttempts = t,
                this) : this._reconnectionAttempts
            }
            ,
            n.prototype.reconnectionDelay = function(t) {
                return arguments.length ? (this._reconnectionDelay = t,
                this.backoff && this.backoff.setMin(t),
                this) : this._reconnectionDelay
            }
            ,
            n.prototype.randomizationFactor = function(t) {
                return arguments.length ? (this._randomizationFactor = t,
                this.backoff && this.backoff.setJitter(t),
                this) : this._randomizationFactor
            }
            ,
            n.prototype.reconnectionDelayMax = function(t) {
                return arguments.length ? (this._reconnectionDelayMax = t,
                this.backoff && this.backoff.setMax(t),
                this) : this._reconnectionDelayMax
            }
            ,
            n.prototype.timeout = function(t) {
                return arguments.length ? (this._timeout = t,
                this) : this._timeout
            }
            ,
            n.prototype.maybeReconnectOnOpen = function() {
                !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect()
            }
            ,
            n.prototype.open = n.prototype.connect = function(t, e) {
                if (~this.readyState.indexOf("open"))
                    return this;
                this.engine = i(this.uri, this.opts);
                var r = this.engine
                  , n = this;
                this.readyState = "opening",
                this.skipReconnect = !1;
                var o = p(r, "open", function() {
                    n.onopen(),
                    t && t()
                })
                  , s = p(r, "error", function(e) {
                    if (n.cleanup(),
                    n.readyState = "closed",
                    n.emitAll("connect_error", e),
                    t) {
                        var r = new Error("Connection error");
                        r.data = e,
                        t(r)
                    } else
                        n.maybeReconnectOnOpen()
                });
                if (!1 !== this._timeout) {
                    var a = this._timeout
                      , c = setTimeout(function() {
                        o.destroy(),
                        r.close(),
                        r.emit("error", "timeout"),
                        n.emitAll("connect_timeout", a)
                    }, a);
                    this.subs.push({
                        destroy: function() {
                            clearTimeout(c)
                        }
                    })
                }
                return this.subs.push(o),
                this.subs.push(s),
                this
            }
            ,
            n.prototype.onopen = function() {
                this.cleanup(),
                this.readyState = "open",
                this.emit("open");
                var t = this.engine;
                this.subs.push(p(t, "data", h(this, "ondata"))),
                this.subs.push(p(t, "ping", h(this, "onping"))),
                this.subs.push(p(t, "pong", h(this, "onpong"))),
                this.subs.push(p(t, "error", h(this, "onerror"))),
                this.subs.push(p(t, "close", h(this, "onclose"))),
                this.subs.push(p(this.decoder, "decoded", h(this, "ondecoded")))
            }
            ,
            n.prototype.onping = function() {
                this.lastPing = new Date,
                this.emitAll("ping")
            }
            ,
            n.prototype.onpong = function() {
                this.emitAll("pong", new Date - this.lastPing)
            }
            ,
            n.prototype.ondata = function(t) {
                this.decoder.add(t)
            }
            ,
            n.prototype.ondecoded = function(t) {
                this.emit("packet", t)
            }
            ,
            n.prototype.onerror = function(t) {
                this.emitAll("error", t)
            }
            ,
            n.prototype.socket = function(t, e) {
                function r() {
                    ~u(o.connecting, n) || o.connecting.push(n)
                }
                var n = this.nsps[t];
                if (!n) {
                    n = new s(this,t,e),
                    this.nsps[t] = n;
                    var o = this;
                    n.on("connecting", r),
                    n.on("connect", function() {
                        n.id = o.generateId(t)
                    }),
                    this.autoConnect && r()
                }
                return n
            }
            ,
            n.prototype.destroy = function(t) {
                var e = u(this.connecting, t);
                ~e && this.connecting.splice(e, 1),
                this.connecting.length || this.close()
            }
            ,
            n.prototype.packet = function(t) {
                var e = this;
                t.query && 0 === t.type && (t.nsp += "?" + t.query),
                e.encoding ? e.packetBuffer.push(t) : (e.encoding = !0,
                this.encoder.encode(t, function(r) {
                    for (var n = 0; n < r.length; n++)
                        e.engine.write(r[n], t.options);
                    e.encoding = !1,
                    e.processPacketQueue()
                }))
            }
            ,
            n.prototype.processPacketQueue = function() {
                if (this.packetBuffer.length > 0 && !this.encoding) {
                    var t = this.packetBuffer.shift();
                    this.packet(t)
                }
            }
            ,
            n.prototype.cleanup = function() {
                for (var t = this.subs.length, e = 0; e < t; e++) {
                    var r = this.subs.shift();
                    r.destroy()
                }
                this.packetBuffer = [],
                this.encoding = !1,
                this.lastPing = null,
                this.decoder.destroy()
            }
            ,
            n.prototype.close = n.prototype.disconnect = function() {
                this.skipReconnect = !0,
                this.reconnecting = !1,
                "opening" === this.readyState && this.cleanup(),
                this.backoff.reset(),
                this.readyState = "closed",
                this.engine && this.engine.close()
            }
            ,
            n.prototype.onclose = function(t) {
                this.cleanup(),
                this.backoff.reset(),
                this.readyState = "closed",
                this.emit("close", t),
                this._reconnection && !this.skipReconnect && this.reconnect()
            }
            ,
            n.prototype.reconnect = function() {
                if (this.reconnecting || this.skipReconnect)
                    return this;
                var t = this;
                if (this.backoff.attempts >= this._reconnectionAttempts)
                    this.backoff.reset(),
                    this.emitAll("reconnect_failed"),
                    this.reconnecting = !1;
                else {
                    var e = this.backoff.duration();
                    this.reconnecting = !0;
                    var r = setTimeout(function() {
                        t.skipReconnect || (t.emitAll("reconnect_attempt", t.backoff.attempts),
                        t.emitAll("reconnecting", t.backoff.attempts),
                        t.skipReconnect || t.open(function(e) {
                            e ? (t.reconnecting = !1,
                            t.reconnect(),
                            t.emitAll("reconnect_error", e.data)) : t.onreconnect()
                        }))
                    }, e);
                    this.subs.push({
                        destroy: function() {
                            clearTimeout(r)
                        }
                    })
                }
            }
            ,
            n.prototype.onreconnect = function() {
                var t = this.backoff.attempts;
                this.reconnecting = !1,
                this.backoff.reset(),
                this.updateSocketIds(),
                this.emitAll("reconnect", t)
            }
        }
        , function(t, e, r) {
            t.exports = r(11),
            t.exports.parser = r(18)
        }
        , function(t, e, r) {
            function n(t, e) {
                return this instanceof n ? (e = e || {},
                t && "object" == typeof t && (e = t,
                t = null),
                t ? (t = p(t),
                e.hostname = t.host,
                e.secure = "https" === t.protocol || "wss" === t.protocol,
                e.port = t.port,
                t.query && (e.query = t.query)) : e.host && (e.hostname = p(e.host).host),
                this.secure = null != e.secure ? e.secure : "undefined" != typeof location && "https:" === location.protocol,
                e.hostname && !e.port && (e.port = this.secure ? "443" : "80"),
                this.agent = e.agent || !1,
                this.hostname = e.hostname || ("undefined" != typeof location ? location.hostname : "localhost"),
                this.port = e.port || ("undefined" != typeof location && location.port ? location.port : this.secure ? 443 : 80),
                this.query = e.query || {},
                "string" == typeof this.query && (this.query = h.decode(this.query)),
                this.upgrade = !1 !== e.upgrade,
                this.path = (e.path || "/engine.io").replace(/\/$/, "") + "/",
                this.forceJSONP = !!e.forceJSONP,
                this.jsonp = !1 !== e.jsonp,
                this.forceBase64 = !!e.forceBase64,
                this.enablesXDR = !!e.enablesXDR,
                this.withCredentials = !1 !== e.withCredentials,
                this.timestampParam = e.timestampParam || "t",
                this.timestampRequests = e.timestampRequests,
                this.transports = e.transports || ["polling", "websocket"],
                this.transportOptions = e.transportOptions || {},
                this.readyState = "",
                this.writeBuffer = [],
                this.prevBufferLen = 0,
                this.policyPort = e.policyPort || 843,
                this.rememberUpgrade = e.rememberUpgrade || !1,
                this.binaryType = null,
                this.onlyBinaryUpgrades = e.onlyBinaryUpgrades,
                this.perMessageDeflate = !1 !== e.perMessageDeflate && (e.perMessageDeflate || {}),
                !0 === this.perMessageDeflate && (this.perMessageDeflate = {}),
                this.perMessageDeflate && null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024),
                this.pfx = e.pfx || null,
                this.key = e.key || null,
                this.passphrase = e.passphrase || null,
                this.cert = e.cert || null,
                this.ca = e.ca || null,
                this.ciphers = e.ciphers || null,
                this.rejectUnauthorized = void 0 === e.rejectUnauthorized || e.rejectUnauthorized,
                this.forceNode = !!e.forceNode,
                this.isReactNative = "undefined" != typeof navigator && "string" == typeof navigator.product && "reactnative" === navigator.product.toLowerCase(),
                ("undefined" == typeof self || this.isReactNative) && (e.extraHeaders && Object.keys(e.extraHeaders).length > 0 && (this.extraHeaders = e.extraHeaders),
                e.localAddress && (this.localAddress = e.localAddress)),
                this.id = null,
                this.upgrades = null,
                this.pingInterval = null,
                this.pingTimeout = null,
                this.pingIntervalTimer = null,
                this.pingTimeoutTimer = null,
                void this.open()) : new n(t,e)
            }
            function o(t) {
                var e = {};
                for (var r in t)
                    t.hasOwnProperty(r) && (e[r] = t[r]);
                return e
            }
            var i = r(12)
              , s = r(5)
              , a = (r(3)("engine.io-client:socket"),
            r(32))
              , c = r(18)
              , p = r(2)
              , h = r(26);
            t.exports = n,
            n.priorWebsocketSuccess = !1,
            s(n.prototype),
            n.protocol = c.protocol,
            n.Socket = n,
            n.Transport = r(17),
            n.transports = r(12),
            n.parser = r(18),
            n.prototype.createTransport = function(t) {
                var e = o(this.query);
                e.EIO = c.protocol,
                e.transport = t;
                var r = this.transportOptions[t] || {};
                this.id && (e.sid = this.id);
                var n = new i[t]({
                    query: e,
                    socket: this,
                    agent: r.agent || this.agent,
                    hostname: r.hostname || this.hostname,
                    port: r.port || this.port,
                    secure: r.secure || this.secure,
                    path: r.path || this.path,
                    forceJSONP: r.forceJSONP || this.forceJSONP,
                    jsonp: r.jsonp || this.jsonp,
                    forceBase64: r.forceBase64 || this.forceBase64,
                    enablesXDR: r.enablesXDR || this.enablesXDR,
                    withCredentials: r.withCredentials || this.withCredentials,
                    timestampRequests: r.timestampRequests || this.timestampRequests,
                    timestampParam: r.timestampParam || this.timestampParam,
                    policyPort: r.policyPort || this.policyPort,
                    pfx: r.pfx || this.pfx,
                    key: r.key || this.key,
                    passphrase: r.passphrase || this.passphrase,
                    cert: r.cert || this.cert,
                    ca: r.ca || this.ca,
                    ciphers: r.ciphers || this.ciphers,
                    rejectUnauthorized: r.rejectUnauthorized || this.rejectUnauthorized,
                    perMessageDeflate: r.perMessageDeflate || this.perMessageDeflate,
                    extraHeaders: r.extraHeaders || this.extraHeaders,
                    forceNode: r.forceNode || this.forceNode,
                    localAddress: r.localAddress || this.localAddress,
                    requestTimeout: r.requestTimeout || this.requestTimeout,
                    protocols: r.protocols || void 0,
                    isReactNative: this.isReactNative
                });
                return n
            }
            ,
            n.prototype.open = function() {
                var t;
                if (this.rememberUpgrade && n.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1)
                    t = "websocket";
                else {
                    if (0 === this.transports.length) {
                        var e = this;
                        return void setTimeout(function() {
                            e.emit("error", "No transports available")
                        }, 0)
                    }
                    t = this.transports[0]
                }
                this.readyState = "opening";
                try {
                    t = this.createTransport(t)
                } catch (t) {
                    return this.transports.shift(),
                    void this.open()
                }
                t.open(),
                this.setTransport(t)
            }
            ,
            n.prototype.setTransport = function(t) {
                var e = this;
                this.transport && this.transport.removeAllListeners(),
                this.transport = t,
                t.on("drain", function() {
                    e.onDrain()
                }).on("packet", function(t) {
                    e.onPacket(t)
                }).on("error", function(t) {
                    e.onError(t)
                }).on("close", function() {
                    e.onClose("transport close")
                })
            }
            ,
            n.prototype.probe = function(t) {
                function e() {
                    if (u.onlyBinaryUpgrades) {
                        var t = !this.supportsBinary && u.transport.supportsBinary;
                        h = h || t
                    }
                    h || (p.send([{
                        type: "ping",
                        data: "probe"
                    }]),
                    p.once("packet", function(t) {
                        if (!h)
                            if ("pong" === t.type && "probe" === t.data) {
                                if (u.upgrading = !0,
                                u.emit("upgrading", p),
                                !p)
                                    return;
                                n.priorWebsocketSuccess = "websocket" === p.name,
                                u.transport.pause(function() {
                                    h || "closed" !== u.readyState && (c(),
                                    u.setTransport(p),
                                    p.send([{
                                        type: "upgrade"
                                    }]),
                                    u.emit("upgrade", p),
                                    p = null,
                                    u.upgrading = !1,
                                    u.flush())
                                })
                            } else {
                                var e = new Error("probe error");
                                e.transport = p.name,
                                u.emit("upgradeError", e)
                            }
                    }))
                }
                function r() {
                    h || (h = !0,
                    c(),
                    p.close(),
                    p = null)
                }
                function o(t) {
                    var e = new Error("probe error: " + t);
                    e.transport = p.name,
                    r(),
                    u.emit("upgradeError", e)
                }
                function i() {
                    o("transport closed")
                }
                function s() {
                    o("socket closed")
                }
                function a(t) {
                    p && t.name !== p.name && r()
                }
                function c() {
                    p.removeListener("open", e),
                    p.removeListener("error", o),
                    p.removeListener("close", i),
                    u.removeListener("close", s),
                    u.removeListener("upgrading", a)
                }
                var p = this.createTransport(t, {
                    probe: 1
                })
                  , h = !1
                  , u = this;
                n.priorWebsocketSuccess = !1,
                p.once("open", e),
                p.once("error", o),
                p.once("close", i),
                this.once("close", s),
                this.once("upgrading", a),
                p.open()
            }
            ,
            n.prototype.onOpen = function() {
                if (this.readyState = "open",
                n.priorWebsocketSuccess = "websocket" === this.transport.name,
                this.emit("open"),
                this.flush(),
                "open" === this.readyState && this.upgrade && this.transport.pause)
                    for (var t = 0, e = this.upgrades.length; t < e; t++)
                        this.probe(this.upgrades[t])
            }
            ,
            n.prototype.onPacket = function(t) {
                if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState)
                    switch (this.emit("packet", t),
                    this.emit("heartbeat"),
                    t.type) {
                    case "open":
                        this.onHandshake(JSON.parse(t.data));
                        break;
                    case "pong":
                        this.setPing(),
                        this.emit("pong");
                        break;
                    case "error":
                        var e = new Error("server error");
                        e.code = t.data,
                        this.onError(e);
                        break;
                    case "message":
                        this.emit("data", t.data),
                        this.emit("message", t.data)
                    }
            }
            ,
            n.prototype.onHandshake = function(t) {
                this.emit("handshake", t),
                this.id = t.sid,
                this.transport.query.sid = t.sid,
                this.upgrades = this.filterUpgrades(t.upgrades),
                this.pingInterval = t.pingInterval,
                this.pingTimeout = t.pingTimeout,
                this.onOpen(),
                "closed" !== this.readyState && (this.setPing(),
                this.removeListener("heartbeat", this.onHeartbeat),
                this.on("heartbeat", this.onHeartbeat))
            }
            ,
            n.prototype.onHeartbeat = function(t) {
                clearTimeout(this.pingTimeoutTimer);
                var e = this;
                e.pingTimeoutTimer = setTimeout(function() {
                    "closed" !== e.readyState && e.onClose("ping timeout")
                }, t || e.pingInterval + e.pingTimeout)
            }
            ,
            n.prototype.setPing = function() {
                var t = this;
                clearTimeout(t.pingIntervalTimer),
                t.pingIntervalTimer = setTimeout(function() {
                    t.ping(),
                    t.onHeartbeat(t.pingTimeout)
                }, t.pingInterval)
            }
            ,
            n.prototype.ping = function() {
                var t = this;
                this.sendPacket("ping", function() {
                    t.emit("ping")
                })
            }
            ,
            n.prototype.onDrain = function() {
                this.writeBuffer.splice(0, this.prevBufferLen),
                this.prevBufferLen = 0,
                0 === this.writeBuffer.length ? this.emit("drain") : this.flush()
            }
            ,
            n.prototype.flush = function() {
                "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (this.transport.send(this.writeBuffer),
                this.prevBufferLen = this.writeBuffer.length,
                this.emit("flush"))
            }
            ,
            n.prototype.write = n.prototype.send = function(t, e, r) {
                return this.sendPacket("message", t, e, r),
                this
            }
            ,
            n.prototype.sendPacket = function(t, e, r, n) {
                if ("function" == typeof e && (n = e,
                e = void 0),
                "function" == typeof r && (n = r,
                r = null),
                "closing" !== this.readyState && "closed" !== this.readyState) {
                    r = r || {},
                    r.compress = !1 !== r.compress;
                    var o = {
                        type: t,
                        data: e,
                        options: r
                    };
                    this.emit("packetCreate", o),
                    this.writeBuffer.push(o),
                    n && this.once("flush", n),
                    this.flush()
                }
            }
            ,
            n.prototype.close = function() {
                function t() {
                    n.onClose("forced close"),
                    n.transport.close()
                }
                function e() {
                    n.removeListener("upgrade", e),
                    n.removeListener("upgradeError", e),
                    t()
                }
                function r() {
                    n.once("upgrade", e),
                    n.once("upgradeError", e)
                }
                if ("opening" === this.readyState || "open" === this.readyState) {
                    this.readyState = "closing";
                    var n = this;
                    this.writeBuffer.length ? this.once("drain", function() {
                        this.upgrading ? r() : t()
                    }) : this.upgrading ? r() : t()
                }
                return this
            }
            ,
            n.prototype.onError = function(t) {
                n.priorWebsocketSuccess = !1,
                this.emit("error", t),
                this.onClose("transport error", t)
            }
            ,
            n.prototype.onClose = function(t, e) {
                if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
                    var r = this;
                    clearTimeout(this.pingIntervalTimer),
                    clearTimeout(this.pingTimeoutTimer),
                    this.transport.removeAllListeners("close"),
                    this.transport.close(),
                    this.transport.removeAllListeners(),
                    this.readyState = "closed",
                    this.id = null,
                    this.emit("close", t, e),
                    r.writeBuffer = [],
                    r.prevBufferLen = 0
                }
            }
            ,
            n.prototype.filterUpgrades = function(t) {
                for (var e = [], r = 0, n = t.length; r < n; r++)
                    ~a(this.transports, t[r]) && e.push(t[r]);
                return e
            }
        }
        , function(t, e, r) {
            function n(t) {
                var e, r = !1, n = !1, a = !1 !== t.jsonp;
                if ("undefined" != typeof location) {
                    var c = "https:" === location.protocol
                      , p = location.port;
                    p || (p = c ? 443 : 80),
                    r = t.hostname !== location.hostname || p !== t.port,
                    n = t.secure !== c
                }
                if (t.xdomain = r,
                t.xscheme = n,
                e = new o(t),
                "open"in e && !t.forceJSONP)
                    return new i(t);
                if (!a)
                    throw new Error("JSONP disabled");
                return new s(t)
            }
            var o = r(13)
              , i = r(15)
              , s = r(29)
              , a = r(30);
            e.polling = n,
            e.websocket = a
        }
        , function(t, e, r) {
            var n = r(14);
            t.exports = function(t) {
                var e = t.xdomain
                  , r = t.xscheme
                  , o = t.enablesXDR;
                try {
                    if ("undefined" != typeof XMLHttpRequest && (!e || n))
                        return new XMLHttpRequest
                } catch (t) {}
                try {
                    if ("undefined" != typeof XDomainRequest && !r && o)
                        return new XDomainRequest
                } catch (t) {}
                if (!e)
                    try {
                        return new (self[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
                    } catch (t) {}
            }
        }
        , function(t, e) {
            try {
                t.exports = "undefined" != typeof XMLHttpRequest && "withCredentials"in new XMLHttpRequest
            } catch (e) {
                t.exports = !1
            }
        }
        , function(t, e, r) {
            function n() {}
            function o(t) {
                if (c.call(this, t),
                this.requestTimeout = t.requestTimeout,
                this.extraHeaders = t.extraHeaders,
                "undefined" != typeof location) {
                    var e = "https:" === location.protocol
                      , r = location.port;
                    r || (r = e ? 443 : 80),
                    this.xd = "undefined" != typeof location && t.hostname !== location.hostname || r !== t.port,
                    this.xs = t.secure !== e
                }
            }
            function i(t) {
                this.method = t.method || "GET",
                this.uri = t.uri,
                this.xd = !!t.xd,
                this.xs = !!t.xs,
                this.async = !1 !== t.async,
                this.data = void 0 !== t.data ? t.data : null,
                this.agent = t.agent,
                this.isBinary = t.isBinary,
                this.supportsBinary = t.supportsBinary,
                this.enablesXDR = t.enablesXDR,
                this.withCredentials = t.withCredentials,
                this.requestTimeout = t.requestTimeout,
                this.pfx = t.pfx,
                this.key = t.key,
                this.passphrase = t.passphrase,
                this.cert = t.cert,
                this.ca = t.ca,
                this.ciphers = t.ciphers,
                this.rejectUnauthorized = t.rejectUnauthorized,
                this.extraHeaders = t.extraHeaders,
                this.create()
            }
            function s() {
                for (var t in i.requests)
                    i.requests.hasOwnProperty(t) && i.requests[t].abort()
            }
            var a = r(13)
              , c = r(16)
              , p = r(5)
              , h = r(27);
            r(3)("engine.io-client:polling-xhr");
            if (t.exports = o,
            t.exports.Request = i,
            h(o, c),
            o.prototype.supportsBinary = !0,
            o.prototype.request = function(t) {
                return t = t || {},
                t.uri = this.uri(),
                t.xd = this.xd,
                t.xs = this.xs,
                t.agent = this.agent || !1,
                t.supportsBinary = this.supportsBinary,
                t.enablesXDR = this.enablesXDR,
                t.withCredentials = this.withCredentials,
                t.pfx = this.pfx,
                t.key = this.key,
                t.passphrase = this.passphrase,
                t.cert = this.cert,
                t.ca = this.ca,
                t.ciphers = this.ciphers,
                t.rejectUnauthorized = this.rejectUnauthorized,
                t.requestTimeout = this.requestTimeout,
                t.extraHeaders = this.extraHeaders,
                new i(t)
            }
            ,
            o.prototype.doWrite = function(t, e) {
                var r = "string" != typeof t && void 0 !== t
                  , n = this.request({
                    method: "POST",
                    data: t,
                    isBinary: r
                })
                  , o = this;
                n.on("success", e),
                n.on("error", function(t) {
                    o.onError("xhr post error", t)
                }),
                this.sendXhr = n
            }
            ,
            o.prototype.doPoll = function() {
                var t = this.request()
                  , e = this;
                t.on("data", function(t) {
                    e.onData(t)
                }),
                t.on("error", function(t) {
                    e.onError("xhr poll error", t)
                }),
                this.pollXhr = t
            }
            ,
            p(i.prototype),
            i.prototype.create = function() {
                var t = {
                    agent: this.agent,
                    xdomain: this.xd,
                    xscheme: this.xs,
                    enablesXDR: this.enablesXDR
                };
                t.pfx = this.pfx,
                t.key = this.key,
                t.passphrase = this.passphrase,
                t.cert = this.cert,
                t.ca = this.ca,
                t.ciphers = this.ciphers,
                t.rejectUnauthorized = this.rejectUnauthorized;
                var e = this.xhr = new a(t)
                  , r = this;
                try {
                    e.open(this.method, this.uri, this.async);
                    try {
                        if (this.extraHeaders) {
                            e.setDisableHeaderCheck && e.setDisableHeaderCheck(!0);
                            for (var n in this.extraHeaders)
                                this.extraHeaders.hasOwnProperty(n) && e.setRequestHeader(n, this.extraHeaders[n])
                        }
                    } catch (t) {}
                    if ("POST" === this.method)
                        try {
                            this.isBinary ? e.setRequestHeader("Content-type", "application/octet-stream") : e.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
                        } catch (t) {}
                    try {
                        e.setRequestHeader("Accept", "*/*")
                    } catch (t) {}
                    "withCredentials"in e && (e.withCredentials = this.withCredentials),
                    this.requestTimeout && (e.timeout = this.requestTimeout),
                    this.hasXDR() ? (e.onload = function() {
                        r.onLoad()
                    }
                    ,
                    e.onerror = function() {
                        r.onError(e.responseText)
                    }
                    ) : e.onreadystatechange = function() {
                        if (2 === e.readyState)
                            try {
                                var t = e.getResponseHeader("Content-Type");
                                (r.supportsBinary && "application/octet-stream" === t || "application/octet-stream; charset=UTF-8" === t) && (e.responseType = "arraybuffer")
                            } catch (t) {}
                        4 === e.readyState && (200 === e.status || 1223 === e.status ? r.onLoad() : setTimeout(function() {
                            r.onError("number" == typeof e.status ? e.status : 0)
                        }, 0))
                    }
                    ,
                    e.send(this.data)
                } catch (t) {
                    return void setTimeout(function() {
                        r.onError(t)
                    }, 0)
                }
                "undefined" != typeof document && (this.index = i.requestsCount++,
                i.requests[this.index] = this)
            }
            ,
            i.prototype.onSuccess = function() {
                this.emit("success"),
                this.cleanup()
            }
            ,
            i.prototype.onData = function(t) {
                this.emit("data", t),
                this.onSuccess()
            }
            ,
            i.prototype.onError = function(t) {
                this.emit("error", t),
                this.cleanup(!0)
            }
            ,
            i.prototype.cleanup = function(t) {
                if ("undefined" != typeof this.xhr && null !== this.xhr) {
                    if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = n : this.xhr.onreadystatechange = n,
                    t)
                        try {
                            this.xhr.abort()
                        } catch (t) {}
                    "undefined" != typeof document && delete i.requests[this.index],
                    this.xhr = null
                }
            }
            ,
            i.prototype.onLoad = function() {
                var t;
                try {
                    var e;
                    try {
                        e = this.xhr.getResponseHeader("Content-Type")
                    } catch (t) {}
                    t = "application/octet-stream" === e || "application/octet-stream; charset=UTF-8" === e ? this.xhr.response || this.xhr.responseText : this.xhr.responseText
                } catch (t) {
                    this.onError(t)
                }
                null != t && this.onData(t)
            }
            ,
            i.prototype.hasXDR = function() {
                return "undefined" != typeof XDomainRequest && !this.xs && this.enablesXDR
            }
            ,
            i.prototype.abort = function() {
                this.cleanup()
            }
            ,
            i.requestsCount = 0,
            i.requests = {},
            "undefined" != typeof document)
                if ("function" == typeof attachEvent)
                    attachEvent("onunload", s);
                else if ("function" == typeof addEventListener) {
                    var u = "onpagehide"in self ? "pagehide" : "unload";
                    addEventListener(u, s, !1)
                }
        }
        , function(t, e, r) {
            function n(t) {
                var e = t && t.forceBase64;
                p && !e || (this.supportsBinary = !1),
                o.call(this, t)
            }
            var o = r(17)
              , i = r(26)
              , s = r(18)
              , a = r(27)
              , c = r(28);
            r(3)("engine.io-client:polling");
            t.exports = n;
            var p = function() {
                var t = r(13)
                  , e = new t({
                    xdomain: !1
                });
                return null != e.responseType
            }();
            a(n, o),
            n.prototype.name = "polling",
            n.prototype.doOpen = function() {
                this.poll()
            }
            ,
            n.prototype.pause = function(t) {
                function e() {
                    r.readyState = "paused",
                    t()
                }
                var r = this;
                if (this.readyState = "pausing",
                this.polling || !this.writable) {
                    var n = 0;
                    this.polling && (n++,
                    this.once("pollComplete", function() {
                        --n || e()
                    })),
                    this.writable || (n++,
                    this.once("drain", function() {
                        --n || e()
                    }))
                } else
                    e()
            }
            ,
            n.prototype.poll = function() {
                this.polling = !0,
                this.doPoll(),
                this.emit("poll")
            }
            ,
            n.prototype.onData = function(t) {
                var e = this
                  , r = function(t, r, n) {
                    return "opening" === e.readyState && e.onOpen(),
                    "close" === t.type ? (e.onClose(),
                    !1) : void e.onPacket(t)
                };
                s.decodePayload(t, this.socket.binaryType, r),
                "closed" !== this.readyState && (this.polling = !1,
                this.emit("pollComplete"),
                "open" === this.readyState && this.poll())
            }
            ,
            n.prototype.doClose = function() {
                function t() {
                    e.write([{
                        type: "close"
                    }])
                }
                var e = this;
                "open" === this.readyState ? t() : this.once("open", t)
            }
            ,
            n.prototype.write = function(t) {
                var e = this;
                this.writable = !1;
                var r = function() {
                    e.writable = !0,
                    e.emit("drain")
                };
                s.encodePayload(t, this.supportsBinary, function(t) {
                    e.doWrite(t, r)
                })
            }
            ,
            n.prototype.uri = function() {
                var t = this.query || {}
                  , e = this.secure ? "https" : "http"
                  , r = "";
                !1 !== this.timestampRequests && (t[this.timestampParam] = c()),
                this.supportsBinary || t.sid || (t.b64 = 1),
                t = i.encode(t),
                this.port && ("https" === e && 443 !== Number(this.port) || "http" === e && 80 !== Number(this.port)) && (r = ":" + this.port),
                t.length && (t = "?" + t);
                var n = this.hostname.indexOf(":") !== -1;
                return e + "://" + (n ? "[" + this.hostname + "]" : this.hostname) + r + this.path + t
            }
        }
        , function(t, e, r) {
            function n(t) {
                this.path = t.path,
                this.hostname = t.hostname,
                this.port = t.port,
                this.secure = t.secure,
                this.query = t.query,
                this.timestampParam = t.timestampParam,
                this.timestampRequests = t.timestampRequests,
                this.readyState = "",
                this.agent = t.agent || !1,
                this.socket = t.socket,
                this.enablesXDR = t.enablesXDR,
                this.withCredentials = t.withCredentials,
                this.pfx = t.pfx,
                this.key = t.key,
                this.passphrase = t.passphrase,
                this.cert = t.cert,
                this.ca = t.ca,
                this.ciphers = t.ciphers,
                this.rejectUnauthorized = t.rejectUnauthorized,
                this.forceNode = t.forceNode,
                this.isReactNative = t.isReactNative,
                this.extraHeaders = t.extraHeaders,
                this.localAddress = t.localAddress
            }
            var o = r(18)
              , i = r(5);
            t.exports = n,
            i(n.prototype),
            n.prototype.onError = function(t, e) {
                var r = new Error(t);
                return r.type = "TransportError",
                r.description = e,
                this.emit("error", r),
                this
            }
            ,
            n.prototype.open = function() {
                return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening",
                this.doOpen()),
                this
            }
            ,
            n.prototype.close = function() {
                return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(),
                this.onClose()),
                this
            }
            ,
            n.prototype.send = function(t) {
                if ("open" !== this.readyState)
                    throw new Error("Transport not open");
                this.write(t)
            }
            ,
            n.prototype.onOpen = function() {
                this.readyState = "open",
                this.writable = !0,
                this.emit("open")
            }
            ,
            n.prototype.onData = function(t) {
                var e = o.decodePacket(t, this.socket.binaryType);
                this.onPacket(e)
            }
            ,
            n.prototype.onPacket = function(t) {
                this.emit("packet", t)
            }
            ,
            n.prototype.onClose = function() {
                this.readyState = "closed",
                this.emit("close")
            }
        }
        , function(t, e, r) {
            function n(t, r) {
                var n = "b" + e.packets[t.type] + t.data.data;
                return r(n)
            }
            function o(t, r, n) {
                if (!r)
                    return e.encodeBase64Packet(t, n);
                var o = t.data
                  , i = new Uint8Array(o)
                  , s = new Uint8Array(1 + o.byteLength);
                s[0] = v[t.type];
                for (var a = 0; a < i.length; a++)
                    s[a + 1] = i[a];
                return n(s.buffer)
            }
            function i(t, r, n) {
                if (!r)
                    return e.encodeBase64Packet(t, n);
                var o = new FileReader;
                return o.onload = function() {
                    e.encodePacket({
                        type: t.type,
                        data: o.result
                    }, r, !0, n)
                }
                ,
                o.readAsArrayBuffer(t.data)
            }
            function s(t, r, n) {
                if (!r)
                    return e.encodeBase64Packet(t, n);
                if (g)
                    return i(t, r, n);
                var o = new Uint8Array(1);
                o[0] = v[t.type];
                var s = new w([o.buffer, t.data]);
                return n(s)
            }
            function a(t) {
                try {
                    t = d.decode(t, {
                        strict: !1
                    })
                } catch (t) {
                    return !1
                }
                return t
            }
            function c(t, e, r) {
                for (var n = new Array(t.length), o = l(t.length, r), i = function(t, r, o) {
                    e(r, function(e, r) {
                        n[t] = r,
                        o(e, n)
                    })
                }, s = 0; s < t.length; s++)
                    i(s, t[s], o)
            }
            var p, h = r(19), u = r(20), f = r(21), l = r(22), d = r(23);
            "undefined" != typeof ArrayBuffer && (p = r(24));
            var y = "undefined" != typeof navigator && /Android/i.test(navigator.userAgent)
              , m = "undefined" != typeof navigator && /PhantomJS/i.test(navigator.userAgent)
              , g = y || m;
            e.protocol = 3;
            var v = e.packets = {
                open: 0,
                close: 1,
                ping: 2,
                pong: 3,
                message: 4,
                upgrade: 5,
                noop: 6
            }
              , b = h(v)
              , k = {
                type: "error",
                data: "parser error"
            }
              , w = r(25);
            e.encodePacket = function(t, e, r, i) {
                "function" == typeof e && (i = e,
                e = !1),
                "function" == typeof r && (i = r,
                r = null);
                var a = void 0 === t.data ? void 0 : t.data.buffer || t.data;
                if ("undefined" != typeof ArrayBuffer && a instanceof ArrayBuffer)
                    return o(t, e, i);
                if ("undefined" != typeof w && a instanceof w)
                    return s(t, e, i);
                if (a && a.base64)
                    return n(t, i);
                var c = v[t.type];
                return void 0 !== t.data && (c += r ? d.encode(String(t.data), {
                    strict: !1
                }) : String(t.data)),
                i("" + c)
            }
            ,
            e.encodeBase64Packet = function(t, r) {
                var n = "b" + e.packets[t.type];
                if ("undefined" != typeof w && t.data instanceof w) {
                    var o = new FileReader;
                    return o.onload = function() {
                        var t = o.result.split(",")[1];
                        r(n + t)
                    }
                    ,
                    o.readAsDataURL(t.data)
                }
                var i;
                try {
                    i = String.fromCharCode.apply(null, new Uint8Array(t.data))
                } catch (e) {
                    for (var s = new Uint8Array(t.data), a = new Array(s.length), c = 0; c < s.length; c++)
                        a[c] = s[c];
                    i = String.fromCharCode.apply(null, a)
                }
                return n += btoa(i),
                r(n)
            }
            ,
            e.decodePacket = function(t, r, n) {
                if (void 0 === t)
                    return k;
                if ("string" == typeof t) {
                    if ("b" === t.charAt(0))
                        return e.decodeBase64Packet(t.substr(1), r);
                    if (n && (t = a(t),
                    t === !1))
                        return k;
                    var o = t.charAt(0);
                    return Number(o) == o && b[o] ? t.length > 1 ? {
                        type: b[o],
                        data: t.substring(1)
                    } : {
                        type: b[o]
                    } : k
                }
                var i = new Uint8Array(t)
                  , o = i[0]
                  , s = f(t, 1);
                return w && "blob" === r && (s = new w([s])),
                {
                    type: b[o],
                    data: s
                }
            }
            ,
            e.decodeBase64Packet = function(t, e) {
                var r = b[t.charAt(0)];
                if (!p)
                    return {
                        type: r,
                        data: {
                            base64: !0,
                            data: t.substr(1)
                        }
                    };
                var n = p.decode(t.substr(1));
                return "blob" === e && w && (n = new w([n])),
                {
                    type: r,
                    data: n
                }
            }
            ,
            e.encodePayload = function(t, r, n) {
                function o(t) {
                    return t.length + ":" + t
                }
                function i(t, n) {
                    e.encodePacket(t, !!s && r, !1, function(t) {
                        n(null, o(t))
                    })
                }
                "function" == typeof r && (n = r,
                r = null);
                var s = u(t);
                return r && s ? w && !g ? e.encodePayloadAsBlob(t, n) : e.encodePayloadAsArrayBuffer(t, n) : t.length ? void c(t, i, function(t, e) {
                    return n(e.join(""))
                }) : n("0:")
            }
            ,
            e.decodePayload = function(t, r, n) {
                if ("string" != typeof t)
                    return e.decodePayloadAsBinary(t, r, n);
                "function" == typeof r && (n = r,
                r = null);
                var o;
                if ("" === t)
                    return n(k, 0, 1);
                for (var i, s, a = "", c = 0, p = t.length; c < p; c++) {
                    var h = t.charAt(c);
                    if (":" === h) {
                        if ("" === a || a != (i = Number(a)))
                            return n(k, 0, 1);
                        if (s = t.substr(c + 1, i),
                        a != s.length)
                            return n(k, 0, 1);
                        if (s.length) {
                            if (o = e.decodePacket(s, r, !1),
                            k.type === o.type && k.data === o.data)
                                return n(k, 0, 1);
                            var u = n(o, c + i, p);
                            if (!1 === u)
                                return
                        }
                        c += i,
                        a = ""
                    } else
                        a += h
                }
                return "" !== a ? n(k, 0, 1) : void 0
            }
            ,
            e.encodePayloadAsArrayBuffer = function(t, r) {
                function n(t, r) {
                    e.encodePacket(t, !0, !0, function(t) {
                        return r(null, t)
                    })
                }
                return t.length ? void c(t, n, function(t, e) {
                    var n = e.reduce(function(t, e) {
                        var r;
                        return r = "string" == typeof e ? e.length : e.byteLength,
                        t + r.toString().length + r + 2
                    }, 0)
                      , o = new Uint8Array(n)
                      , i = 0;
                    return e.forEach(function(t) {
                        var e = "string" == typeof t
                          , r = t;
                        if (e) {
                            for (var n = new Uint8Array(t.length), s = 0; s < t.length; s++)
                                n[s] = t.charCodeAt(s);
                            r = n.buffer
                        }
                        e ? o[i++] = 0 : o[i++] = 1;
                        for (var a = r.byteLength.toString(), s = 0; s < a.length; s++)
                            o[i++] = parseInt(a[s]);
                        o[i++] = 255;
                        for (var n = new Uint8Array(r), s = 0; s < n.length; s++)
                            o[i++] = n[s]
                    }),
                    r(o.buffer)
                }) : r(new ArrayBuffer(0))
            }
            ,
            e.encodePayloadAsBlob = function(t, r) {
                function n(t, r) {
                    e.encodePacket(t, !0, !0, function(t) {
                        var e = new Uint8Array(1);
                        if (e[0] = 1,
                        "string" == typeof t) {
                            for (var n = new Uint8Array(t.length), o = 0; o < t.length; o++)
                                n[o] = t.charCodeAt(o);
                            t = n.buffer,
                            e[0] = 0
                        }
                        for (var i = t instanceof ArrayBuffer ? t.byteLength : t.size, s = i.toString(), a = new Uint8Array(s.length + 1), o = 0; o < s.length; o++)
                            a[o] = parseInt(s[o]);
                        if (a[s.length] = 255,
                        w) {
                            var c = new w([e.buffer, a.buffer, t]);
                            r(null, c)
                        }
                    })
                }
                c(t, n, function(t, e) {
                    return r(new w(e))
                })
            }
            ,
            e.decodePayloadAsBinary = function(t, r, n) {
                "function" == typeof r && (n = r,
                r = null);
                for (var o = t, i = []; o.byteLength > 0; ) {
                    for (var s = new Uint8Array(o), a = 0 === s[0], c = "", p = 1; 255 !== s[p]; p++) {
                        if (c.length > 310)
                            return n(k, 0, 1);
                        c += s[p]
                    }
                    o = f(o, 2 + c.length),
                    c = parseInt(c);
                    var h = f(o, 0, c);
                    if (a)
                        try {
                            h = String.fromCharCode.apply(null, new Uint8Array(h))
                        } catch (t) {
                            var u = new Uint8Array(h);
                            h = "";
                            for (var p = 0; p < u.length; p++)
                                h += String.fromCharCode(u[p])
                        }
                    i.push(h),
                    o = f(o, c)
                }
                var l = i.length;
                i.forEach(function(t, o) {
                    n(e.decodePacket(t, r, !0), o, l)
                })
            }
        }
        , function(t, e) {
            t.exports = Object.keys || function(t) {
                var e = []
                  , r = Object.prototype.hasOwnProperty;
                for (var n in t)
                    r.call(t, n) && e.push(n);
                return e
            }
        }
        , function(t, e, r) {
            function n(t) {
                if (!t || "object" != typeof t)
                    return !1;
                if (o(t)) {
                    for (var e = 0, r = t.length; e < r; e++)
                        if (n(t[e]))
                            return !0;
                    return !1
                }
                if ("function" == typeof Buffer && Buffer.isBuffer && Buffer.isBuffer(t) || "function" == typeof ArrayBuffer && t instanceof ArrayBuffer || s && t instanceof Blob || a && t instanceof File)
                    return !0;
                if (t.toJSON && "function" == typeof t.toJSON && 1 === arguments.length)
                    return n(t.toJSON(), !0);
                for (var i in t)
                    if (Object.prototype.hasOwnProperty.call(t, i) && n(t[i]))
                        return !0;
                return !1
            }
            var o = r(7)
              , i = Object.prototype.toString
              , s = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === i.call(Blob)
              , a = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === i.call(File);
            t.exports = n
        }
        , function(t, e) {
            t.exports = function(t, e, r) {
                var n = t.byteLength;
                if (e = e || 0,
                r = r || n,
                t.slice)
                    return t.slice(e, r);
                if (e < 0 && (e += n),
                r < 0 && (r += n),
                r > n && (r = n),
                e >= n || e >= r || 0 === n)
                    return new ArrayBuffer(0);
                for (var o = new Uint8Array(t), i = new Uint8Array(r - e), s = e, a = 0; s < r; s++,
                a++)
                    i[a] = o[s];
                return i.buffer
            }
        }
        , function(t, e) {
            function r(t, e, r) {
                function o(t, n) {
                    if (o.count <= 0)
                        throw new Error("after called too many times");
                    --o.count,
                    t ? (i = !0,
                    e(t),
                    e = r) : 0 !== o.count || i || e(null, n)
                }
                var i = !1;
                return r = r || n,
                o.count = t,
                0 === t ? e() : o
            }
            function n() {}
            t.exports = r
        }
        , function(t, e) {
            function r(t) {
                for (var e, r, n = [], o = 0, i = t.length; o < i; )
                    e = t.charCodeAt(o++),
                    e >= 55296 && e <= 56319 && o < i ? (r = t.charCodeAt(o++),
                    56320 == (64512 & r) ? n.push(((1023 & e) << 10) + (1023 & r) + 65536) : (n.push(e),
                    o--)) : n.push(e);
                return n
            }
            function n(t) {
                for (var e, r = t.length, n = -1, o = ""; ++n < r; )
                    e = t[n],
                    e > 65535 && (e -= 65536,
                    o += d(e >>> 10 & 1023 | 55296),
                    e = 56320 | 1023 & e),
                    o += d(e);
                return o
            }
            function o(t, e) {
                if (t >= 55296 && t <= 57343) {
                    if (e)
                        throw Error("Lone surrogate U+" + t.toString(16).toUpperCase() + " is not a scalar value");
                    return !1
                }
                return !0
            }
            function i(t, e) {
                return d(t >> e & 63 | 128)
            }
            function s(t, e) {
                if (0 == (4294967168 & t))
                    return d(t);
                var r = "";
                return 0 == (4294965248 & t) ? r = d(t >> 6 & 31 | 192) : 0 == (4294901760 & t) ? (o(t, e) || (t = 65533),
                r = d(t >> 12 & 15 | 224),
                r += i(t, 6)) : 0 == (4292870144 & t) && (r = d(t >> 18 & 7 | 240),
                r += i(t, 12),
                r += i(t, 6)),
                r += d(63 & t | 128)
            }
            function a(t, e) {
                e = e || {};
                for (var n, o = !1 !== e.strict, i = r(t), a = i.length, c = -1, p = ""; ++c < a; )
                    n = i[c],
                    p += s(n, o);
                return p
            }
            function c() {
                if (l >= f)
                    throw Error("Invalid byte index");
                var t = 255 & u[l];
                if (l++,
                128 == (192 & t))
                    return 63 & t;
                throw Error("Invalid continuation byte")
            }
            function p(t) {
                var e, r, n, i, s;
                if (l > f)
                    throw Error("Invalid byte index");
                if (l == f)
                    return !1;
                if (e = 255 & u[l],
                l++,
                0 == (128 & e))
                    return e;
                if (192 == (224 & e)) {
                    if (r = c(),
                    s = (31 & e) << 6 | r,
                    s >= 128)
                        return s;
                    throw Error("Invalid continuation byte")
                }
                if (224 == (240 & e)) {
                    if (r = c(),
                    n = c(),
                    s = (15 & e) << 12 | r << 6 | n,
                    s >= 2048)
                        return o(s, t) ? s : 65533;
                    throw Error("Invalid continuation byte")
                }
                if (240 == (248 & e) && (r = c(),
                n = c(),
                i = c(),
                s = (7 & e) << 18 | r << 12 | n << 6 | i,
                s >= 65536 && s <= 1114111))
                    return s;
                throw Error("Invalid UTF-8 detected")
            }
            function h(t, e) {
                e = e || {};
                var o = !1 !== e.strict;
                u = r(t),
                f = u.length,
                l = 0;
                for (var i, s = []; (i = p(o)) !== !1; )
                    s.push(i);
                return n(s)
            }
            /*! https://mths.be/utf8js v2.1.2 by @mathias */
            var u, f, l, d = String.fromCharCode;
            t.exports = {
                version: "2.1.2",
                encode: a,
                decode: h
            }
        }
        , function(t, e) {
            !function() {
                "use strict";
                for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", r = new Uint8Array(256), n = 0; n < t.length; n++)
                    r[t.charCodeAt(n)] = n;
                e.encode = function(e) {
                    var r, n = new Uint8Array(e), o = n.length, i = "";
                    for (r = 0; r < o; r += 3)
                        i += t[n[r] >> 2],
                        i += t[(3 & n[r]) << 4 | n[r + 1] >> 4],
                        i += t[(15 & n[r + 1]) << 2 | n[r + 2] >> 6],
                        i += t[63 & n[r + 2]];
                    return o % 3 === 2 ? i = i.substring(0, i.length - 1) + "=" : o % 3 === 1 && (i = i.substring(0, i.length - 2) + "=="),
                    i
                }
                ,
                e.decode = function(t) {
                    var e, n, o, i, s, a = .75 * t.length, c = t.length, p = 0;
                    "=" === t[t.length - 1] && (a--,
                    "=" === t[t.length - 2] && a--);
                    var h = new ArrayBuffer(a)
                      , u = new Uint8Array(h);
                    for (e = 0; e < c; e += 4)
                        n = r[t.charCodeAt(e)],
                        o = r[t.charCodeAt(e + 1)],
                        i = r[t.charCodeAt(e + 2)],
                        s = r[t.charCodeAt(e + 3)],
                        u[p++] = n << 2 | o >> 4,
                        u[p++] = (15 & o) << 4 | i >> 2,
                        u[p++] = (3 & i) << 6 | 63 & s;
                    return h
                }
            }()
        }
        , function(t, e) {
            function r(t) {
                return t.map(function(t) {
                    if (t.buffer instanceof ArrayBuffer) {
                        var e = t.buffer;
                        if (t.byteLength !== e.byteLength) {
                            var r = new Uint8Array(t.byteLength);
                            r.set(new Uint8Array(e,t.byteOffset,t.byteLength)),
                            e = r.buffer
                        }
                        return e
                    }
                    return t
                })
            }
            function n(t, e) {
                e = e || {};
                var n = new i;
                return r(t).forEach(function(t) {
                    n.append(t)
                }),
                e.type ? n.getBlob(e.type) : n.getBlob()
            }
            function o(t, e) {
                return new Blob(r(t),e || {})
            }
            var i = "undefined" != typeof i ? i : "undefined" != typeof WebKitBlobBuilder ? WebKitBlobBuilder : "undefined" != typeof MSBlobBuilder ? MSBlobBuilder : "undefined" != typeof MozBlobBuilder && MozBlobBuilder
              , s = function() {
                try {
                    var t = new Blob(["hi"]);
                    return 2 === t.size
                } catch (t) {
                    return !1
                }
            }()
              , a = s && function() {
                try {
                    var t = new Blob([new Uint8Array([1, 2])]);
                    return 2 === t.size
                } catch (t) {
                    return !1
                }
            }()
              , c = i && i.prototype.append && i.prototype.getBlob;
            "undefined" != typeof Blob && (n.prototype = Blob.prototype,
            o.prototype = Blob.prototype),
            t.exports = function() {
                return s ? a ? Blob : o : c ? n : void 0
            }()
        }
        , function(t, e) {
            e.encode = function(t) {
                var e = "";
                for (var r in t)
                    t.hasOwnProperty(r) && (e.length && (e += "&"),
                    e += encodeURIComponent(r) + "=" + encodeURIComponent(t[r]));
                return e
            }
            ,
            e.decode = function(t) {
                for (var e = {}, r = t.split("&"), n = 0, o = r.length; n < o; n++) {
                    var i = r[n].split("=");
                    e[decodeURIComponent(i[0])] = decodeURIComponent(i[1])
                }
                return e
            }
        }
        , function(t, e) {
            t.exports = function(t, e) {
                var r = function() {};
                r.prototype = e.prototype,
                t.prototype = new r,
                t.prototype.constructor = t
            }
        }
        , function(t, e) {
            "use strict";
            function r(t) {
                var e = "";
                do
                    e = s[t % a] + e,
                    t = Math.floor(t / a);
                while (t > 0);
                return e
            }
            function n(t) {
                var e = 0;
                for (h = 0; h < t.length; h++)
                    e = e * a + c[t.charAt(h)];
                return e
            }
            function o() {
                var t = r(+new Date);
                return t !== i ? (p = 0,
                i = t) : t + "." + r(p++)
            }
            for (var i, s = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), a = 64, c = {}, p = 0, h = 0; h < a; h++)
                c[s[h]] = h;
            o.encode = r,
            o.decode = n,
            t.exports = o
        }
        , function(t, e, r) {
            (function(e) {
                function n() {}
                function o() {
                    return "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof e ? e : {}
                }
                function i(t) {
                    if (s.call(this, t),
                    this.query = this.query || {},
                    !c) {
                        var e = o();
                        c = e.___eio = e.___eio || []
                    }
                    this.index = c.length;
                    var r = this;
                    c.push(function(t) {
                        r.onData(t)
                    }),
                    this.query.j = this.index,
                    "function" == typeof addEventListener && addEventListener("beforeunload", function() {
                        r.script && (r.script.onerror = n)
                    }, !1)
                }
                var s = r(16)
                  , a = r(27);
                t.exports = i;
                var c, p = /\n/g, h = /\\n/g;
                a(i, s),
                i.prototype.supportsBinary = !1,
                i.prototype.doClose = function() {
                    this.script && (this.script.parentNode.removeChild(this.script),
                    this.script = null),
                    this.form && (this.form.parentNode.removeChild(this.form),
                    this.form = null,
                    this.iframe = null),
                    s.prototype.doClose.call(this)
                }
                ,
                i.prototype.doPoll = function() {
                    var t = this
                      , e = document.createElement("script");
                    this.script && (this.script.parentNode.removeChild(this.script),
                    this.script = null),
                    e.async = !0,
                    e.src = this.uri(),
                    e.onerror = function(e) {
                        t.onError("jsonp poll error", e)
                    }
                    ;
                    var r = document.getElementsByTagName("script")[0];
                    r ? r.parentNode.insertBefore(e, r) : (document.head || document.body).appendChild(e),
                    this.script = e;
                    var n = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
                    n && setTimeout(function() {
                        var t = document.createElement("iframe");
                        document.body.appendChild(t),
                        document.body.removeChild(t)
                    }, 100)
                }
                ,
                i.prototype.doWrite = function(t, e) {
                    function r() {
                        n(),
                        e()
                    }
                    function n() {
                        if (o.iframe)
                            try {
                                o.form.removeChild(o.iframe)
                            } catch (t) {
                                o.onError("jsonp polling iframe removal error", t)
                            }
                        try {
                            var t = '<iframe src="javascript:0" name="' + o.iframeId + '">';
                            i = document.createElement(t)
                        } catch (t) {
                            i = document.createElement("iframe"),
                            i.name = o.iframeId,
                            i.src = "javascript:0"
                        }
                        i.id = o.iframeId,
                        o.form.appendChild(i),
                        o.iframe = i
                    }
                    var o = this;
                    if (!this.form) {
                        var i, s = document.createElement("form"), a = document.createElement("textarea"), c = this.iframeId = "eio_iframe_" + this.index;
                        s.className = "socketio",
                        s.style.position = "absolute",
                        s.style.top = "-1000px",
                        s.style.left = "-1000px",
                        s.target = c,
                        s.method = "POST",
                        s.setAttribute("accept-charset", "utf-8"),
                        a.name = "d",
                        s.appendChild(a),
                        document.body.appendChild(s),
                        this.form = s,
                        this.area = a
                    }
                    this.form.action = this.uri(),
                    n(),
                    t = t.replace(h, "\\\n"),
                    this.area.value = t.replace(p, "\\n");
                    try {
                        this.form.submit()
                    } catch (t) {}
                    this.iframe.attachEvent ? this.iframe.onreadystatechange = function() {
                        "complete" === o.iframe.readyState && r()
                    }
                    : this.iframe.onload = r
                }
            }
            ).call(e, function() {
                return this
            }())
        }
        , function(t, e, r) {
            function n(t) {
                var e = t && t.forceBase64;
                e && (this.supportsBinary = !1),
                this.perMessageDeflate = t.perMessageDeflate,
                this.usingBrowserWebSocket = o && !t.forceNode,
                this.protocols = t.protocols,
                this.usingBrowserWebSocket || (u = i),
                s.call(this, t)
            }
            var o, i, s = r(17), a = r(18), c = r(26), p = r(27), h = r(28);
            r(3)("engine.io-client:websocket");
            if ("undefined" != typeof WebSocket ? o = WebSocket : "undefined" != typeof self && (o = self.WebSocket || self.MozWebSocket),
            "undefined" == typeof window)
                try {
                    i = r(31)
                } catch (t) {}
            var u = o || i;
            t.exports = n,
            p(n, s),
            n.prototype.name = "websocket",
            n.prototype.supportsBinary = !0,
            n.prototype.doOpen = function() {
                if (this.check()) {
                    var t = this.uri()
                      , e = this.protocols
                      , r = {
                        agent: this.agent,
                        perMessageDeflate: this.perMessageDeflate
                    };
                    r.pfx = this.pfx,
                    r.key = this.key,
                    r.passphrase = this.passphrase,
                    r.cert = this.cert,
                    r.ca = this.ca,
                    r.ciphers = this.ciphers,
                    r.rejectUnauthorized = this.rejectUnauthorized,
                    this.extraHeaders && (r.headers = this.extraHeaders),
                    this.localAddress && (r.localAddress = this.localAddress);
                    try {
                        this.ws = this.usingBrowserWebSocket && !this.isReactNative ? e ? new u(t,e) : new u(t) : new u(t,e,r)
                    } catch (t) {
                        return this.emit("error", t)
                    }
                    void 0 === this.ws.binaryType && (this.supportsBinary = !1),
                    this.ws.supports && this.ws.supports.binary ? (this.supportsBinary = !0,
                    this.ws.binaryType = "nodebuffer") : this.ws.binaryType = "arraybuffer",
                    this.addEventListeners()
                }
            }
            ,
            n.prototype.addEventListeners = function() {
                var t = this;
                this.ws.onopen = function() {
                    t.onOpen()
                }
                ,
                this.ws.onclose = function() {
                    t.onClose()
                }
                ,
                this.ws.onmessage = function(e) {
                    t.onData(e.data)
                }
                ,
                this.ws.onerror = function(e) {
                    t.onError("websocket error", e)
                }
            }
            ,
            n.prototype.write = function(t) {
                function e() {
                    r.emit("flush"),
                    setTimeout(function() {
                        r.writable = !0,
                        r.emit("drain")
                    }, 0)
                }
                var r = this;
                this.writable = !1;
                for (var n = t.length, o = 0, i = n; o < i; o++)
                    !function(t) {
                        a.encodePacket(t, r.supportsBinary, function(o) {
                            if (!r.usingBrowserWebSocket) {
                                var i = {};
                                if (t.options && (i.compress = t.options.compress),
                                r.perMessageDeflate) {
                                    var s = "string" == typeof o ? Buffer.byteLength(o) : o.length;
                                    s < r.perMessageDeflate.threshold && (i.compress = !1)
                                }
                            }
                            try {
                                r.usingBrowserWebSocket ? r.ws.send(o) : r.ws.send(o, i)
                            } catch (t) {}
                            --n || e()
                        })
                    }(t[o])
            }
            ,
            n.prototype.onClose = function() {
                s.prototype.onClose.call(this)
            }
            ,
            n.prototype.doClose = function() {
                "undefined" != typeof this.ws && this.ws.close()
            }
            ,
            n.prototype.uri = function() {
                var t = this.query || {}
                  , e = this.secure ? "wss" : "ws"
                  , r = "";
                this.port && ("wss" === e && 443 !== Number(this.port) || "ws" === e && 80 !== Number(this.port)) && (r = ":" + this.port),
                this.timestampRequests && (t[this.timestampParam] = h()),
                this.supportsBinary || (t.b64 = 1),
                t = c.encode(t),
                t.length && (t = "?" + t);
                var n = this.hostname.indexOf(":") !== -1;
                return e + "://" + (n ? "[" + this.hostname + "]" : this.hostname) + r + this.path + t
            }
            ,
            n.prototype.check = function() {
                return !(!u || "__initialize"in u && this.name === n.prototype.name)
            }
        }
        , function(t, e) {}
        , function(t, e) {
            var r = [].indexOf;
            t.exports = function(t, e) {
                if (r)
                    return t.indexOf(e);
                for (var n = 0; n < t.length; ++n)
                    if (t[n] === e)
                        return n;
                return -1
            }
        }
        , function(t, e, r) {
            "use strict";
            function n(t, e, r) {
                this.io = t,
                this.nsp = e,
                this.json = this,
                this.ids = 0,
                this.acks = {},
                this.receiveBuffer = [],
                this.sendBuffer = [],
                this.connected = !1,
                this.disconnected = !0,
                this.flags = {},
                r && r.query && (this.query = r.query),
                this.io.autoConnect && this.open()
            }
            var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            }
            : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            }
              , i = r(4)
              , s = r(5)
              , a = r(34)
              , c = r(35)
              , p = r(36)
              , h = (r(3)("socket.io-client:socket"),
            r(26))
              , u = r(20);
            t.exports = e = n;
            var f = {
                connect: 1,
                connect_error: 1,
                connect_timeout: 1,
                connecting: 1,
                disconnect: 1,
                error: 1,
                reconnect: 1,
                reconnect_attempt: 1,
                reconnect_failed: 1,
                reconnect_error: 1,
                reconnecting: 1,
                ping: 1,
                pong: 1
            }
              , l = s.prototype.emit;
            s(n.prototype),
            n.prototype.subEvents = function() {
                if (!this.subs) {
                    var t = this.io;
                    this.subs = [c(t, "open", p(this, "onopen")), c(t, "packet", p(this, "onpacket")), c(t, "close", p(this, "onclose"))]
                }
            }
            ,
            n.prototype.open = n.prototype.connect = function() {
                return this.connected ? this : (this.subEvents(),
                this.io.open(),
                "open" === this.io.readyState && this.onopen(),
                this.emit("connecting"),
                this)
            }
            ,
            n.prototype.send = function() {
                var t = a(arguments);
                return t.unshift("message"),
                this.emit.apply(this, t),
                this
            }
            ,
            n.prototype.emit = function(t) {
                if (f.hasOwnProperty(t))
                    return l.apply(this, arguments),
                    this;
                var e = a(arguments)
                  , r = {
                    type: (void 0 !== this.flags.binary ? this.flags.binary : u(e)) ? i.BINARY_EVENT : i.EVENT,
                    data: e
                };
                return r.options = {},
                r.options.compress = !this.flags || !1 !== this.flags.compress,
                "function" == typeof e[e.length - 1] && (this.acks[this.ids] = e.pop(),
                r.id = this.ids++),
                this.connected ? this.packet(r) : this.sendBuffer.push(r),
                this.flags = {},
                this
            }
            ,
            n.prototype.packet = function(t) {
                t.nsp = this.nsp,
                this.io.packet(t)
            }
            ,
            n.prototype.onopen = function() {
                if ("/" !== this.nsp)
                    if (this.query) {
                        var t = "object" === o(this.query) ? h.encode(this.query) : this.query;
                        this.packet({
                            type: i.CONNECT,
                            query: t
                        })
                    } else
                        this.packet({
                            type: i.CONNECT
                        })
            }
            ,
            n.prototype.onclose = function(t) {
                this.connected = !1,
                this.disconnected = !0,
                delete this.id,
                this.emit("disconnect", t)
            }
            ,
            n.prototype.onpacket = function(t) {
                var e = t.nsp === this.nsp
                  , r = t.type === i.ERROR && "/" === t.nsp;
                if (e || r)
                    switch (t.type) {
                    case i.CONNECT:
                        this.onconnect();
                        break;
                    case i.EVENT:
                        this.onevent(t);
                        break;
                    case i.BINARY_EVENT:
                        this.onevent(t);
                        break;
                    case i.ACK:
                        this.onack(t);
                        break;
                    case i.BINARY_ACK:
                        this.onack(t);
                        break;
                    case i.DISCONNECT:
                        this.ondisconnect();
                        break;
                    case i.ERROR:
                        this.emit("error", t.data)
                    }
            }
            ,
            n.prototype.onevent = function(t) {
                var e = t.data || [];
                null != t.id && e.push(this.ack(t.id)),
                this.connected ? l.apply(this, e) : this.receiveBuffer.push(e)
            }
            ,
            n.prototype.ack = function(t) {
                var e = this
                  , r = !1;
                return function() {
                    if (!r) {
                        r = !0;
                        var n = a(arguments);
                        e.packet({
                            type: u(n) ? i.BINARY_ACK : i.ACK,
                            id: t,
                            data: n
                        })
                    }
                }
            }
            ,
            n.prototype.onack = function(t) {
                var e = this.acks[t.id];
                "function" == typeof e && (e.apply(this, t.data),
                delete this.acks[t.id])
            }
            ,
            n.prototype.onconnect = function() {
                this.connected = !0,
                this.disconnected = !1,
                this.emit("connect"),
                this.emitBuffered()
            }
            ,
            n.prototype.emitBuffered = function() {
                var t;
                for (t = 0; t < this.receiveBuffer.length; t++)
                    l.apply(this, this.receiveBuffer[t]);
                for (this.receiveBuffer = [],
                t = 0; t < this.sendBuffer.length; t++)
                    this.packet(this.sendBuffer[t]);
                this.sendBuffer = []
            }
            ,
            n.prototype.ondisconnect = function() {
                this.destroy(),
                this.onclose("io server disconnect")
            }
            ,
            n.prototype.destroy = function() {
                if (this.subs) {
                    for (var t = 0; t < this.subs.length; t++)
                        this.subs[t].destroy();
                    this.subs = null
                }
                this.io.destroy(this)
            }
            ,
            n.prototype.close = n.prototype.disconnect = function() {
                return this.connected && this.packet({
                    type: i.DISCONNECT
                }),
                this.destroy(),
                this.connected && this.onclose("io client disconnect"),
                this
            }
            ,
            n.prototype.compress = function(t) {
                return this.flags.compress = t,
                this
            }
            ,
            n.prototype.binary = function(t) {
                return this.flags.binary = t,
                this
            }
        }
        , function(t, e) {
            function r(t, e) {
                var r = [];
                e = e || 0;
                for (var n = e || 0; n < t.length; n++)
                    r[n - e] = t[n];
                return r
            }
            t.exports = r
        }
        , function(t, e) {
            "use strict";
            function r(t, e, r) {
                return t.on(e, r),
                {
                    destroy: function() {
                        t.removeListener(e, r)
                    }
                }
            }
            t.exports = r
        }
        , function(t, e) {
            var r = [].slice;
            t.exports = function(t, e) {
                if ("string" == typeof e && (e = t[e]),
                "function" != typeof e)
                    throw new Error("bind() requires a function");
                var n = r.call(arguments, 2);
                return function() {
                    return e.apply(t, n.concat(r.call(arguments)))
                }
            }
        }
        , function(t, e) {
            function r(t) {
                t = t || {},
                this.ms = t.min || 100,
                this.max = t.max || 1e4,
                this.factor = t.factor || 2,
                this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0,
                this.attempts = 0
            }
            t.exports = r,
            r.prototype.duration = function() {
                var t = this.ms * Math.pow(this.factor, this.attempts++);
                if (this.jitter) {
                    var e = Math.random()
                      , r = Math.floor(e * this.jitter * t);
                    t = 0 == (1 & Math.floor(10 * e)) ? t - r : t + r
                }
                return 0 | Math.min(t, this.max)
            }
            ,
            r.prototype.reset = function() {
                this.attempts = 0
            }
            ,
            r.prototype.setMin = function(t) {
                this.ms = t
            }
            ,
            r.prototype.setMax = function(t) {
                this.max = t
            }
            ,
            r.prototype.setJitter = function(t) {
                this.jitter = t
            }
        }
        ])
    });
    !function() {
        "use strict";
        const t = {
            version: "2024.06.21-1 NI",
            currentMap: "",
            dontShowMenu: !1,
            accountID: T("user_id"),
            defaultSoundOnIncomingResp: "https://grooove.pl/margoDodatki/msg.mp3",
            defaultHOTNotifySound: "https://grooove.pl/margoDodatki/green.mp3",
            clans: [],
            openedMenus: [],
            defaultPageTitle: "Margonem MMORPG",
            WSServer: "https://cll-new.grooove.pl/",
            ajax: "https://api.grooove.pl/cll",
            frameworkNI: "https://addons2.margonem.pl/get/69/69097dev.js",
            $body: $("body"),
            $head: $("head"),
            $game: (e = ".game-layer",
            new Promise((t=>{
                const n = setInterval((()=>{
                    const i = $(e);
                    i.length && (clearInterval(n),
                    t(i))
                }
                ), 200)
            }
            ))),
            $gamePositioner: $(".game-window-positioner"),
            $chat: $(".left-column.main-column"),
            $chatScrollable: $(".messages-wrapper .scroll-pane"),
            $document: $(document),
            names: [],
            ids: [],
            loggedIn: !1,
            targetNPC: {
                type: "",
                id: 0,
                highestItem: 0
            },
            currentMap: "",
            npcKillSent: !1,
            loot: {
                items: [],
                team1: [],
                team2: []
            },
            devMode: !1
        };
        var e;
        t.customNPCs = {
            1: {
                name: "Ołtarz Pajęczej Bogini",
                lvl: 214,
                prof: "",
                id: "n000003",
                items: ["Odłamany pajęczy róg", "Pajęcze strzały zimna", "Pajęcze strzały zniszczenia", "Rękawice zwinności", "Życiodajny pierścień zagłady", "Pierścień szybkości fanatyka", "Pajęczy czerep utraconej woli", "Spektrum błyskawicy", "Siekacz Marlloth", "Potężny wytrzewiacz", "Kusza drowiego zabójcy", "Łuk chłodnego wyznawcy", "Rytualny wykrawacz serc", "Mroczne wsparcie", "Pajęczy hełm czciciela Marlloth", "Rękawice pajęczej sieci", "Klejnot zainfekowanych sztolni", "Buty maniakalnego czciciela", "Buty adepta pajęczej magii", "Buty uwikłanego piewcy"]
            },
            2: {
                name: "Rycerz z za małym mieczem",
                lvl: 217,
                prof: "",
                id: "n000001",
                items: ["Szmaragdowa obroża", "Lekka osłona schwytanego", "Okucie śmiałka", "Czarny rycerski kaftan", "Dies Irae", "Laska władcy huraganów", "Mocarny falchion", "Anielski miecz światłości", "Rękawice nienawiści", "Ostrze zniszczenia", "Mechaniczne rękawice goblinów", "Łuk gromowładcy", "Łuk łowcy pająków", "Pajęcza ozdoba"]
            },
            3: {
                name: "Smocza skrzynia",
                lvl: 282,
                prof: "m",
                id: "n114998",
                items: ["Lamia shaiharrudzka", "Lanca Shaiharrudzkich jeźdźców", "Dech smoka", "Strzały z krwią pustynnego czerwia", "Rozbijacz zastępów", "Piłomiecz Shaiharrudzkich piechociarzy", "Złota trująca lamia", "Miotacz gniewu smoczego boga", "Złotomiot wernoradzkiego najeźdźcy", "Miotacz Legionu", "Tarcza pustynnego słońca", "Ametystowe oko arcykapłana", "Młot gniewu Hebrehotha"]
            },
            4: {
                name: "Złoże",
                lvl: 0,
                prof: "",
                id: "n000002",
                items: ["Bryłki żelaza", "Srebro rodzime", "Samorodek złota", "Bryłki złota", "Samorodek platyny", "Diamentowe okruchy", "Nieoczyszczony diament"]
            }
        },
        t.NPCRealNames = {
            "mietek zul": "Mietek Żul",
            "karmazynowy msciciel": "Karmazynowy Mściciel",
            zlodziej: "Złodziej",
            "zly przewodnik": "Zły Przewodnik",
            "piekielny kosciej": "Piekielny Kościej",
            "opetany paladyn": "Opętany Paladyn",
            "perski ksiaze": "Perski Książę",
            "baca bez lowiec": "Baca bez Łowiec",
            "oblakany lowca orkow": "Obłąkany Łowca orków",
            "czarujaca atalia": "Czarująca Atalia",
            "swiety braciszek": "Święty Braciszek",
            "demonis pan nicosci": "Demonis Pan Nicości",
            "gleboki johnny": "Głęboki Johnny",
            "zabojczy krolik": "Zabójczy królik",
            "lowczyni wspomnien": "Łowczyni Wspomnień",
            "przyzywacz demonow": "Przyzywacz demonów",
            zamroz: "Zamróz",
            lodoszren: "Lodoszreń",
            sniezryn: "Śnieżryn",
            snieguch: "Śnieguch",
            "renifer krecinos": "Renifer Kręcinos",
            "chytry przywlaszczyciel": "Chytry Przywłaszczyciel",
            "cwany lepkoreciuch": "Cwany Lepkoręciuch",
            polnocnica: "Północnica",
            placzka: "Płaczka",
            "bael bluznierca": "Bael Bluźnierca",
            "pieniezny chlopiec": "Pieniężny chłopiec",
            szatopierz: "Szątopierz",
            "puchouch dlugozeby": "Puchouch Długozęby",
            "trus celne oko": "Truś Celne Oko",
            "marchwizab przyczajony": "Marchwiząb Przyczajony",
            "szczerzykiel szesciolapy": "Szczerzykieł Sześciołapy",
            "mlody smok": "Młody smok",
            "zelazoreki ohydziarz": "Żelazoręki Ohydziarz",
            deborozec: "Dęborożec",
            "regulus metnooki": "Regulus Mętnooki"
        };
        class n {
            constructor(e) {
                var n;
                this.order = e.order,
                this.slug = e.slug,
                this.yourRank,
                this.id,
                this.world,
                this.alerts = [],
                this.neonsApplied = !1,
                this.colorsApplied = !1,
                this.tipsApplied = !1,
                this.name = this.slug.split("_").map(m).join(" "),
                this.clanMessages = {},
                t.devMode && (window.GAResponse = t=>{
                    this.router(t)
                }
                ),
                this.timers = new V(this),
                this.launcher = new R({
                    containerPromise: t.$game,
                    order: this.order,
                    text: `${this.name} Lootlog v${t.version}`,
                    letter: "C",
                    slug: this.slug
                }),
                this.box = new N({
                    name: this.name,
                    slug: this.slug
                }),
                this.settings = new P({
                    clanName: this.name,
                    clanSlug: this.slug
                }),
                this.colors = new L,
                this.tips = new Z,
                this.neons = new U,
                this.messagebox = new q({
                    name: this.name,
                    slug: this.slug
                }),
                this.launcher.on("show clan box", (()=>{
                    this.box.show()
                }
                )),
                this.dailyMessage = new D,
                this.box.on("show clan settings", (()=>{
                    this.settings.show()
                }
                )),
                this.box.on("show addtimer", (()=>{
                    new M({
                        name: this.name,
                        slug: this.slug
                    })
                }
                )),
                this.box.on("show hiddentimers", (()=>{
                    this.hiddentimers || (this.hiddentimers = new G({
                        name: this.name,
                        slug: this.slug
                    })),
                    this.hiddentimers.show()
                }
                )),
                this.box.on("show message box", (()=>{
                    this.messagebox.show()
                }
                )),
                this.box.on("show online users", (()=>{
                    this.activeusers || (this.activeusers = new I({
                        name: this.name,
                        slug: this.slug
                    })),
                    this.activeusers.show()
                }
                )),
                n = (e,n)=>{
                    if (!g(e.nick, this.slug)) {
                        const i = t.Storage.get(`${this.slug}/enable_hot_autoinvite`);
                        this.router({
                            npc: e,
                            type: n,
                            autoInvite: i,
                            local_hotfound: !0
                        })
                    }
                }
                ,
                setTimeout((()=>{
                    v().forEach((t=>{
                        if (!t || !t.d)
                            return;
                        const e = S(t.d.wt);
                        z(e) && n(t.d, e)
                    }
                    ))
                }
                ), 0),
                this.bindShortcutsEvents()
            }
            bindShortcutsEvents() {
                t.$body.on("keyup", (e=>{
                    if (e.shiftKey && !["INPUT", "TEXTAREA", "MAGIC_INPUT"].includes(e.target.tagName)) {
                        const n = String.fromCharCode(e.keyCode).toLowerCase();
                        let i = t.Storage.get(`${this.slug}/shortcut_key_hide_clanmsg`);
                        "string" == typeof i && i.length && (i = i.toLowerCase(),
                        n === i && this.removeLatestClanMsg())
                    }
                }
                ))
            }
            removeLatestClanMsg() {
                const t = Object.keys(this.clanMessages)
                  , [e] = t.splice(-1)
                  , n = this.clanMessages[e];
                n && n.remove()
            }
            canUserDoAction(e) {
                const n = []
                  , i = T("mchar_id");
                switch (t.loggedIn || n.push("nie połączono z serwerem lub nie jesteś zalogowany"),
                !1 === t.Storage.get(`${this.slug}/lootlog_enabled`) && n.push("lootlog jest wyłączony/nieopłacony"),
                !0 === t.Storage.get(`${this.slug}/no_access`) && n.push(`użytkownik nie ma dostępu: ${GrooveObject.user}`),
                !0 === t.Storage.get(`${this.slug}/clan_id_mismatch`) && n.push(`id klanu nie zgadza się: ${Engine.hero.d.clan ? Engine.hero.d.clan.id : 1}`),
                e) {
                case "init":
                case "addtimer_art":
                    return !0;
                case "deletetimer":
                    if ("admin" === this.yourRank)
                        return !0;
                    n.push(`ranga ${this.yourRank} jest zbyt niska`),
                    message("Tylko admini mogą wykonać tę akcję");
                    break;
                case "msgToClan":
                    "newbie" === this.yourRank && (n.push(`Ranga ${this.yourRank} jest zbyt niska.`),
                    message('masz rangę "okres próbny", nie możesz wysyłać klanowych wiadomości'));
                    break;
                case "addhottimer":
                case "addtimer":
                    t.Storage.get(`${this.slug}/disable_on_char_${i}`) && n.push("wyłączyłeś dodawanie timerów na tym lootlogu");
                case "addkill":
                case "saveloot":
                case "saveempty":
                case "savediv":
                case "spotted":
                    t.Storage.get(`${this.slug}/disable_on_char_${i}`) && n.push("wyłączyłeś zapisywanie na tym lootlogu"),
                    this.world !== s() && (void 0 === this.world ? n.push(`obecna konfiguracja lootloga wyklucza postać "${Engine.hero.nick}" z używania dodatku LUB nie jesteś zalogowany`) : n.push(`jesteś na innym świecie (${s()}) niż świat klanu (${this.world})`))
                }
                return n.length > 0 ? (t.Logger.log(`Nie można wykonać "${e}" w lootlogu ${this.slug}: ${n.join(", ")}`),
                !1) : (t.Logger.log(`Wykonywanie "${e}" w lootlogu ${this.slug}`),
                !0)
            }
            router(e) {
                const n = T("mchar_id");
                if (e.timers && this.timers.router("timers", e.timers),
                e.your_rank && (this.yourRank = e.your_rank),
                e.clan_id && (this.id = e.clan_id),
                e.users && this.activeusers.parseData(e.users),
                e.clan_world && (this.world = function(t) {
                    switch (t) {
                    case "game1":
                        return "classic";
                    case "game2":
                        return "tarhuna";
                    case "game3":
                        return "nerthus";
                    case "game7":
                        return "lelwani";
                    case "game8":
                        return "zemyna";
                    case "game9":
                        return "hutena";
                    case "game10":
                        return "jaruna";
                    default:
                        return t
                    }
                }(e.clan_world)),
                e.singletimer && this.timers.router("single timer", [e]),
                e.settings && this.settings.applyFromServer(e.settings),
                e.members && (e.members.clanMessage && e.members.clanMessage.trim() && !t.Storage.get(`${this.slug}/disable_daily_msg`) && this.dailyMessage.init({
                    clanName: this.name,
                    text: e.members.clanMessage
                }),
                !e.members.colors || t.Storage.get(`${this.slug}/disable_colors`) || this.colorsApplied || (this.colorsApplied = !0,
                this.colors.apply(e.members.colors, this.slug)),
                e.members.tips && !this.tipsApplied && (this.tipsApplied = !0,
                this.tips.apply(e.members.tips)),
                !e.members.neons || t.Storage.get(`${this.slug}/disable_neons`) || this.neonsApplied || (this.neonsApplied = !0,
                this.neons.apply(e.members.neons))),
                e.local_hotfound) {
                    if (t.Storage.get(`${this.slug}/disable_hot_notify`))
                        return t.Logger.log("Nie pokazano alertu HOT: wyłączyłeś to całkowicie w ustawieniach");
                    if (t.Storage.get(`${this.slug}/disable_hot_notify_on_char_${n}`))
                        return t.Logger.log("Nie pokazano alertu HOT: wyłączyłeś to dla obecnej postaci");
                    if (this.world && this.world !== s() && t.Storage.get(`${this.slug}/disable_hot_notify_on_world_mismatch`))
                        return t.Logger.log("Nie pokazano alertu HOT: jesteś na innym świecie, niż świat klanu");
                    const i = new H({
                        post: e,
                        type: 3,
                        clanName: this.name,
                        clanSlug: this.slug,
                        $container: t.$body
                    })
                      , o = (new Date).getTime()
                      , a = f(e.npc.nick)
                      , r = t.Storage.get(`${this.slug}/last_info_${a}`) || 0;
                    let l;
                    t.Storage.get(`${this.slug}/hot_on_chat`) ? Engine.hero.d.clan ? Engine.hero.d.clan && this.id !== Engine.hero.d.clan.id ? l = `id obecnego klanu (${Engine.hero.d.clan.id}) rożni się od tego, na który ustawiony jest lootlog (${this.id}, ${typeof this.id})` : o - r < 6e4 ? l = "w ciągu ostatniej minuty była ona już raz dodana" : (d({
                        target: "clan",
                        txt: `Znaleziono ${e.type}a ${e.npc.nick} na mapie ${Engine.map.d.name} (${e.npc.x},${e.npc.y})`
                    }),
                    t.Storage.set(`${this.slug}/last_info_${a}`, o)) : l = "ta postać nie należy do klanu, na który jest ustawiony lootlog" : l = "jest to wyłączone w ustawieniach",
                    l && t.Logger.log(`Nie dodano wiadomości na chat klanowy: ${l}`),
                    i.on("notify", (n=>{
                        const i = t.Connection.prepare("spotted", this.slug, Object.assign(n, {
                            npcType: e.type,
                            npcName: e.npc.nick,
                            npcX: e.npc.x,
                            npcY: e.npc.y,
                            npcIcon: e.npc.icon,
                            npcLvl: e.npc.lvl,
                            heroNick: Engine.hero.d.nick,
                            heroLvl: Engine.hero.d.lvl + Engine.hero.d.prof,
                            mapName: Engine.map.d.name,
                            world: s()
                        }));
                        t.Connection.wsQuery(i) ? t.Logger.log("Powiadomienie o H/T wysłane.") : t.Logger.log("Powiadomieie o H/T nie zostało wysłane, ponawiam...")
                    }
                    ))
                }
                if (e.msgToClan && e.txt.trim() || e.npcspotted) {
                    const n = e.msgToClan ? 1 : 2;
                    if (1 === n || !this.alerts.includes(e.name || e.npcName)) {
                        if (2 === n) {
                            if (t.Storage.get(`${this.slug}/disable_hot_receiving`))
                                return;
                            this.alerts.push(e.name || e.npcName)
                        } else if (1 === n && t.Storage.get(`${this.slug}/disable_clan_msg_receiving`))
                            return;
                        const i = new H({
                            type: n,
                            post: e,
                            author: e.heroNick || e.author,
                            clanName: this.name,
                            clanSlug: this.slug,
                            $container: t.$body,
                            countAll: 1 === n ? Object.keys(this.clanMessages).length : 0
                        });
                        if (1 === n) {
                            const t = Date.now();
                            this.clanMessages[t] = i,
                            i.on("remove", (()=>{
                                delete this.clanMessages[t]
                            }
                            )),
                            i.on("removeAll", (()=>{
                                for (let t in this.clanMessages)
                                    this.clanMessages[t] && this.clanMessages[t].remove()
                            }
                            ))
                        }
                        i.on("reply", (()=>{
                            this.messagebox.show()
                        }
                        ))
                    }
                }
            }
        }
        if ("object" != typeof GrooveObject) {
            const e = new Date
              , n = [e.getUTCDate(), e.getUTCMonth() + 1].join(".");
            $.ajax({
                url: `${t.frameworkNI}?ver=${n}`,
                dataType: "script",
                cache: !0,
                success: ()=>{
                    i(GrooveObject)
                }
            })
        } else
            i(GrooveObject);
        function i(e) {
            e.callbacks.push((n=>{
                e.onBattleStart(n, (()=>{
                    o()
                }
                )),
                e.forEachFighter(n, ((e,n)=>{
                    const i = a(n);
                    if (i && i.d && !t.npcKillSent) {
                        "zw" !== S(i.d.wt) && 0 === e.hpp && (t.npcKillSent = !0,
                        j("addkill", t.ajax + "/counter/add/kill", {
                            monster: i.d.nick,
                            lvl: i.d.lvl
                        }))
                    }
                    if (e.name) {
                        if (e.npc && i && i.d) {
                            const e = S(i.d.wt);
                            z(e) && Object.assign(t.targetNPC, {
                                type: e,
                                id: Math.abs(n)
                            })
                        } else
                            e.npc && b(y(e.name)) && Object.assign(t.targetNPC, {
                                type: "tytan",
                                id: Math.abs(n)
                            });
                        t.loot["team" + e.team].push({
                            name: e.name,
                            icon: e.icon || "/img/rip1.gif",
                            lvl: e.lvl + e.prof,
                            id: n.toString().replace("-", "n")
                        }),
                        function(t) {
                            const e = a(t);
                            if (!e)
                                return;
                            r(c(), e.d.x, e.d.y)
                        }(n)
                    }
                }
                )),
                e.onLoots(n, ((n,i)=>{
                    n.sort(((t,e)=>t.hid - e.hid)),
                    n.forEach((n=>{
                        let s = !1;
                        const a = e.getItemStat(n.stat);
                        a > t.targetNPC.highestItem && (t.targetNPC.highestItem = a),
                        0 !== a && (t.ids.includes(n.hid) || ("fight" === i.source ? (t.ids.push(n.hid),
                        t.names.push(n.name),
                        s = !0) : "dialog" === i.source && (s = function(e) {
                            let n = !1;
                            return Object.entries(t.customNPCs).forEach((i=>{
                                const [s,a] = i;
                                var l;
                                a.items.includes(e.name) && (o(),
                                t.loot.team1.push({
                                    name: Engine.hero.d.nick,
                                    lvl: Engine.hero.d.lvl + Engine.hero.d.prof,
                                    id: Engine.hero.d.id,
                                    icon: "/obrazki/postacie" + Engine.hero.d.img
                                }),
                                l = a,
                                t.loot.team2.push({
                                    name: l.name,
                                    lvl: l.lvl + l.prof,
                                    id: l.id
                                }),
                                r(c(), Engine.hero.d.x, Engine.hero.d.y),
                                n = !0)
                            }
                            )),
                            n
                        }(n)),
                        s && t.loot.items.push({
                            id: n.hid,
                            icon: n.icon,
                            stat: [n.name, n.stat, n.cl, n.pr].join("(|)"),
                            type: a
                        })))
                    }
                    )),
                    t.loot.items.length > 0 && (l((e=>{
                        if (e.canUserDoAction("saveloot")) {
                            const n = JSON.parse(JSON.stringify(t.loot));
                            for (let i = n.items.length - 1; i >= 0; i--) {
                                n.items[i].type < 2 && !1 === t.Storage.get(`${e.slug}/unique_items_enabled`) && !t.targetNPC.type && n.items.splice(i, 1)
                            }
                            n.items.length ? $.ajax({
                                type: "post",
                                url: t.ajax + "/save/loot",
                                data: Object.assign({
                                    clans: JSON.stringify([e.slug]),
                                    version: t.version,
                                    world: s(),
                                    clanID: Engine.hero.d.clan ? Engine.hero.d.clan.id : 1,
                                    loot: JSON.stringify(n),
                                    map: t.currentMap || Engine.map.d.name
                                }),
                                xhrFields: {
                                    withCredentials: !0
                                }
                            }) : t.Logger.log(`Zapisywanie unikatów jest wyłączone w panelu admina klanu ${e.slug}`)
                        }
                    }
                    )),
                    localStorage["cll-items-names"] = t.names.join("."),
                    localStorage["cll-items-ids"] = t.ids.join("."))
                }
                )),
                e.onNewNpc(n, (e=>{
                    setTimeout((()=>{
                        const n = a(e);
                        if (!n || !n.d)
                            return;
                        const i = n.d
                          , s = S(i.wt);
                        n.walkover || n.walkOver || n.canWalkOver || l((e=>{
                            if (z(s) && !g(i.nick, e.slug)) {
                                const n = t.Storage.get(`${e.slug}/enable_hot_autoinvite`);
                                e.router({
                                    npc: i,
                                    type: s,
                                    autoInvite: n,
                                    local_hotfound: !0
                                })
                            }
                        }
                        ))
                    }
                    ), 0)
                }
                )),
                e.onNpcRemove(n, ((e,n)=>{
                    const i = a(e);
                    if (!i || !i.d)
                        return;
                    if (function(t) {
                        const e = Engine.hero
                          , n = e.d.x - t.d.x
                          , i = e.d.y - t.d.y;
                        return Math.sqrt(n * n + i * i)
                    }(i) >= 17)
                        return;
                    const s = S(i.d.wt);
                    if (setTimeout((()=>{
                        Math.abs(i.d.id) === t.targetNPC.id && 0 === t.targetNPC.highestItem && j("saveempty", t.ajax + "/save/empty", {
                            loot: JSON.stringify(t.loot),
                            map: t.currentMap || Engine.map.d.name
                        })
                    }
                    ), 900),
                    "e2" === s) {
                        let e = i.d.nick;
                        const s = c();
                        ["Łowca czaszek", "Łowca Czaszek"].includes(e) && (e += s.includes("p.1") ? " (p.1)" : " (p.3)"),
                        ["Shae Phu"].includes(e) && (e += s.includes("s.3") ? " (s.3)" : " (s.1)"),
                        ["Krab Pustelnik", "Krab pustelnik"].includes(e) && (e += s.includes("Wyspa Rem") ? " (wyspa)" : " (statek)"),
                        "Terrozaur" === e && (e += s.includes("Urwisko") ? " (urwisko)" : " (jaskinia)"),
                        "Choukker" === e && (e += s.includes("p.3") ? " (p.3)" : " (p.1)");
                        const o = n || function(t) {
                            const e = parseInt(t, 10) || 1;
                            let n;
                            switch (e) {
                            case 260:
                                n = 84;
                                break;
                            case 280:
                            case 287:
                            case 274:
                                n = 160;
                                break;
                            case 300:
                                n = 260;
                                break;
                            default:
                                n = 0
                            }
                            return Math.floor(n + 60 * (.7 + .18 * e - 45e-5 * e * e))
                        }(i.d.lvl);
                        t.Connection.wsQueryAll("addtimer", {
                            name: e,
                            minRespawnTime: o,
                            maxRespawnTime: o
                        })
                    } else
                        z(s) && l((e=>{
                            g(i.d.nick, e.slug) || t.Connection.wsQueryOne("addhottimer", e.slug, {
                                name: i.d.nick
                            })
                        }
                        ))
                }
                )),
                e.onNewPlayers(n, (t=>{
                    l((e=>{
                        e.tips.checkPlayers(t),
                        e.neons.checkPlayers(t)
                    }
                    ))
                }
                )),
                n.chat && l((t=>{
                    requestIdleCallback((()=>t.colors.refresh(t.slug)))
                }
                )),
                e.forEachChatMsg(n, (e=>{
                    if ("system" === e.channel && e?.msg?.includes("Podział łupów") && localStorage["cll-items-names"]) {
                        const n = e.msg.split("[/b]: ")[1];
                        if (n && " -." !== n) {
                            let e = 0;
                            const i = n.split("; ")
                              , o = {}
                              , a = localStorage["cll-items-names"].split(".");
                            for (const t in i) {
                                const n = i[t].includes("otrzymała") ? " otrzymała " : " otrzymał "
                                  , s = i[t].split(n)
                                  , r = s[1].split(", ").map((t=>{
                                    const e = t.match('ITEM#[a-z0-9]{1,65}:\\"(.*)\\"');
                                    return e ? e[1].trim() : null
                                }
                                )).filter(Boolean);
                                for (const t in r)
                                    a.includes(r[t]) && (o[e++] = {
                                        p: s[0].trim(),
                                        i: r[t].trim()
                                    })
                            }
                            e > 0 && l((e=>{
                                e.canUserDoAction("savediv") && $.ajax({
                                    type: "post",
                                    url: t.ajax + "/save/div",
                                    data: Object.assign({
                                        ids: localStorage["cll-items-ids"],
                                        div: JSON.stringify(o),
                                        clans: JSON.stringify([e.slug]),
                                        version: t.version,
                                        world: s(),
                                        clanID: Engine.hero.d.clan ? Engine.hero.d.clan.id : 1
                                    }),
                                    xhrFields: {
                                        withCredentials: !0
                                    }
                                })
                            }
                            ))
                        }
                        localStorage.removeItem("cll-items-ids"),
                        localStorage.removeItem("cll-items-names")
                    }
                }
                ))
            }
            ))
        }
        function s() {
            return window.location.host.split(".")[0]
        }
        function o() {
            t.ids.length = 0,
            t.loot.items.length = 0,
            t.loot.team1.length = 0,
            t.loot.team2.length = 0,
            t.names.length = 0,
            t.npcKillSent = !1,
            t.targetNPC = {
                type: !1,
                id: 0,
                highestItem: 0
            }
        }
        function a(t) {
            return Engine.npcs.getById(Math.abs(t))
        }
        function r(e, n, i) {
            t.currentMap = e + " (" + n + "," + i + ")"
        }
        function l(e) {
            Object.values(t.clans).forEach(e)
        }
        function c() {
            return Engine.map.d.name
        }
        function d(t) {
            if (Engine.allInit) {
                const e = ()=>{}
                ;
                if ("clan" === t.target)
                    return Engine.communication.send2("chat&channel=clan", e, {
                        c: t.txt
                    });
                {
                    const n = f(t.recipient);
                    return Engine.communication.send2(`chat&channel=personal&receiver=${n}`, e, {
                        c: t.txt
                    })
                }
            }
            setTimeout((t=>{
                d(t)
            }
            ), 999, t)
        }
        function h(e) {
            let n = 1;
            for ((!e || !e.target.className.includes("cll-") || t.openedMenus.length > 0) && (n = 0); t.openedMenus.length > n; )
                t.openedMenus[0].remove(),
                t.openedMenus.shift()
        }
        function m(t) {
            return t.slice(0, 1).toUpperCase() + t.slice(1)
        }
        function p(t) {
            const e = function(t) {
                const e = t < 1
                  , n = Math.floor(t / 86400)
                  , i = 86400 * n
                  , s = Math.floor((t - i) / 3600)
                  , o = 3600 * s
                  , a = Math.floor((t - i - o) / 60);
                return {
                    days: e ? 0 : n,
                    hours: e ? 0 : s,
                    minutes: e ? 0 : a,
                    seconds: e ? 0 : t - i - o - 60 * a
                }
            }(t);
            return (e.days ? e.days + "d + " : "") + ("0" + e.hours).slice(-2) + ":" + ("0" + e.minutes).slice(-2) + ":" + ("0" + e.seconds).slice(-2)
        }
        function u(t) {
            const e = t.days || 0
              , n = t.hours || 0;
            return 60 * (t.minutes || 0) + 60 * n * 60 + 60 * e * 60 * 24
        }
        function g(e, n) {
            return (!n || !t.Storage.get(`${n}/enable_kolos_info`)) && b(y(e))
        }
        function y(t) {
            const e = v();
            for (let n of e)
                if (n && n.d && n.d.nick === t)
                    return n
        }
        function b(t) {
            return !!(t && t.d && t.d.wt && t.d.wt >= 90 && Engine.map && Engine.map.d && 5 === Engine.map.d.mode)
        }
        function w(t=0) {
            return Math.floor((new Date).getTime() / 1e3) + t
        }
        function k(t) {
            if (null === Date.parse(t))
                return `[Niepoprawna data: ${t}]`;
            const e = new Date(t);
            return `${e.getDate()}.${e.getMonth() + 1}.${e.getFullYear()}, ${e.getHours()}:${e.getMinutes()}:${e.getSeconds()}`
        }
        function f(t) {
            return t.replace(/ /g, "_")
        }
        function v() {
            return Engine.npcs.getDrawableList()
        }
        function x(t) {
            const e = Engine.others.getDrawableList();
            for (const n in e)
                if (e.hasOwnProperty(n)) {
                    const i = e[n];
                    if (i.d && i.d.nick === t)
                        return i
                }
        }
        function z(t) {
            return ["heros", "tytan"].includes(t)
        }
        function _(t) {
            if ("number" == typeof t)
                return t;
            if ("string" != typeof t)
                return "";
            const e = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };
            return t.replace(/[&<>"']/g, (t=>e[t]))
        }
        function S(t) {
            return t > 19 && t < 30 ? "e2" : t > 79 && t <= 99 ? "heros" : t > 99 ? "tytan" : "zw"
        }
        function j(e, n, i) {
            const o = [];
            l((t=>{
                t.canUserDoAction(e, i) && o.push(t.slug)
            }
            )),
            0 !== o.length && $.ajax({
                type: "post",
                url: n,
                data: Object.assign(i, {
                    clans: JSON.stringify(o),
                    version: t.version,
                    world: s(),
                    clanID: Engine.hero.d.clan ? Engine.hero.d.clan.id : 1
                }),
                xhrFields: {
                    withCredentials: !0
                }
            })
        }
        function T(t) {
            const e = document.cookie
              , n = t + "=";
            let i = e.indexOf("; " + n);
            if (-1 === i) {
                if (i = e.indexOf(n),
                0 !== i)
                    return null
            } else
                i += 2;
            let s = document.cookie.indexOf(";", i);
            return -1 === s && (s = e.length),
            unescape(e.substring(i + n.length, s))
        }
        function C(t, e) {
            Object.entries(t).forEach((t=>{
                const [n,i] = t
                  , s = e.find(`[data-key="${n}"]`);
                s.length && function(t, e) {
                    const n = t[0].type;
                    ["text", "number", "textarea"].includes(n) ? t.val(e) : "checkbox" === n ? t.attr("checked", e) : console.log("setElementValue[$el.type]", n)
                }(s, i)
            }
            ))
        }
        function O(t) {
            const e = {};
            return t.find("[data-key]").each(((t,n)=>{
                const i = $(n);
                e[i.data("key")] = function(t) {
                    let e;
                    const n = t[0].type;
                    return ["text", "number", "textarea"].includes(n) && (e = t.val()),
                    "checkbox" === n && (e = t.is(":checked")),
                    "number" === n && (e = parseInt(e, 10)),
                    e
                }(i)
            }
            )),
            e
        }
        function E() {}
        E.prototype.on = function(t, e) {
            this._events = this._events || {},
            t && "function" == typeof e ? (this._events[t] = this._events[t] || []).push(e) : console.log("EventEmitter::on > Listener nie jest funkcją:", e)
        }
        ,
        E.prototype.emit = function(t, e) {
            this._events ? this._events[t] ? (this._events[t] || []).forEach((t=>{
                t(e)
            }
            )) : console.log("EventEmitter::emit > Brak listenerów dla zdarzenia: ", t) : console.log("EventEmitter::emit > Brak listenerów dla emittera: ", this)
        }
        ;
        class I {
            constructor(t) {
                const e = new it
                  , n = new xt(e);
                n.on("refresh", (()=>{
                    e.getData(t)
                }
                )),
                n.draw(t),
                e.getData(t),
                this.model = e,
                this.view = n,
                this.show = n.show.bind(n)
            }
            parseData(t) {
                this.model.parseData(t, this.view.$content)
            }
        }
        class M {
            constructor(t) {
                const e = new st(t)
                  , n = new zt(e,t);
                this.show = n.show.bind(n),
                n.on("add btn clicked", (t=>{
                    e.parse(t)
                }
                ))
            }
        }
        class N {
            constructor(t) {
                new ot;
                const e = new _t(t);
                e.on("show settings clicked", (()=>{
                    this.emit("show clan settings")
                }
                )),
                e.on("send msg clicked", (()=>{
                    this.emit("show message box")
                }
                )),
                e.on("show online clicked", (()=>{
                    this.emit("show online users")
                }
                )),
                e.on("hiddentimers clicked", (()=>{
                    this.emit("show hiddentimers")
                }
                )),
                e.on("addtimer clicked", (()=>{
                    this.emit("show addtimer")
                }
                )),
                this.show = e.show.bind(e),
                Object.assign(this, E.prototype)
            }
        }
        class P {
            constructor(t) {
                const e = new at(t)
                  , n = new St(e,t);
                n.on("save", (t=>{
                    e.save(t)
                }
                )),
                n.on("upload", (t=>{
                    e.save(t),
                    e.upload()
                }
                )),
                n.on("download", (()=>{
                    e.download()
                }
                )),
                n.on("reset all", (()=>{
                    e.resetAll()
                }
                )),
                n.on("reset position", (()=>{
                    e.resetPosition()
                }
                )),
                this.applyFromServer = e.applyFromServer.bind(e),
                this.show = e.getCurrentValues.bind(e),
                this.hide = n.hide.bind(n),
                Object.assign(this, E.prototype)
            }
        }
        class L {
            constructor() {
                const t = new rt;
                this.apply = t.apply.bind(t),
                this.refresh = t.refresh.bind(t)
            }
        }
        class D {
            constructor() {
                const t = new lt;
                new jt(t);
                this.added = !1,
                this.init = t.init.bind(t)
            }
        }
        class R {
            constructor(t) {
                const e = new ct
                  , n = new Tt(e);
                Object.assign(this, E.prototype),
                n.on("launcher clicked", (()=>{
                    this.emit("show clan box")
                }
                )),
                t.containerPromise.then((i=>{
                    n.draw({
                        ...t,
                        $container: i
                    }),
                    e.getLauncherPosition(t.order)
                }
                ))
            }
        }
        class A {
            constructor(t) {
                const e = new ht(t)
                  , n = new Ot(e,t);
                n.on("member clicked", (t=>{
                    e.showMenu(t)
                }
                )),
                this.remove = n.remove.bind(n)
            }
        }
        class K {
            constructor(e) {
                const n = new mt
                  , i = new Et(n,{
                    $container: t.$body
                });
                t.openedMenus.push(this),
                n.init(e),
                this.remove = i.remove.bind(i)
            }
        }
        class q {
            constructor(t) {
                const e = new pt
                  , n = new It(e,t);
                n.on("send button clicked", (n=>{
                    e.validate(n) && e.sendMessage(n, t.slug)
                }
                )),
                this.show = n.show.bind(n)
            }
        }
        class H {
            constructor(t) {
                this.model = new ut(t),
                this.view = new Mt(this.model),
                Object.assign(this, E.prototype),
                this.view.on("reply clicked", (()=>{
                    this.emit("reply")
                }
                )),
                this.view.on("confirm clicked", (()=>{
                    d({
                        txt: "idę",
                        recipient: t.post.heroNick
                    })
                }
                )),
                this.view.on("notify clicked", (t=>{
                    this.emit("notify", t)
                }
                )),
                this.view.on("remove clicked", (()=>{
                    this.emit("remove")
                }
                )),
                this.view.on("remove all clicked", (()=>{
                    this.emit("removeAll")
                }
                )),
                this.model.prepare(t)
            }
            remove() {
                this.view.remove(),
                this.emit("remove")
            }
        }
        class W {
            constructor(t) {
                const e = new gt
                  , n = new Nt(e);
                n.draw(t),
                this.view = n,
                this.show = n.show.bind(n),
                this.hide = n.hide.bind(n),
                this.remove = n.remove.bind(n),
                this.setInfo = n.setInfo.bind(n),
                this.fixDimensions = n.fixDimensions.bind(n)
            }
            setContent(t) {
                return this.view.setContent(t)
            }
        }
        class U {
            constructor() {
                const t = new yt;
                new Pt(t);
                this.apply = t.parse.bind(t),
                this.checkPlayers = t.checkPlayers.bind(t)
            }
        }
        class B {
            constructor(t) {
                const e = new bt(t)
                  , n = new Dt(e,{
                    $container: t.$container
                });
                n.on("timer clicked", (t=>{
                    e.showMenu(t)
                }
                )),
                e.on("destroy", (()=>{
                    this.emit("destroy", e.name)
                }
                )),
                e.on("change browser countdown", (()=>{
                    this.emit("disable browser countdown")
                }
                )),
                e.on("time swap", (()=>{
                    this.emit("time swap")
                }
                )),
                e.init(),
                this.model = e,
                this.view = n,
                this.remove = e.remove.bind(e),
                Object.assign(this, E.prototype)
            }
            getTimeLeft() {
                return this.model.timeLeft
            }
            setOrder(t) {
                this.view.setStyle({
                    order: t
                })
            }
        }
        class F {
            constructor(t) {
                const e = new wt(t)
                  , n = new Lt(e);
                n.on("save clicked", (t=>{
                    e.save(t)
                }
                )),
                n.draw(t),
                e.getCurrentValues()
            }
        }
        class V {
            constructor(t) {
                const e = new kt(t)
                  , n = new Rt(e,t.slug);
                n.on("drag start", (()=>{
                    e.removeTimersMenus()
                }
                )),
                n.on("drag stop", (t=>{
                    e.saveContainerPosition(t)
                }
                )),
                n.draw(t.slug, t.name, e.shouldShowClanTag()),
                n.bindEvents(),
                e.$container = n.$main,
                e.getSavedTimersSettings(),
                this.model = e
            }
            router(t, e) {
                switch (t) {
                case "timers":
                case "single timer":
                    this.model.createTimers(e),
                    this.model.sortTimersBy(this.model.getSortMethod())
                }
            }
        }
        class Z {
            constructor() {
                const t = new vt;
                new At(t);
                this.apply = t.parse.bind(t),
                this.model = t
            }
            checkPlayers(t) {
                this.model.checkPlayers(t)
            }
        }
        class G {
            constructor(t) {
                this.args = t,
                this.model = new $t,
                this.view = new qt(this.model,t),
                this.view.on("el clicked", this.model.unhide.bind(this.model))
            }
            show() {
                this.model.getHiddenTimers(this.args),
                this.view.show()
            }
        }
        function J(t) {
            let e = "";
            return t.hideNpcIcon || (e += `<img class="cll-hot-img" src="https://micc.garmory-cdn.cloud/obrazki/npc/${t.npc.icon}"><br>`),
            e += `Znaleziono ${t.type}a <b>${t.npc.nick} (${t.npc.lvl}lvl)</b>!<br>`,
            t.autoInvite ? e += "Znajomi z klanu zostali automatycznie powiadomieni." : (e += "Czy chcesz zawołać znajomych z klanu poprzez lootloga klanowego? <br><br>",
            "heros" === t.type && (e += '\n\t\t\t\tPodaj przedział lvlowy, którym chcesz bić tego herosa (nieobowiązkowe): <br>\n\t\t\t\tMin: <input class="cll-min-lvl" type="number"> Max: <input class="cll-max-lvl" type="number"> \n\t\t\t')),
            e
        }
        function Q(t) {
            let e = "";
            return t.hideNpcIcon || (e += `<img class="cll-hot-img" src="${t.post.npcIcon}"><br>`),
            e += `\n\t<b>${t.post.heroNick} (${t.post.heroLvl})</b> znalazł(a) ${t.post.npcType}a <b>${t.post.npcName} (${t.post.npcLvl} lvl)</b><br>\n\tna mapie <b>${t.post.mapName} (${t.post.npcX},${t.post.npcY})</b> - świat <b>${t.post.world}</b>.<br><br>\n`,
            t.post.requestedMinLvl && (e += `Minimalny lvl bicia: <b>${t.post.requestedMinLvl}</b><br>`),
            t.post.requestedMaxLvl && (e += `Maksymalny lvl bicia: <b>${t.post.requestedMaxLvl}</b><br>`),
            t.post.requestedMaxLvl || t.post.requestedMinLvl || (e += "Jesteś zaproszony(a)!"),
            e
        }
        function X(t) {
            return `<button class="cll-close-btn">${t || "Zamknij"}</button>`
        }
        function Y(t) {
            return `<button class="cll-ok-btn">${t || "OK"}</button>`
        }
        function tt(t) {
            return `\n<a class="cll-bordered-button" href="https://grooove.pl/${t.slug}/" target="_blank">\n  Strona klanowa\n</a>\n<span id="cll-show-settings" class="cll-bordered-button">Ustawienia</span>\n<span id="cll-send-msg" class="cll-bordered-button">Wyślij wiadomość</span>\n<span id="cll-active-users" class="cll-bordered-button">Aktywni klanowicze</span>\n<span id="cll-add-timer" class="cll-bordered-button" data-tip="Opcja dostępna tylko dla adminów">Dodaj timer</span>\n<span id="cll-hidden-timers" class="cll-bordered-button">Pokaż ukryte timery</span>\n<span id="cll-show-console" class="cll-bordered-button">Pokaż logi</span>\n`
        }
        function et() {
            const t = T("mchar_id")
              , e = Engine.hero.nick;
            return `\n<div class="cll-settings">\n\t<input data-key="shortcut_key" type="text" maxlength="1"> skrót "pokaż/ukryj timery" (SHIFT + podany klawisz) <br>\n    <input data-key="shortcut_key_showmsgbox" type="text" maxlength="1"> skrót "pokaż okno wysyłania wiadomości" (SHIFT + podany klawisz) <br>\n    <input data-key="shortcut_key_hide_clanmsg" type="text" maxlength="1"> skrót "ukryj otrzymaną klanową wiadomość" (SHIFT + podany klawisz) <br>\n\t<input data-key="position_x" type="number"> odległość dodatku od lewej krawędzi okna (px)<br>\n\t<input data-key="position_y" type="number"> odległość dodatku od górnej krawędzi okna (px)<br>\n\t<input data-key="columns_amount" type="number" data-tip="Jeżeli tabelka z timerami ma rozkładać się w pionie, to wpisz np. 1, a jeżeli w poziomie, to np. 5"> ilość kolumn <br>\n\t<input data-key="cell_width" type="number"> szerokość pojedynczego timera w pixelach <br>\n\t<input data-key="alerts_pos_y" type="number"> odległość alertów od górnej krawędzi ekranu (px)<br>\n\t<input data-key="alert_autohide_timeout" type="number" data-tip="Nie dotyczy powiadomień wołacza. Ustaw 0, aby alerty nie znikały automatycznie."> czas w sekundach, po którym klanowe wiadomości będą automatycznie ukrywane<br>\n\t<input data-key="font_size" type="number"> wielkość czcionki w pixelach <br>\n\t<input data-key="hot_notify_sound_source" type="text" data-tip="jeśli zostawisz puste, wtedy zostanie odegrany domyślny plik (jeśli włączono dźwięk dla tego zdarzenia)"> adres do pliku dźwiękowego odgrywanego przy otrzymaniu powiadomienia o herosie/tytanie <br>\n\t<input data-key="timers_opacity" type="number" min="0A" max="100" value="100" data-tip="wartości 0-100; 0 - całkowicie przezroczysty, 100 - nieprzezroczysty"> przezroczystość timerów<br>\n\t<input data-key="disable_on_char_${t}" type="checkbox"> nie zapisuj niczego w tym lootlogu z obecnej postaci (<b>${e}</b>) <br>\n\t<input data-key="hot_notify_sound_enabled" type="checkbox"> włącz dźwięk przy otrzymaniu powiadomienia o znalezionym przez klanowiczów herosie/tytanie <br>\n\t<input data-key="disable_colors" type="checkbox"> wyłącz kolory na czacie <br>\n\t<input data-key="disable_neons" type="checkbox"> wyłącz neony pod graczami <br>\n\t<input data-key="disable_daily_msg" type="checkbox"> ukrywaj żółtą "wiadomosć dnia" na czacie <br>\n\t<input data-key="disable_hot_timers" type="checkbox"> nie wyświetlaj herosów i tytanów na minutniku <br>\n\t<input data-key="enable_hot_autoinvite" type="checkbox"> automatycznie wysyłaj znajomym powiadomienie o znalezieniu herosa lub tytana <br>\n\t<input data-key="hot_on_chat" type="checkbox" data-tip="działa tylko wtedy, jeśli jesteśmy na postaci należącej do klanu, na który skonfigurowany jest lootlog" data-tip="wiadomość wyśle się maksymalnie raz na minutę"> automatycznie wysyłaj wiadomość na czat klanowy o znalezieniu herosa lub tytana <br>\n\t<input data-key="disable_hot_receiving" type="checkbox"> nie wyświetlaj powiadomień od klanowiczów o herosach i tytanach <br>\n\t<input data-key="disable_clan_msg_receiving" type="checkbox"> nie wyświetlaj klanowych wiadomości <br>\n\t<input data-key="disable_msg_sent_notify" type="checkbox"> nie wyświetlaj powiadomień o wysłanej wiadomości <br>\n\t<input data-key="disable_alert_npc_icon" type="checkbox"> nie pokazuj obrazków herosa/tytana w otrzymywanych powiadomieniach <br>\n\t<input data-key="show_clan_tag" type="checkbox"> pokazuj metkę z nazwą klanu nad timerami<br>\n    <input data-key="enable_kolos_info" type="checkbox"> nie blokuj wyświetlania powiadomień dotyczących kolosów<br>\n    <input data-key="disable_hot_notify_on_world_mismatch" type="checkbox"> wyłącz wykrywanie herosów i tytanów, gdy jestem na innym świecie, niż świat klanu<br>\n    <input data-key="disable_hot_notify" type="checkbox"> wyłącz całkowicie wykrywacz herosów i tytanów na tym lootlogu<br>\n    <input data-key="disable_hot_notify_on_char_${t}" type="checkbox"> wyłącz wykrywacz herosów i tytanów na tym lootlogu tylko dla obecnej postaci (<b>${e}</b>)<br>\n\t<br>\n\t<div class="cll-bordered-button" id="cll-reset-position" data-tip="Przywraca domyślne położenie dodatku na ekranie">Resetuj pozycję</div>\n</div>\n`
        }
        function nt(t) {
            let e = "";
            for (let n = 0; n < t.length; n += 1)
                e += `<span class="cll-bordered-button" data-tip="Kliknij, aby uczynić widocznym (po F5)" data-key="${t[n].key}">${t[n].name}</span>\n    `;
            return e || (e = "Aktualnie żaden timer nie jest dla ciebie ukrywany na tym lootlogu."),
            e
        }
        class it {
            constructor() {
                this.members = [],
                Object.assign(this, E.prototype)
            }
            getData(e) {
                t.Connection.wsQueryOne("getonline", e.slug, {})
            }
            parseData(t, e) {
                this.clear(),
                t.sort(((t,e)=>!t.connected)),
                t.forEach((t=>{
                    this.members.push(new A({
                        data: t,
                        $container: e
                    }))
                }
                )),
                this.emit("members added")
            }
            clear() {
                this.members.forEach((t=>{
                    t.remove()
                }
                ))
            }
        }
        class st {
            constructor(t) {
                this.args = t,
                Object.assign(this, E.prototype)
            }
            parse(t) {
                const e = this.sanitize(t)
                  , n = u(e.min)
                  , i = u(e.max);
                this.validate(e, n, i) && this.send({
                    name: e.name,
                    info: e.info,
                    min: n,
                    max: i
                })
            }
            sanitize(t) {
                return Object.assign(t, {
                    name: _(t.name),
                    info: _(t.info),
                    min: {
                        days: parseInt(t.min.days, 10) || 0,
                        hours: parseInt(t.min.hours, 10) || 0,
                        minutes: parseInt(t.min.minutes, 10) || 0
                    },
                    max: {
                        days: parseInt(t.max.days, 10) || 0,
                        hours: parseInt(t.max.hours, 10) || 0,
                        minutes: parseInt(t.max.minutes, 10) || 0
                    }
                })
            }
            validate(t, e, n) {
                return t.name.length < 2 ? (message("Podaj nazwę timera o długości między 2 a 50 znaków"),
                !1) : e < 60 ? (message("Podaj poprawną ilość czasu minimalnego respu"),
                !1) : !(n < 60) || (message("Podaj poprawną ilość czasu maksymalnego respu"),
                !1)
            }
            send(e) {
                t.Connection.wsQueryOne("addtimer_art", this.args.slug, e),
                this.emit("hide")
            }
        }
        class ot {
        }
        class at {
            constructor(e) {
                this.args = e;
                const n = e.clanSlug
                  , i = T("mchar_id");
                this.current = {
                    shortcut_key: t.Storage.get(`${n}/shortcut_key`) || "q",
                    shortcut_key_showmsgbox: t.Storage.get(`${n}/shortcut_key_showmsgbox`) || "a",
                    shortcut_key_hide_clanmsg: t.Storage.get(`${n}/shortcut_key_hide_clanmsg`) || "d",
                    columns_amount: parseInt(t.Storage.get(`${n}/columns_amount`) || 1, 10),
                    cell_width: parseInt(t.Storage.get(`${n}/cell_width`) || 130, 10),
                    font_size: parseInt(t.Storage.get(`${n}/font_size`) || 9, 10),
                    hot_notify_sound_enabled: t.Storage.get(`${n}/hot_notify_sound_enabled`) || !1,
                    hot_notify_sound_source: t.Storage.get(`${n}/hot_notify_sound_source`) || "",
                    alert_autohide_timeout: t.Storage.get(`${n}/alert_autohide_timeout`) || 0,
                    alerts_pos_y: parseInt(t.Storage.get(`${n}/alerts_pos_y`), 10) || 5,
                    disable_colors: t.Storage.get(`${n}/disable_colors`) || !1,
                    disable_neons: t.Storage.get(`${n}/disable_neons`) || !1,
                    disable_daily_msg: t.Storage.get(`${n}/disable_daily_msg`) || !1,
                    disable_hot_timers: t.Storage.get(`${n}/disable_hot_timers`) || !1,
                    enable_hot_autoinvite: t.Storage.get(`${n}/enable_hot_autoinvite`) || !1,
                    hot_on_chat: t.Storage.get(`${n}/hot_on_chat`) || !1,
                    disable_hot_receiving: t.Storage.get(`${n}/disable_hot_receiving`) || !1,
                    disable_clan_msg_receiving: t.Storage.get(`${n}/disable_clan_msg_receiving`) || !1,
                    disable_msg_sent_notify: t.Storage.get(`${n}/disable_msg_sent_notify`) || !1,
                    ["disable_on_char_" + i]: t.Storage.get(`${n}/disable_on_char_${i}`) || !1,
                    timers_opacity: t.Storage.get(`${n}/timers_opacity`) || 100,
                    position_x: t.Storage.get(`${n}/position_x`) || 0,
                    position_y: t.Storage.get(`${n}/position_y`) || 0,
                    show_clan_tag: t.Storage.get(`${n}/show_clan_tag`) || !1,
                    enable_kolos_info: t.Storage.get(`${n}/enable_kolos_info`) || !1,
                    disable_alert_npc_icon: t.Storage.get(`${n}/disable_alert_npc_icon`) || !1,
                    disable_hot_notify_on_world_mismatch: t.Storage.get(`${n}/disable_hot_notify_on_world_mismatch`) || !1,
                    disable_hot_notify: t.Storage.get(`${n}/disable_hot_notify`) || !1,
                    ["disable_hot_notify_on_char_" + i]: t.Storage.get(`${n}/disable_hot_notify_on_char_${i}`) || !1
                },
                Object.assign(this, E.prototype)
            }
            getCurrentValues() {
                this.emit("current values", this.current)
            }
            resetAll() {
                t.Storage.removeAllByKey(this.args.clanSlug)
            }
            resetPosition() {
                t.Storage.remove(`${this.args.clanSlug}/position_x`),
                t.Storage.remove(`${this.args.clanSlug}/position_y`)
            }
            applyFromServer(e) {
                Object.entries(e).forEach((e=>{
                    const [n,i] = e;
                    t.Storage.set(`${this.args.clanSlug}/${n}`, i)
                }
                )),
                !1 === e.lootlog_enabled && t.Logger.log(`#C Lootlog jest wyłączony/nieopłacony::${this.args.clanSlug}`),
                !0 === e.no_access && t.Logger.log(`#C Użytkownik nie ma dostępu::${e.your_id}::${this.args.clanSlug}`),
                !0 === e.clan_id_mismatch && t.Logger.log(`#C ID klanu nie zgadza się::${this.args.clanSlug}::${Engine.hero.d.clan ? Engine.hero.d.clan.id : "brak klanu"}`)
            }
            save(e) {
                this.current = e,
                Object.entries(e).forEach((e=>{
                    const [n,i] = e;
                    t.Storage.set(`${this.args.clanSlug}/${n}`, i)
                }
                ))
            }
            upload() {
                $.ajax({
                    url: t.ajax + "/settings/upload",
                    type: "post",
                    data: {
                        json: JSON.stringify(t.Storage.getAll())
                    },
                    xhrFields: {
                        withCredentials: !0
                    },
                    success: t=>{
                        t.s ? this.emit("upload success") : this.emit("upload failed", "#INTERNAL_ERROR")
                    }
                    ,
                    error: t=>{
                        this.emit("upload failed", t.statusText)
                    }
                })
            }
            download() {
                $.ajax({
                    url: t.ajax + "/settings/download",
                    type: "post",
                    xhrFields: {
                        withCredentials: !0
                    },
                    success: e=>{
                        if (e.json) {
                            const n = JSON.parse(e.json);
                            t.Storage.replace(n),
                            this.emit("download success")
                        } else
                            this.emit("download failed", "#NO_JSON_PRESENT")
                    }
                    ,
                    error: t=>{
                        this.emit("download failed", t.statusText)
                    }
                })
            }
        }
        class rt {
            constructor() {
                Object.assign(this, E.prototype)
            }
            apply(t, e) {
                this.data = t,
                this.refresh(e)
            }
            refresh(t) {
                if (!this.data || 0 === Object.keys(this.data).length)
                    return;
                const e = `cll-processed-${t}`
                  , n = `.new-chat-message:not(.${e})`
                  , i = Array.from(document.querySelectorAll(n)).map((t=>{
                    t.classList.add(e);
                    const n = t.querySelector(".message-section")
                      , i = t.querySelector(".author-section")
                      , s = t.querySelector(".receiver-section")
                      , o = t.classList.contains("chat-CLAN-message");
                    if (!n || !i || !s)
                        return;
                    const a = s.innerText
                      , r = n.innerText;
                    if (a)
                        return;
                    return {
                        isClanMessage: o,
                        author: i.innerText.replace(":", "").trim(),
                        text: r,
                        ref: {
                            root: t,
                            author: i,
                            text: n
                        }
                    }
                }
                ));
                for (const [t,e] of Object.entries(this.data)) {
                    i.filter((({author: e})=>e === t)).forEach((t=>{
                        const n = t.ref.author
                          , i = t.ref.root;
                        e.color && (n.style.color = e.color),
                        e.bold && (n.style.fontWeight = "bold"),
                        e.cursive && (n.style.fontStyle = "italic"),
                        e.underline && (n.style.textDecoration = "underline"),
                        e.pre && (n.innerText = `[${e.pre}] ${t.author}: `),
                        e.mute && t.isClanMessage && (i.style.display = "none")
                    }
                    ))
                }
            }
        }
        class lt {
            constructor() {
                this.added = !1,
                Object.assign(this, E.prototype)
            }
            init(t) {
                this.added || (this.added = !0,
                this.prepare(t))
            }
            prepare(t) {
                const e = _(t.text).replaceAll("\n", " [br]");
                let n = 0;
                if (!e)
                    return;
                this.emit("data", {
                    msg: e
                });
                const i = setInterval((()=>{
                    if (20 == ++n)
                        return clearInterval(i);
                    const t = Array.from(document.querySelectorAll(".mark-message-span:not(.cll-processed)"));
                    t.length > 0 && clearInterval(i),
                    t.forEach((t=>{
                        const e = "</span>";
                        if (t.classList.add("cll-processed"),
                        !t.innerText.includes(e))
                            return;
                        const n = document.createElement("a")
                          , i = t.innerText.replace(e, "");
                        n.innerText = i,
                        n.classList.add(...t.classList),
                        n.href = i,
                        n.target = "_blank",
                        n.rel = "noopener noreferrer",
                        t.parentNode.replaceChild(n, t)
                    }
                    ))
                }
                ), 100)
            }
        }
        class ct {
            constructor() {
                Object.assign(this, E.prototype)
            }
            getLauncherPosition(t) {
                this.emit("position", {
                    bottom: 125 + 25 * (t - 1)
                })
            }
        }
        class dt {
            constructor() {
                Object.assign(this, E.prototype)
            }
            prepareMessage(t) {
                this.emit("message prepared", {
                    message: t,
                    time: k((new Date).getTime())
                })
            }
        }
        class ht {
            constructor(t) {
                this.args = t
            }
            showMenu(e) {
                t.dontShowMenu ? t.dontShowMenu = !1 : new K({
                    event: e,
                    items: this.prepareMenuItems()
                })
            }
            prepareMenuItems() {
                const t = {};
                return t.profile = {
                    title: "Pokaż profil",
                    link: {
                        target: "_blank",
                        href: "https://www.margonem.pl/profile/view," + this.args.data.aid
                    }
                },
                t
            }
        }
        class mt {
            constructor() {
                Object.assign(this, E.prototype)
            }
            getPosition(t) {
                this.emit("position update", {
                    top: t.pageY + 10,
                    left: t.pageX + 13
                })
            }
            init(t) {
                this.getPosition(t.event),
                Object.values(t.items).forEach((t=>{
                    this.emit("item prepared", t)
                }
                ))
            }
        }
        class pt {
            constructor() {
                Object.assign(this, E.prototype)
            }
            sendMessage(e, n) {
                const i = t.Connection.prepare("msgToClan", n, e);
                t.Connection.wsQuery(i) ? !0 !== t.Storage.get(`${n}/disable_msg_sent_notify`) && message("Wiadomość wysłana") : t.Logger.log(`Wiadomość: ${e.txt} nie została wysłana, ponawiam...`)
            }
            validate(t) {
                return !(!t.txt || (e = t.txt,
                !e.replace(/ /g, ""))) || (message("Wiadomość jest za krótka."),
                !1);
                var e
            }
        }
        class ut {
            constructor(e) {
                2 === e.type && t.Storage.get(`${e.clanSlug}/hot_notify_sound_enabled`) && this.playSound(e),
                Object.assign(this, E.prototype)
            }
            playSound(e) {
                const n = t.Storage.get(`${e.clanSlug}/hot_notify_sound_source`) || t.defaultHOTNotifySound
                  , i = new Audio(n);
                i && i.play()
            }
            prepare(e) {
                const n = e;
                n.hideNpcIcon = t.Storage.get(`${e.clanSlug}/disable_alert_npc_icon`),
                n.post && (n.post.txt && (n.post.txt = _(n.post.txt).replace(/\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim, '<a target="_blank" rel="noreferrer noopener" href="$&">$&</a>').replace(/(^|[^/])(www\.[\S]+(\b|$))/gim, '$1"<a target="_blank" rel="noreferrer noopener" href="$2">$2</a>"')),
                2 === n.type && Object.assign(n.post, {
                    heroLvl: _(n.post.heroLvl),
                    npcName: _(n.post.npcName),
                    npcType: _(n.post.npcType),
                    npcX: parseInt(n.post.npcX, 10),
                    npcY: parseInt(n.post.npcY, 10),
                    npcLvl: parseInt(n.post.npcLvl, 10),
                    npcIcon: _(n.post.npcIcon),
                    mapName: _(n.post.mapName),
                    heroNick: _(n.post.heroNick),
                    requestedMinLvl: parseInt(n.post.requestedMinLvl, 10),
                    requestedMaxLvl: parseInt(n.post.requestedMaxLvl, 10),
                    world: _(n.post.world)
                })),
                this.emit("data prepared", n)
            }
        }
        class gt {
        }
        class yt {
            constructor() {
                this.initData = {}
            }
            parse(t) {
                this.initData = t,
                Object.entries(t).forEach((t=>{
                    const [e,n] = t
                      , i = x(e);
                    i && this.attachNeonToPlayer(i, n.color)
                }
                ))
            }
            attachNeonToPlayer(t, e) {
                t.whoIsHereGlow && (t.whoIsHereGlow.color = e)
            }
            checkPlayers(t) {
                for (let e = 0; e < t.length; e++) {
                    const n = t[e]
                      , i = this.initData[n.nick];
                    i && setTimeout(((t,e)=>{
                        const n = Engine.others.getById(t);
                        n && n.whoIsHereGlow && this.attachNeonToPlayer(n, e)
                    }
                    ), 100, parseInt(n.id, 10), i.color)
                }
            }
        }
        class bt {
            constructor(t) {
                this.args = t,
                this.slug = t.slug,
                this.Clan = t.Clan,
                this.name = _(t.name),
                this.rawName = _(t.rawName),
                this.customName = t.customName,
                this.isHighlighted = t.isHighlighted,
                this.timeLeft = t.time,
                this.browserCountdown = t.browserCountdown,
                this.uniqueKey = t.uniqueKey,
                this.isHeroOrTitan = t.isTitan,
                this.sound = {},
                this.soundOnIncomingRespEnabled = t.soundOnIncomingRespEnabled,
                this.currentRespCountdown = t.currentRespCountdown,
                Object.assign(this, E.prototype)
            }
            init() {
                this.prepareDataForView(),
                this.updateTip(),
                this.prepareMonsterStyle(),
                this.addInterval(),
                this.isHighlighted && this.setHighlight(!0),
                this.soundOnIncomingRespEnabled && this.setSound("incoming resp", !0)
            }
            prepareDataForView() {
                const e = t.Storage.get(this.slug + "/cell_width") || 130;
                this.emit("data prepared", {
                    time: p(this.timeLeft),
                    monster: this.customName || this.name,
                    style: {
                        "max-width": e,
                        "flex-basis": e
                    }
                })
            }
            setHighlight(t) {
                this.isHighlighted = t,
                this.emit("highlight update", t)
            }
            remove() {
                this.removeInterval(),
                this.emit("destroy")
            }
            setSound(e, n) {
                let i;
                if ("incoming resp" === e)
                    i = !!n && (t.Storage.get(this.uniqueKey + "/sound_on_resp_source") || t.defaultSoundOnIncomingResp),
                    this.emit("sound update", n),
                    this.soundOnIncomingRespEnabled = n;
                this.sound[e] = new Audio(i)
            }
            needPlaySound() {
                const e = t.Storage.get(`${this.uniqueKey}/sound_on_resp_timeout`);
                return e ? e === this.timeLeft : 45 === this.timeLeft
            }
            playSound(t) {
                this.sound[t] && this.sound[t].play()
            }
            removeInterval() {
                t.Interval.remove(this.uniqueKey)
            }
            addInterval() {
                t.Interval.add(this.uniqueKey, 1e3, (()=>{
                    this.doCountdown()
                }
                ))
            }
            prepareMonsterStyle() {
                const t = {};
                "maximal" === this.currentRespCountdown && (t.color = "red"),
                this.emit("monster style update", t)
            }
            prepareMenuItems() {
                const e = {};
                return this.isHighlighted ? e.highlight = {
                    title: "Wyłącz wyróżnienie",
                    onclick: ()=>{
                        t.Storage.remove("timers/highlighted", this.uniqueKey),
                        this.setHighlight(!1)
                    }
                } : e.highlight = {
                    title: "Wyróżnij",
                    onclick: ()=>{
                        t.Storage.add("timers/highlighted", this.uniqueKey),
                        this.setHighlight(!0)
                    }
                },
                this.browserCountdown ? e.a = {
                    title: "Usuń z karty przeglądarki",
                    onclick: ()=>{
                        t.Storage.remove("timers/browser_countdown"),
                        this.browserCountdown = !1,
                        t.PageTitle.setDefault()
                    }
                } : e.a = {
                    title: "Odliczaj na karcie przeglądarki",
                    onclick: ()=>{
                        this.browserCountdown = !0,
                        this.emit("change browser countdown"),
                        t.Storage.set("timers/browser_countdown", this.uniqueKey)
                    }
                },
                this.soundOnIncomingRespEnabled ? e.c = {
                    title: "Wyłącz dźwięk",
                    onclick: ()=>{
                        t.Storage.remove("timers/sound_on_incoming_resp", this.uniqueKey),
                        this.setSound("incoming resp", !1)
                    }
                } : e.c = {
                    title: "Włącz dźwięk przy nadchodzącym respie",
                    onclick: ()=>{
                        t.Storage.add("timers/sound_on_incoming_resp", this.uniqueKey),
                        this.setSound("incoming resp", !0)
                    }
                },
                !this.isHeroOrTitan && this.timeLeft < 180 && this.args.minRespTimestamp === this.args.maxRespTimestamp && (e.recount = {
                    title: "Odliczaj od początku",
                    onclick: ()=>{
                        const e = this.args.minRespTimestamp - this.args.killtime;
                        t.Connection.wsQueryOne("renewtimer", this.slug, {
                            name: this.rawName,
                            info: "Odliczanie od nowa. ",
                            min: e
                        }),
                        this.remove()
                    }
                }),
                e.hide = {
                    title: '<span data-tip="Aby przywrócić go ponownie, wejdź w C->Ustawienia->Resetuj ukryte timery ">Ukryj</span>',
                    onclick: ()=>{
                        t.Storage.add("timers/hidden", this.uniqueKey),
                        this.remove()
                    }
                },
                "admin" === this.Clan.yourRank && (e.remove = {
                    title: '<span data-tip="Całkowicie usuwa timer z serwera i nie będzie on widoczny dla innych">Usuń timer globalnie</span>',
                    onclick: ()=>{
                        confirm("Na pewno usunąć timer? Zostanie on usunięty u wszystkich na tym lootlogu.") && (this.remove(),
                        t.Connection.wsQueryOne("deletetimer", this.slug, {
                            name: this.rawName
                        }))
                    }
                }),
                e.settings = {
                    title: "Więcej ustawień",
                    onclick: ()=>{
                        new F({
                            uniqueKey: this.uniqueKey,
                            timerName: this.name,
                            clanSlug: this.slug
                        })
                    }
                },
                e
            }
            makeHeroTitanTip() {
                return {
                    currentTimestamp: w(),
                    maxRespDateString: k(1e3 * this.args.maxRespTimestamp),
                    minRespDateString: k(1e3 * this.args.minRespTimestamp),
                    minRespTimestamp: this.args.minRespTimestamp,
                    maxRespTimestamp: this.args.maxRespTimestamp
                }
            }
            makeBasicTip() {
                return this.args.tip
            }
            showMenu(e) {
                t.dontShowMenu ? t.dontShowMenu = !1 : new K({
                    event: e,
                    items: this.prepareMenuItems()
                })
            }
            checkIfRemove() {
                return this.timeLeft < -30
            }
            needTimeSwap() {
                return this.timeLeft < 1 && "minimal" === this.currentRespCountdown
            }
            updateTip() {
                this.isHeroOrTitan ? this.emit("adv tip prepared", this.makeHeroTitanTip()) : this.emit("basic tip prepared", this.makeBasicTip())
            }
            getName() {
                return this.customName || this.name
            }
            getTimeStyle(t, e) {
                let n;
                if (this.isHeroOrTitan && this.timeLeft > t || this.timeLeft > e)
                    n = "white";
                else {
                    const i = this.isHeroOrTitan ? t : e;
                    n = `rgb(255, ${parseInt(this.timeLeft / i * 255, 10)}, 0)`
                }
                return {
                    color: n
                }
            }
            setBrowserCountdown(t) {
                this.browserCountdown = t
            }
            swapTime() {
                const t = w()
                  , e = this.args.maxRespTimestamp - t;
                this.timeLeft = e,
                this.currentRespCountdown = "maximal",
                this.prepareMonsterStyle(),
                this.updateTip(),
                this.emit("time swap")
            }
            doCountdown() {
                this.timeLeft -= 1;
                const e = this.getName();
                let n = p(this.timeLeft);
                n = n.replace(/^00:/g, "").replace(/^0/, ""),
                this.emit("time update", {
                    time: n,
                    style: this.getTimeStyle(300, 120)
                }),
                this.needPlaySound() && this.playSound("incoming resp"),
                this.needTimeSwap() && this.swapTime(),
                this.browserCountdown && t.PageTitle.set(`${n} ${e}`),
                this.checkIfRemove() && (this.browserCountdown && t.PageTitle.setDefault(),
                this.remove())
            }
        }
        class wt {
            constructor(e) {
                this.args = e,
                this.current = {
                    sound_on_resp_timeout: t.Storage.get(`${e.uniqueKey}/sound_on_resp_timeout`) || 45,
                    sound_on_resp_source: t.Storage.get(`${e.uniqueKey}/sound_on_resp_source`) || t.defaultSoundOnResp,
                    custom_name: t.Storage.get(`${e.uniqueKey}/displayed_name`) || e.timerName
                },
                Object.assign(this, E.prototype)
            }
            getCurrentValues() {
                this.emit("current values", this.current)
            }
            save(e) {
                this.current = e,
                Object.entries(e).forEach((e=>{
                    const [n,i] = e;
                    t.Storage.set(`${this.args.uniqueKey}/${n}`, i)
                }
                ))
            }
        }
        class kt {
            constructor(t) {
                this.timers = {},
                this.Clan = t,
                this.slug = t.slug,
                this.$container,
                Object.assign(this, E.prototype)
            }
            removeTimersMenus() {
                t.dontShowMenu = !0,
                h()
            }
            saveContainerPosition(e) {
                t.Storage.set(this.slug + "/position_x", parseInt(e.x, 10)),
                t.Storage.set(this.slug + "/position_y", parseInt(e.y, 10))
            }
            sortTimersBy(t) {
                let e = 0;
                switch (t.by) {
                case "timeLeft":
                    this.getAllTimersSortedBy(t.by, t.direction).forEach((t=>{
                        t.setOrder(e += 1)
                    }
                    ));
                    break;
                case "name":
                    t.direction
                }
            }
            getTimerByKey(t) {
                return Object.values(this.timers).find((e=>e.model.uniqueKey === t))
            }
            shouldShowClanTag() {
                return t.Storage.get(this.slug + "/show_clan_tag")
            }
            addTimer(e) {
                this.timers[e.name] = new B(e);
                const n = this.timers[e.name];
                n.on("disable browser countdown", (()=>{
                    const e = this.getTimerByKey(t.Storage.get("timers/browser_countdown"));
                    e && e.model.setBrowserCountdown(!1)
                }
                )),
                n.on("destroy", (t=>{
                    delete this.timers[t]
                }
                )),
                n.on("time swap", (()=>{
                    this.sortTimersBy(this.getSortMethod())
                }
                ))
            }
            getAllTimersSortedBy(t, e) {
                if ("timeLeft" === t)
                    return Object.values(this.timers).sort(((t,n)=>"DESC" === e ? n.getTimeLeft() - t.getTimeLeft() : t.getTimeLeft() - n.getTimeLeft()))
            }
            isHeroOrTitanTimer(t) {
                return t.tip.startsWith("Timer utworzony przez system.")
            }
            canAddTimer(e) {
                return !t.Storage.isSet("timers/hidden", e.uniqueKey) && (!t.Storage.get(this.slug + "/disable_hot_timers") || !this.isHeroOrTitanTimer(e))
            }
            prepareTimerData(e) {
                const n = "string" != typeof (i = e.name) ? "" : t.NPCRealNames[i] || i.replace(/(?:^|\s)\S/g, (t=>t.toUpperCase()));
                var i;
                const s = this.isHeroOrTitanTimer(e)
                  , o = `${this.slug}/${n}`
                  , a = w()
                  , r = e.minRespTimestamp <= a;
                return {
                    uniqueKey: o,
                    isTitan: s,
                    time: (r ? e.maxRespTimestamp : e.minRespTimestamp) - a,
                    Clan: this.Clan,
                    name: n,
                    rawName: e.name,
                    currentRespCountdown: r ? "maximal" : "minimal",
                    isHighlighted: t.Storage.isSet("timers/highlighted", o),
                    browserCountdown: t.Storage.isSet("timers/browser_countdown", o),
                    soundOnIncomingRespEnabled: t.Storage.isSet("timers/sound_on_incoming_resp", o),
                    $container: this.$container,
                    slug: this.slug,
                    customName: t.Storage.get(`${o}/custom_name`),
                    tip: e.tip.replace("&&", "").split("##")[0]
                }
            }
            createTimers(t) {
                Object.values(t).forEach((t=>{
                    Object.assign(t, this.prepareTimerData(t)),
                    this.removeOneTimer(t.name),
                    this.canAddTimer(t) && this.addTimer(t)
                }
                ))
            }
            getSortMethod() {
                return {
                    by: t.Storage.get(this.slug + "/sort_timers_by") || "timeLeft",
                    direction: t.Storage.get(this.slug + "/sort_timers_direction") || "DESC"
                }
            }
            removeOneTimer(t) {
                this.timers.hasOwnProperty(t) && this.timers[t].remove()
            }
            removeAllTimers() {
                Object.values(this.timers).forEach((t=>{
                    t.remove()
                }
                ))
            }
            getSavedTimersSettings() {
                const e = t.Storage.get(this.slug + "/font_size") || 9
                  , n = ((t.Storage.get(this.slug + "/cell_width") || 130) + 5) * (t.Storage.get(this.slug + "/columns_amount") || 1) + 5;
                let i = t.Storage.get(`${this.slug}/timers_opacity`) || 100;
                i = parseInt(i, 10) / 100;
                const s = {
                    css: {
                        opacity: i,
                        left: t.Storage.get(this.slug + "/position_x") || 0,
                        top: t.Storage.get(this.slug + "/position_y") || 0,
                        "font-size": `${e}px`,
                        "max-width": n,
                        "line-height": `${e + 2}px`,
                        "min-width": n
                    }
                };
                return this.emit("get saved timers settings", s),
                s
            }
        }
        class ft {
            calculateTipPosition(t, e) {
                const n = t.getBoundingClientRect()
                  , i = n.top
                  , {innerHeight: s} = window
                  , o = Math.floor(s / 2)
                  , a = document.body.clientWidth
                  , r = Math.floor(a / 2)
                  , l = t.clientHeight
                  , c = t.clientWidth
                  , d = n.left
                  , h = a - d - c
                  , m = Math.floor(c / 2)
                  , p = Math.floor(e.clientWidth / 2)
                  , u = e.clientHeight
                  , g = e.clientWidth;
                return {
                    top: i <= o && i < u + 3 + 5 ? i + 3 + l + 5 : i - u - 3 - 5,
                    left: c >= g ? d + m - p : d + m > r ? h < p - m - 10 ? a - g - 10 : d + m - p : d + m - p < 10 ? 10 : d + m - p
                }
            }
        }
        class vt {
            constructor() {
                this.initData = {}
            }
            parse(t) {
                this.initData = t,
                Object.entries(t).forEach((t=>{
                    const [e,n] = t
                      , i = x(e);
                    i && this.attachTextToPlayer(i, _(n.tip))
                }
                ))
            }
            attachTextToPlayer(t, e) {
                const n = `<span class="cll-other-tip" data-content="${e}"></span>`;
                t.tip[0] += n,
                t.setTipHeader = function() {
                    const e = t.d.prof ? `<div class="profs-icon ${t.d.prof}"></div>` : "";
                    return `<div class="info-wrapper">${`<div class="nick">${t.nick} [${t.d.lvl}]</div>` + e}</div>${n}`
                }
            }
            checkPlayers(t) {
                for (let e = 0; e < t.length; e++) {
                    const n = t[e]
                      , i = this.initData[n.nick];
                    i && setTimeout(((t,e,n)=>{
                        const s = Engine.others.getById(t);
                        s && e.attachTextToPlayer(s, i.tip)
                    }
                    ), 100, parseInt(n.id, 10), this, i.tip)
                }
            }
        }
        class $t {
            constructor() {
                Object.assign(this, E.prototype)
            }
            getHiddenTimers(e) {
                const n = t.Storage.get("timers/hidden")
                  , i = [];
                n && n.forEach((t=>{
                    t.startsWith(`${e.slug}/`) && i.push({
                        name: t.split("/")[1],
                        key: t
                    })
                }
                )),
                this.emit("data", i)
            }
            unhide(e) {
                t.Storage.remove("timers/hidden", e.key)
            }
        }
        class xt {
            constructor(e) {
                this.modal = new W({
                    $container: t.$gamePositioner
                }),
                e.on("members added", (()=>{
                    this.modal.fixDimensions()
                }
                )),
                this.hide = this.modal.hide.bind(this.modal),
                this.show = this.modal.show.bind(this.modal),
                Object.assign(this, E.prototype)
            }
            draw(t) {
                const e = this.modal.setContent({
                    title: `Osoby w dodatku ${t.name}`,
                    content: "",
                    buttons: '<button id="cll-refresh-btn">Odśwież</button>' + X()
                });
                this.$content = e.$content,
                this.bindEvents(e)
            }
            bindEvents(t) {
                t.$buttons.find(".cll-close-btn").on("click", (()=>{
                    this.hide()
                }
                )),
                t.$buttons.find("#cll-refresh-btn").on("click", (()=>{
                    this.emit("refresh")
                }
                ))
            }
        }
        class zt {
            constructor(e, n) {
                this.modal = new W({
                    $container: t.$body
                }),
                this.show = this.modal.show.bind(this.modal),
                this.remove = this.modal.remove.bind(this.modal),
                this.draw(n),
                this.show(),
                e.on("hide", this.remove),
                Object.assign(this, E.prototype)
            }
            draw(t) {
                const e = this.modal.setContent({
                    title: `Dodaj timer w klanie ${t.name}`,
                    content: '\n  <div class="cll-addtimer">\n    <label for="cll-npc-name">Nazwa potwora/timera</label>\n    <input type="text" id="cll-name" minlength="2" maxlength="50">\n    <p>Minimalny czas respu</p>\n    <input class="cll-inline" id="cll-days-min" type="number" value="0" min="0" max="365"> dni\n    <input class="cll-inline" id="cll-hours-min" type="number" value="0" min="0" max="23"> godzin\n    <input class="cll-inline" id="cll-minutes-min" type="number" value="0" min="0" max="59"> minut\n    <p>Maksymalny czas respu</p>\n    <input class="cll-inline" id="cll-days-max" type="number" value="0" min="0" max="365"> dni\n    <input class="cll-inline" id="cll-hours-max" type="number" value="0" min="0" max="23"> godzin\n    <input class="cll-inline" id="cll-minutes-max" type="number" value="0" min="0" max="59"> minut\n    <label for="cll-info">Dodatkowe info</label>\n    <input type="text" id="cll-info" maxlength="50" tip="Wpisz tu: "Timer utworzony przez system." aby timer był traktowany jak heros/tytan">\n  </div>\n  ',
                    buttons: Y("Dodaj") + X("Anuluj")
                });
                this.bindEvents(e)
            }
            bindEvents(t) {
                t.$buttons.find(".cll-close-btn").on("click", (()=>{
                    this.remove()
                }
                )),
                t.$buttons.find(".cll-ok-btn").on("click", (()=>{
                    const e = t.$content;
                    this.emit("add btn clicked", {
                        name: e.find("#cll-name").val(),
                        info: e.find("#cll-info").val(),
                        min: {
                            days: e.find("#cll-days-min").val(),
                            hours: e.find("#cll-hours-min").val(),
                            minutes: e.find("#cll-minutes-min").val()
                        },
                        max: {
                            days: e.find("#cll-days-max").val(),
                            hours: e.find("#cll-hours-max").val(),
                            minutes: e.find("#cll-minutes-max").val()
                        }
                    })
                }
                ))
            }
        }
        class _t {
            constructor(e) {
                this.drawed = !1,
                this.initData = e,
                this.modal = new W({
                    $container: t.$gamePositioner
                }),
                this.hide = this.modal.hide.bind(this.modal),
                Object.assign(this, E.prototype)
            }
            draw(e) {
                const n = this.modal.setContent({
                    title: `${e.name} - Clan lootlog v${t.version}`,
                    content: tt({
                        name: e.name,
                        slug: e.slug
                    }),
                    buttons: Y()
                });
                this.drawed = !0,
                this.bindEvents(n)
            }
            bindEvents(e) {
                e.$content.find("#cll-show-settings").on("click", (()=>{
                    this.hide(),
                    this.emit("show settings clicked")
                }
                )),
                e.$content.find("#cll-show-console").on("click", (()=>{
                    this.hide(),
                    t.Logger.show()
                }
                )),
                e.$content.find("#cll-add-timer").on("click", (()=>{
                    this.hide(),
                    this.emit("addtimer clicked")
                }
                )),
                e.$content.find("#cll-hidden-timers").on("click", (()=>{
                    this.hide(),
                    this.emit("hiddentimers clicked")
                }
                )),
                e.$content.find("#cll-active-users").on("click", (()=>{
                    this.hide(),
                    this.emit("show online clicked")
                }
                )),
                e.$content.find("#cll-send-msg").on("click", (()=>{
                    this.hide(),
                    this.emit("send msg clicked")
                }
                )),
                e.$buttons.find(".cll-ok-btn").on("click", (()=>{
                    this.hide()
                }
                ))
            }
            show() {
                this.drawed || this.draw(this.initData),
                this.modal.show()
            }
        }
        class St {
            constructor(e, n) {
                this.elements,
                this.drawed = !1,
                this.initArgs = n,
                this.modal = new W({
                    $container: t.$gamePositioner
                }),
                e.on("current values", (t=>{
                    this.show(),
                    this.putCurrentValues(t)
                }
                )),
                e.on("download failed", (t=>{
                    this.modal.setInfo(`Nie udało się pobrać ustawień z serwera z powodu błędu: "${t}". Spróbuj ponownie później.`)
                }
                )),
                e.on("upload failed", (t=>{
                    this.modal.setInfo(`Nie udało się zapisać ustawień na serwerze z powodu błędu: "${t}". Spróbuj ponownie później.`)
                }
                )),
                e.on("download success", (()=>{
                    this.modal.setInfo("Ustawienia zsynchronizowane. Odśwież stronę (F5).")
                }
                )),
                e.on("upload success", (()=>{
                    this.modal.setInfo("Ustawienia zostały pomyślnie zapisane na serwerze.")
                }
                )),
                this.hide = this.modal.hide.bind(this.modal),
                Object.assign(this, E.prototype)
            }
            draw(t) {
                this.elements = this.modal.setContent({
                    title: `Ustawienia lootloga ${t.clanName}`,
                    content: et(),
                    buttons: '\n\t<div class="cll-modal-info"></div>\n\t<button id="cll-save">Zapisz</button>\n\t<button id="cll-upload" data-tip="Zapisuje ustawienia i wysyła je na serwer, aby później móc je łatwo przywrócić np. na innym komputerze">Wyślij</button>\n\t<button id="cll-download" data-tip="Pobiera z serwera wcześniej zapisane ustawienia i nadpisuje nimi obecne">Pobierz</button>\n\t<button id="cll-reset" data-tip="Resetuje wszystkie ustawienia do wartości domyślnych">Zresetuj</button>\n\t<button id="cll-close">Zamknij okno</button>\n\t<a href="https://grooove.pl/blog/" class="cll-help-link" target="_blank">Pomoc</a>\n'
                }),
                this.drawed = !0,
                this.bindEvents(this.elements)
            }
            bindEvents(t) {
                const e = this.modal.setInfo.bind(this.modal);
                t.$buttons.find("#cll-save").on("click", (()=>{
                    this.emit("save", this.getValues()),
                    e("Niektóre ustawienia mogą wymagać odświeżenia strony (F5).")
                }
                )),
                t.$buttons.find("#cll-upload").on("click", (()=>{
                    this.emit("upload", this.getValues()),
                    e("Wysyłanie...")
                }
                )),
                t.$buttons.find("#cll-download").on("click", (()=>{
                    this.emit("download"),
                    e("Pobieranie...")
                }
                )),
                t.$buttons.find("#cll-reset").on("click", (()=>{
                    this.emit("reset all"),
                    e("Ustawienia zostały zresetowane. Wymagane jest odświeżenie strony.")
                }
                )),
                t.$buttons.find("#cll-close").on("click", (()=>{
                    this.hide()
                }
                )),
                t.$content.find("#cll-reset-position").on("click", (()=>{
                    this.emit("reset position"),
                    e("Pozycja zresetowana. Wymagane jest odświeżenie strony.")
                }
                ))
            }
            putCurrentValues(t) {
                C(t, this.elements.$content)
            }
            getValues() {
                return O(this.elements.$content)
            }
            show() {
                this.drawed || this.draw(this.initArgs),
                this.modal.show()
            }
        }
        class jt {
            constructor(t) {
                t.on("data", (t=>{
                    this.draw(t)
                }
                ))
            }
            draw(t) {
                GrooveObject.insertChatMsg(!1, t)
            }
        }
        class Tt {
            constructor(t) {
                this.$main,
                t.on("position", (t=>{
                    this.setStyle(t)
                }
                )),
                Object.assign(this, E.prototype)
            }
            draw(t) {
                const e = (n = t.text,
                i = t.letter,
                `<div class="cll-launcher" data-tip="${n}">${i}</div>`);
                var n, i;
                this.$main = $(e).appendTo(t.$container),
                this.bindEvents()
            }
            bindEvents() {
                this.$main.on("click", (()=>{
                    this.emit("launcher clicked")
                }
                ))
            }
            setStyle(t) {
                this.$main.css(t)
            }
        }
        class Ct {
            constructor(e) {
                this.$main,
                this.modal = new W({
                    $container: t.$gamePositioner
                }),
                e.on("message prepared", (t=>{
                    this.appendMessage(t)
                }
                )),
                this.show = this.modal.show.bind(this.modal),
                this.hide = this.modal.hide.bind(this.modal),
                this.draw()
            }
            draw() {
                const e = this.modal.setContent({
                    title: `Komunikaty lootlogów v${t.version})`,
                    content: '<div id="cll-logger-content"></div>',
                    buttons: X()
                });
                this.$main = e.$content.find("#cll-logger-content"),
                this.bindEvents(e)
            }
            bindEvents(t) {
                t.$buttons.find(".cll-close-btn").on("click", (()=>{
                    this.hide()
                }
                ))
            }
            appendMessage(t) {
                const e = `\n<div class="cll-logger-message">\n  <b class="cll-logger-message-time">${(n = t).time}</b>\n  <span class="cll-logger-message-content">\n    ${n.message}\n  </span>\n</div>\n`;
                var n;
                $(e).appendTo(this.$main),
                this.modal.fixDimensions()
            }
        }
        class Ot {
            constructor(t, e) {
                this.draw(e),
                this.$main,
                Object.assign(this, E.prototype)
            }
            draw(t) {
                const e = function(t) {
                    const e = function(t) {
                        switch (t) {
                        case 1:
                            return "GŁÓWNY ADMIN";
                        case 2:
                            return "ADMIN";
                        case 3:
                            return "członek";
                        case 4:
                            return "okres próbny";
                        default:
                            return "?"
                        }
                    }(t.rank)
                      , n = t.connected ? "" : " (offline)";
                    return `<p class="cll-member-wrapper"><span class="cll-member ${t.connected ? "cll-online" : "cll-offline"}" tip="${e + n}">${t.nick}</span></p>`
                }(t.data);
                this.$main = $(e).appendTo(t.$container),
                this.bindEvents()
            }
            bindEvents() {
                this.$main.on("click", (t=>{
                    this.emit("member clicked", t)
                }
                ))
            }
            remove() {
                this.$main.remove()
            }
        }
        class Et {
            constructor(t, e) {
                this.model = t,
                this.args = e,
                this.$main,
                this.createDOMElement(),
                this.model.on("position update", (t=>{
                    this.setStyle(t)
                }
                )),
                this.model.on("item prepared", (t=>{
                    t.link ? this.drawLinkItem(t) : this.drawItem(t)
                }
                ))
            }
            createDOMElement() {
                this.$main = $('<div class="cll-menu"></div>').appendTo(this.args.$container)
            }
            drawLinkItem(t) {
                const e = `<a class="cll-menu-item" href="${(n = t).link.href}" target="${n.link.target}">${n.title}</a>`;
                var n;
                $(e).appendTo(this.$main)
            }
            drawItem(t) {
                const e = `<div class="cll-menu-item">${{
                    title: t.title
                }.title}</div>`;
                $(e).appendTo(this.$main).on("mousedown", (()=>{
                    t.onclick()
                }
                ))
            }
            setStyle(t) {
                this.$main.css(t)
            }
            remove() {
                this.$main.remove()
            }
        }
        class It {
            constructor(e, n) {
                this.initArgs = n,
                this.isDrawed = !1,
                this.$textarea,
                this.modal = new W({
                    $container: t.$gamePositioner
                }),
                this.hide = this.modal.hide.bind(this.modal),
                this.bindShortcut(),
                Object.assign(this, E.prototype)
            }
            draw(t) {
                const e = this.modal.setContent({
                    title: `Komunikat do klanu ${t.name}`,
                    content: '\n<textarea id="cll-message-textarea" placeholder="Twoja wiadomość (max 500 znaków)"></textarea>\n',
                    buttons: '\n<button id="cll-message-send">Wyślij</button>\n<button id="cll-message-cancel">Anuluj</button>\n'
                });
                e.$sendButton = e.$buttons.find("#cll-message-send"),
                e.$textarea = e.$content.find("#cll-message-textarea"),
                this.$textarea = e.$textarea,
                this.isDrawed = !0,
                this.bindEvents(e)
            }
            bindEvents(t) {
                t.$buttons.find("#cll-message-cancel").on("click", (()=>{
                    this.hide()
                }
                )),
                t.$sendButton.on("click", (()=>{
                    this.emit("send button clicked", {
                        txt: t.$textarea.val()
                    }),
                    t.$textarea.val(""),
                    this.hide()
                }
                )),
                t.$textarea.keypress((e=>{
                    13 === e.which && t.$sendButton.trigger("click")
                }
                ))
            }
            bindShortcut() {
                t.$body.on("keyup", (e=>{
                    if (e.shiftKey && !["INPUT", "TEXTAREA", "MAGIC_INPUT"].includes(e.target.tagName)) {
                        const n = String.fromCharCode(e.keyCode).toLowerCase();
                        let i = t.Storage.get(`${this.initArgs.slug}/shortcut_key_showmsgbox`);
                        "string" == typeof i && i.length && (i = i.toLowerCase(),
                        n === i && this.show())
                    }
                }
                ))
            }
            show() {
                this.isDrawed || this.draw(this.initArgs),
                this.modal.show(),
                this.$textarea.focus()
            }
        }
        class Mt {
            constructor(t) {
                this.$main,
                this.$content,
                this.$header,
                this.$buttons,
                this.isDraggable = !1,
                Object.assign(this, E.prototype),
                t.on("data prepared", (t=>{
                    this.draw(t)
                }
                ))
            }
            draw(e) {
                let n, i, s;
                const o = function(t) {
                    const e = t ? "textarea" : "div";
                    return `\n<div class="cll-alert">\n  <div class="cll-alert-container>">\n    <div class="cll-alert-header"></div>\n    <${e} class="cll-alert-content"></${e}>\n    <div class="cll-alert-buttons"></div>\n  </div>\n</div>\n`
                }(1 === e.type && e.post.txt.indexOf("href=") < 0);
                switch (this.$main = $(o).appendTo(t.$body),
                this.$content = this.$main.find(".cll-alert-content"),
                this.$header = this.$main.find(".cll-alert-header"),
                this.$buttons = this.$main.find(".cll-alert-buttons"),
                e.type) {
                case 1:
                    this.setContent({
                        title: e.clanName,
                        content: `${e.post.txt} //${e.author}`,
                        buttons: (e.countAll > 2 ? '<button id="cll-close-all">Ukryj wszystkie</button>' : "") + '<button id="cll-ok">Ukryj</button><button id="cll-reply">Odpowiedz</button>'
                    }),
                    i = t.Storage.get(`${e.clanSlug}/alert_autohide_timeout`),
                    "number" == typeof i && i && (s = this,
                    setTimeout((()=>{
                        s.remove()
                    }
                    ), 1e3 * i));
                    break;
                case 2:
                    this.setContent({
                        title: e.clanName,
                        content: Q(e),
                        buttons: '<button id="cll-ok">Ukryj</button><button id="cll-confirm">Potwierdź chęć bicia</button>'
                    });
                    break;
                case 3:
                    n = '<button id="cll-ok">Ukryj</button>',
                    e.post.autoInvite ? setTimeout((()=>{
                        this.emit("notify clicked", {})
                    }
                    ), 10) : n += '<button id="cll-notify">Zawołaj klanowiczów</button>',
                    this.setContent({
                        buttons: n,
                        title: e.clanName,
                        content: J(e.post)
                    })
                }
                this.setStyle(function(e, n) {
                    let i = 0;
                    const s = Math.random()
                      , o = Math.floor(30 * s)
                      , a = e.width()
                      , r = t.$body.width();
                    let l = r - a;
                    return i = n ? (t.Storage.get(`${n}/alerts_pos_y`) || 5) + o : o,
                    a > 500 && (l = r - 500),
                    {
                        top: i,
                        left: Math.floor(l / 2) + (1 === Math.round(s + 1) ? 1 : -1) * Math.floor(100 * s),
                        position: "absolute"
                    }
                }(this.$main, e.clanSlug)),
                this.bindEvents()
            }
            setContent(t) {
                this.$content.html(t.content),
                this.$header.text(t.title),
                this.$buttons.html(t.buttons)
            }
            bindEvents() {
                this.$main.on("mouseenter", (()=>{
                    "function" != typeof this.$main.draggable || this.isDraggable || (this.$main.draggable(),
                    this.isDraggable = !0)
                }
                )),
                this.$buttons.find("#cll-ok").on("click", (()=>{
                    this.emit("remove clicked"),
                    this.remove()
                }
                )),
                this.$buttons.find("#cll-reply").on("click", (()=>{
                    this.emit("reply clicked"),
                    this.remove()
                }
                )),
                this.$buttons.find("#cll-confirm").on("click", (()=>{
                    this.emit("confirm clicked"),
                    this.remove()
                }
                ));
                const t = this.$buttons.find("#cll-close-all");
                t && t.on("click", (()=>{
                    this.emit("remove all clicked")
                }
                )),
                this.$buttons.find("#cll-notify").on("click", (()=>{
                    const t = this.$content.find(".cll-min-lvl").val()
                      , e = this.$content.find(".cll-max-lvl").val();
                    this.emit("notify clicked", {
                        requestedMaxLvl: parseInt(e, 10) || 0,
                        requestedMinLvl: parseInt(t, 10) || 0
                    }),
                    this.remove()
                }
                )),
                this.$content.on("click", (()=>{
                    this.$content.select()
                }
                ))
            }
            setStyle(t) {
                this.$main.css(t)
            }
            remove() {
                this.$main.remove()
            }
        }
        class Nt {
            constructor() {
                this.$main,
                this.$butons,
                this.$content,
                this.$title,
                this.$info,
                this.isDraggable = !1
            }
            draw(t) {
                this.$main = $('\n<div class="cll-modal">\n  <div class="cll-modal-title"></div>\n  <div class="cll-modal-content"></div>\n  <div class="cll-modal-buttons"></div>\n</div>\n').appendTo(t.$container),
                this.$buttons = this.$main.find(".cll-modal-buttons"),
                this.$content = this.$main.find(".cll-modal-content"),
                this.$title = this.$main.find(".cll-modal-title"),
                this.bindEvents()
            }
            bindEvents() {
                this.$main.on("mouseenter", (()=>{
                    "function" != typeof this.$main.draggable || this.isDraggable || (this.$main.draggable({
                        drag: (t,e)=>{
                            e.position.top += 1.2 * (e.offset.top - e.originalPosition.top),
                            e.position.left += 1.2 * (e.offset.left - e.originalPosition.left)
                        }
                    }),
                    this.isDraggable = !0)
                }
                ))
            }
            setInfo(t) {
                this.$info && this.$info.length && (this.$info.html(t),
                setTimeout((()=>{
                    this.$info.html("")
                }
                ), 5e3))
            }
            setStyle(t) {
                this.$main.css(t)
            }
            show() {
                this.fixDimensions(),
                this.setStyle({
                    visibility: "visible"
                }),
                this.setInfo("")
            }
            hide() {
                this.setStyle({
                    visibility: "hidden"
                })
            }
            remove() {
                this.$main.remove()
            }
            fixDimensions() {
                this.setStyle({
                    position: "initial",
                    display: "inline-block",
                    height: "auto"
                });
                const t = this.$main.width()
                  , e = this.$main.height() + 30;
                this.setStyle({
                    position: "absolute",
                    width: "90%",
                    "max-width": t,
                    height: e,
                    display: "flex"
                })
            }
            setContent(t) {
                return t.title && this.$title.html(t.title),
                t.buttons && this.$buttons.html(t.buttons),
                t.content && this.$content.html(t.content),
                this.$info = this.$buttons.find(".cll-modal-info"),
                {
                    $buttons: this.$buttons,
                    $content: this.$content
                }
            }
        }
        class Pt {
        }
        class Lt {
            constructor(e) {
                this.elements,
                this.modal = new W({
                    $container: t.$body
                }),
                e.on("current values", (t=>{
                    this.putCurrentValues(t)
                }
                )),
                this.remove = this.modal.remove.bind(this.modal),
                Object.assign(this, E.prototype)
            }
            draw(t) {
                var e;
                this.elements = this.modal.setContent({
                    title: `Ustawienia timera "${t.uniqueKey}"`,
                    content: (e = t.clanSlug,
                    `\n<div class="cll-settings">\n\t<input data-key="custom_name" type="text"> wyświetlana nazwa <br>\n\t<input data-key="sound_on_resp_source" type="text" data-tip="plik zostanie odegrany tylko wtedy, jeśli dźwięk dla tego timera został włączony"> adres do pliku dźwiękowego odgrywanego przy zbliżającym się respie <br>\n\t<input data-key="sound_on_resp_timeout" type="number"> ilość sekund przed respem potwora, kiedy odegrany zostanie dźwięk <br>\n\t<br>\n\t<a class="cll-link" target="_blank" href="https://grooove.pl/${e}/timerConfigure">Konfiguruj czas respu</a>\n</div>\n`),
                    buttons: '\n<div class="cll-modal-info"></div>\n<button id="cll-save">Zapisz</button>\n<button id="cll-cancel">Zamknij okno</button>\n'
                }),
                this.bindEvents(this.elements),
                this.modal.show()
            }
            putCurrentValues(t) {
                C(t, this.elements.$content)
            }
            getValues() {
                return O(this.elements.$content)
            }
            bindEvents(t) {
                t.$buttons.find("#cll-save").on("click", (()=>{
                    this.emit("save clicked", this.getValues()),
                    this.modal.setInfo("Niektóre ustawienia wymagają odświeżenia strony (F5)."),
                    this.remove()
                }
                )),
                t.$buttons.find("#cll-cancel").on("click", (()=>{
                    this.remove()
                }
                ))
            }
        }
        class Dt {
            constructor(t, e) {
                this.$main,
                this.$time,
                this.$monster,
                this.args = e,
                t.on("adv tip prepared", (t=>{
                    this.setTip(this.makeTip(t))
                }
                )),
                t.on("basic tip prepared", (t=>{
                    this.setTip(t)
                }
                )),
                t.on("data prepared", (t=>{
                    this.draw(t),
                    this.bindEvents(),
                    this.setStyle(t.style)
                }
                )),
                t.on("destroy", (t=>{
                    this.remove()
                }
                )),
                t.on("monster style update", (t=>{
                    this.setMonsterStyle(t)
                }
                )),
                t.on("time update", (t=>{
                    this.setTime(t.time).setTimeStyle(t.style)
                }
                )),
                t.on("highlight update", (t=>{
                    this.setHighlight(t)
                }
                )),
                t.on("sound update", (t=>{
                    this.drawSoundIcon(t)
                }
                )),
                Object.assign(this, E.prototype)
            }
            draw(t) {
                const e = function(t) {
                    return `\n<div class="cll-timer" data-tip="">\n  <div class="cll-timer-monster">\n    ${t.monster}\n  </div>\n  <div class="cll-timer-time">\n    ${t.time}\n  </div>\n</div>\n`
                }(t)
                  , n = $(e);
                this.$main = n.appendTo(this.args.$container),
                this.$time = this.$main.find(".cll-timer-time"),
                this.$monster = this.$main.find(".cll-timer-monster")
            }
            setHighlight(t) {
                this.$main[t ? "addClass" : "removeClass"]("cll-timer-highlighted")
            }
            drawSoundIcon(t) {
                this.$main[t ? "addClass" : "removeClass"]("cll-timer-sound-enabled")
            }
            setStyle(t) {
                this.$main.css(t)
            }
            setTimeStyle(t) {
                this.$time.css(t)
            }
            setMonsterStyle(t) {
                this.$monster.css(t)
            }
            setSoundIcon(t) {
                this.$main[t ? "addClass" : "removeClass"]("cll-timer-sound-enabled")
            }
            makeTip(t) {
                return function(t) {
                    let e = "";
                    return t.currentTimestamp >= t.minRespTimestamp ? e += `Resp minimalny: <b class="cll-tip-time-reached">${t.minRespDateString}</b>` : e += `Resp minimalny: <b class="cll-tip-time">${t.minRespDateString}</b>`,
                    t.currentTimestamp >= t.maxRespTimestamp ? e += `<br>Resp maksymalny: <b class="cll-tip-time-reached">${t.maxRespDateString}</b>` : e += `<br>Resp maksymalny: <b class="cll-tip-time">${t.maxRespDateString}</b>`,
                    e
                }(t)
            }
            setTip(t) {
                this.$main.attr("data-tip", t)
            }
            setTime(t) {
                return this.$time.html(t),
                this
            }
            bindEvents() {
                this.$main.on("click", (t=>{
                    this.emit("timer clicked", t)
                }
                ))
            }
            remove() {
                this.$main.remove()
            }
        }
        class Rt {
            constructor(t, e) {
                this.model = t,
                this.isVisible = !0,
                this.isDraggable = !1,
                this.$main,
                this.clanSlug = e,
                Object.assign(this, E.prototype),
                this.model.on("get saved timers settings", (t=>{
                    this.setStyle(t.css)
                }
                ))
            }
            draw(...e) {
                const n = function(t, e, n) {
                    return `<div class="cll-timers" ${n ? `data-name="${e}"` : ""} id="cll-timers-${t}"></div>`
                }(...e);
                this.$main = $(n).appendTo(t.$body)
            }
            bindEvents() {
                this.$main.on("mouseenter", (()=>{
                    "function" != typeof this.$main.draggable || this.isDraggable || (this.$main.draggable({
                        start: ()=>{
                            this.emit("drag start")
                        }
                        ,
                        stop: ()=>{
                            this.emit("drag stop", {
                                x: this.$main.css("left"),
                                y: this.$main.css("top")
                            })
                        }
                    }),
                    this.isDraggable = !0)
                }
                )),
                t.$body.on("keypress", (e=>{
                    if (e.shiftKey && !["INPUT", "TEXTAREA", "MAGIC_INPUT"].includes(e.target.tagName)) {
                        const n = String.fromCharCode(e.keyCode).toLowerCase();
                        let i = t.Storage.get(`${this.clanSlug}/shortcut_key`);
                        "string" == typeof i && i.length && (i = i.toLowerCase(),
                        n === i && this.toggle())
                    }
                }
                ))
            }
            setStyle(t) {
                this.$main.css(t)
            }
            toggle() {
                this.makeVisible(!this.isVisible)
            }
            makeVisible(t) {
                this.isVisible = t,
                this.setStyle({
                    visibility: t ? "visible" : "hidden"
                })
            }
        }
        class At {
            constructor(t) {}
        }
        class Kt {
            constructor() {
                this.mainClass = "c-tip",
                this.visibleClass = "c-tip--visible",
                this.$main = null
            }
            getTip() {
                return this.$main
            }
            create() {
                return this.$main = document.createElement("div"),
                this.$main.classList.add(this.mainClass),
                document.body.appendChild(this.$main),
                this.$main
            }
            setContent(t) {
                return this.$main.innerHTML = t,
                this
            }
            show(t) {
                return this.$main.classList.add(this.visibleClass),
                t.addEventListener("mouseleave", this.hide.bind(this)),
                this
            }
            hide() {
                return this.$main.classList.remove(this.visibleClass),
                this
            }
            setPosition(t) {
                return this.$main.style.left = `${t.left}px`,
                this.$main.style.top = `${t.top}px`,
                this
            }
        }
        class qt {
            constructor(e, n) {
                this.args = n,
                this.modal = new W({
                    $container: t.$body
                }),
                this.show = this.modal.show.bind(this.modal),
                this.hide = this.modal.hide.bind(this.modal),
                e.on("data", (t=>{
                    this.draw(t),
                    this.show()
                }
                )),
                Object.assign(this, E.prototype)
            }
            draw(t) {
                const e = this.modal.setContent({
                    title: `Ukryte timery w klanie ${this.args.name}`,
                    content: nt(t),
                    buttons: X()
                });
                this.bindEvents(e)
            }
            bindEvents(t) {
                t.$buttons.find(".cll-close-btn").click((()=>{
                    this.hide()
                }
                )),
                t.$content.find(".cll-bordered-button").click((t=>{
                    const e = $(t.target);
                    this.emit("el clicked", {
                        key: e.attr("data-key")
                    }),
                    e.remove()
                }
                ))
            }
        }
        t.Interval = new class {
            constructor() {
                this.intervals = {}
            }
            add(t, e, n) {
                this.intervals[t] = {
                    time: e,
                    interval: setInterval(n, e)
                }
            }
            remove(t) {
                this.intervals.hasOwnProperty(t) && (clearInterval(this.intervals[t].interval),
                delete this.intervals[t])
            }
        }
        ,
        t.Logger = new class {
            constructor() {
                const t = new dt
                  , e = new Ct(t);
                this.log = t.prepareMessage.bind(t),
                this.show = e.show.bind(e),
                this.hide = e.hide.bind(e)
            }
        }
        ,
        t.PageTitle = new class {
            constructor(t) {
                this.defaultTitle = t
            }
            set(t) {
                document.title = t
            }
            setDefault() {
                this.set(this.defaultTitle)
            }
        }
        (t.defaultPageTitle),
        t.Storage = new class {
            constructor(t) {
                this.uniqueKey = t,
                this.settings = localStorage[this.uniqueKey] ? JSON.parse(localStorage[this.uniqueKey]) : {}
            }
            replace(t) {
                this.settings = t,
                this.save()
            }
            getAll() {
                return this.settings
            }
            get(t) {
                return this.settings[t]
            }
            save() {
                localStorage[this.uniqueKey] = JSON.stringify(this.settings)
            }
            set(t, e) {
                this.settings[t] = e,
                this.save()
            }
            add(t, e) {
                "object" != typeof this.settings[t] && (this.settings[t] = []),
                this.settings[t].includes(e) || (this.settings[t].push(e),
                this.save())
            }
            isSet(t, e) {
                return "object" == typeof this.settings[t] ? this.settings[t].includes(e) : e === this.settings[t]
            }
            remove(t, e) {
                e && "object" == typeof this.settings[t] ? this.settings[t] = this.settings[t].filter((t=>t !== e)) : delete this.settings[t],
                this.save()
            }
            removeAllValuesInKeyByPattern(t, e) {
                "object" == typeof this.settings[t] && Object.entries(this.settings[t]).forEach((n=>{
                    const [i,s] = n;
                    s.startsWith(`${e}/`) && this.remove(t, s)
                }
                )),
                this.save()
            }
            removeAllByKey(t) {
                Object.keys(this.settings).forEach((e=>{
                    e.startsWith(`${t}/`) && delete this.settings[e]
                }
                )),
                this.save()
            }
        }
        ("new-cll-settings"),
        t.Connection = new class {
            constructor(e) {
                this.WS,
                this.timeout,
                this.unauthorized = !1,
                this.tried = 0,
                this.url = t.WSServer,
                this.options = {
                    reconnection: !1,
                    forceNew: !0,
                    transports: ["websocket"]
                }
            }
            connect() {
                t.Logger.log("Trwa łączenie z serwerem minutników..."),
                this.WS = new gacllio(this.url,this.options),
                this.WS.on("connect", (()=>{
                    t.Logger.log("Połączenie nawiązane. Trwa autoryzacja użytkownika na serwerze..."),
                    this.timeout = setTimeout((()=>{
                        t.Logger.log('<b style="color:red">Nie udało się zidentyfikować Cię na serwerze. Sprawdź <a class="cll-link" href="https://grooove.pl/FAQ/klanowy-lootlog/nie-widze-minutnikow/" target="_blank">stronę FAQ</a>, szczególnie punkt 4.</b>')
                    }
                    ), 1e4)
                }
                )),
                this.WS.on("disconnect", (e=>{
                    t.Logger.log(`Połączenie zerwane [${e}].`),
                    this.unauthorized || (t.Logger.log("Ponawianie połączenia..."),
                    setTimeout((()=>this.connect()), 9e3))
                }
                )),
                this.WS.on("connect_error", (e=>{
                    t.loggedIn = !1,
                    t.Logger.log(`Wystąpił błąd połączenia: ${e}`),
                    "Error: xhr poll error" === e.toString() ? t.Logger.log("Prawdopodobnie obecnie trwa przerwa techniczna lub serwer nie odpowiada. Odśwież stronę za kilkanaście sekund.") : this.tried < 4 && !this.unauthorized && (t.Logger.log("Ponawianie połączenia..."),
                    this.tried += 1,
                    setTimeout((()=>this.connect()), 1e4))
                }
                )),
                this.WS.on("message", (e=>{
                    if (e.unauthorized)
                        return this.unauthorized = !0,
                        void t.Logger.log('<b style="color:red">Nie jesteś zalogowany lub masz zablokowane cookies dla grooove.pl.</b>');
                    e.COOKIE && (this.unauthorized = !1,
                    t.loggedIn = !0,
                    this.wsQueryAll("init", {}),
                    clearTimeout(this.timeout),
                    t.Logger.log("Sukces, pozyskano ID użytkownika.")),
                    "string" == typeof e.log && t.Logger.log(e.log),
                    "object" == typeof e.settings && t.Logger.log(`Sukces, załadowano ustawienia klanu: ${e.clan}`),
                    "object" == typeof t.clans[e.clan] && t.clans[e.clan].router(e)
                }
                ))
            }
            prepare(t, e, n) {
                const i = {
                    action: t,
                    clan: e,
                    clanID: Engine.hero.d.clan ? Engine.hero.d.clan.id : 1,
                    aid: T("user_id")
                };
                return Object.assign(n, i)
            }
            wsQuery(e) {
                return this.WS && this.WS.connected && t.loggedIn ? (this.WS.emit("data", e),
                !0) : (setTimeout((()=>{
                    this.wsQuery(e)
                }
                ), 5e3),
                !1)
            }
            wsQueryAll(e, n) {
                Object.values(t.clans).forEach((t=>{
                    this.tryToSend(e, t, n)
                }
                ))
            }
            wsQueryOne(e, n, i) {
                return this.tryToSend(e, t.clans[n], i)
            }
            tryToSend(t, e, n) {
                return !!e.canUserDoAction(t) && this.wsQuery(this.prepare(t, e.slug, n))
            }
        }
        (t.serverUrl),
        t.Tip = new class {
            constructor() {
                this.view = new Kt,
                this.model = new ft,
                this.isTipElementCreated = !1
            }
            showFor(t, e) {
                this.isTipElementCreated || (this.view.create(),
                this.isTipElementCreated = !0);
                const n = this.view.getTip();
                return this.view.show(t).setContent(e).setPosition(this.model.calculateTipPosition(t, n)),
                this
            }
        }
        ,
        t.Logger.log(location.host),
        t.Logger.log(navigator.userAgent),
        t.Interval.add("Engine", 30, (()=>{
            "object" == typeof Engine && Engine && (Object.values(GACLL.clans).forEach((e=>{
                t.clans[e] = new n({
                    slug: e,
                    order: Object.keys(t.clans).length + 1
                }),
                t.Logger.log("Dodatek załadowany: " + e)
            }
            )),
            t.Interval.remove("Engine"),
            t.Connection.connect())
        }
        )),
        t.$head.append("\n<style>\n\n.cll-launcher {\n  width: 12px;\n  height: 12px;\n  padding: 6px;\n  position: absolute;\n  bottom: 125px;\n  z-index: 297;\n  background: #91917E;\n  border: 1px solid rgb(63,60,60);\n  opacity: 0.6;\n  color: #fff;\n  left: 1px;\n  pointer-events: initial;\n}\n\n.cll-modal {\n  text-align: center;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  margin: auto;\n  min-width: 180px;\n  background: #1b1717;\n  z-index: 999;\n  max-height: 75vh;\n  border: 1px solid #000000;\n  padding: 5px;\n  color: #7d7878;\n  pointer-events: initial;\n  font-family: sans-serif;\n  visibility: hidden;\n  display: none;\n  flex-wrap: wrap;\n  justify-content: center;\n  align-items: center;\n  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.8);\n  text-shadow: 1px 1px 2px black;\n}\n\n.cll-modal-title {\n  font-size: 14px;\n  color: #3a78ca;\n  margin-top: 5px;\n  box-sizing: border-box;\n  padding-bottom: 3px;\n  flex-basis: 100%;\n}\n\n.cll-modal-buttons {\n  box-sizing: border-box;\n  padding-bottom: 3px;\n  flex-basis: 100%;\n}\n\n.cll-member-wrapper {\n\ttext-align: left;\n}\n\n.cll-member {\n\tposition: relative;\n\tpadding: 2px 0;\n  margin: 2px 0 2px 25px;\n  font-size: 11px;\n}\n\n.cll-member::before {\n  content: '';\n  display: block;\n  width: 10px;\n  height: 10px;\n  position: absolute;\n  background: grey;\n  left: -20px;\n  border-radius: 50%;\n  top: 4px;\n}\n\n.cll-online {\n\tcolor: #dadada;\n}\n\n.cll-online::before {\n\tbackground: green;\n}\n\n.cll-offline {\n\tcolor: grey;\n}\n\n.cll-member:hover {\n\tbackground: rgba(255, 255, 255, 0.03);\n\tcursor: pointer;\n}\n\n.cll-modal-content {\n  box-sizing: border-box;\n  margin-top: 10px;\n  flex-basis: 100%;\n  overflow-y: auto;\n  max-height: 70%;\n  padding-bottom: 5px;\n}\n\n.cll-modal-info {\n  font-size: 11px;\n  color: yellow;\n  min-height: 20px;\n}\n\n.cll-modal-content::-webkit-scrollbar {\n  width: 4px;\n}\n\n.cll-modal-content::-webkit-scrollbar-track {\n  background: #252121;\n}\n\n.cll-modal-content::-webkit-scrollbar-thumb {\n  background: #aeadad;\n}\n\n.cll-modal textarea {\n  width: 454px;\n  border: none;\n  padding: 5px;\n  font-size: 12px;\n  height: 130px;\n  max-height: 100px;\n  max-width: 90%;\n  min-width: 90%;\n  min-height: 100px;\n  background: #aeadad;\n  outline: none;\n}\n\n.cll-modal button {\n  margin: 5px 2px 0 1px;\n  color: #000000;\n  font-size: 11px;\n  background-color: rgba(255,255,255,0.63);\n  border: none;\n  padding: 5px 12px 4px;\n  cursor: pointer;\n  outline: none;\n  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.8);\n}\n\n.cll-modal button:hover {\n  background: rgba(255,255,255,0.85);\n}\n\n.cll-link {\n  color: orange;\n  text-decoration: none;\n  text-align: center;\n  margin: 0 auto;\n  font-size: 13px;\n  line-height: 25px;\n}\n\n.cll-link:hover {\n  text-decoration: underline;\n}\n\n.cll-bordered-button {\n  border: 1px solid #694b0e;\n  padding: 4px 8px 3px;\n  display: inline-block;\n  max-width: 120px;\n  margin: 0 auto;\n  font-size: 9px;\n  line-height: 12px;\n  cursor: pointer;\n  color: orange;\n  margin-top: 7px;\n  box-sizing: border-box;\n  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.8);\n  text-decoration: none;\n  text-align: center;\n}\n\n.cll-bordered-button:hover {\n  background: #0e0e0e;\n  border-color: #730f0f;\n}\n\n.cll-help-link {\n  position: absolute;\n  right: 10px;\n  bottom: 12px;\n  font-size: 11px;\n  color: orange;\n}\n\n.cll-help-link:hover {\n  color: red;\n}\n\n#cll-logger-content {\n  font-size: 10px;\n  line-height: 13px;\n  margin: 0 5px;\n  text-align: left;\n  color: #f5f5f5;\n  letter-spacing: 0.3px;\n}\n\n.cll-timers {\n  position: absolute !important;\n  top: 72px;\n  left: 260px;\n  z-index: 300;\n  display: flex;\n  max-width: 400px;\n  flex-wrap: wrap;\n  font-size: 9px;\n  line-height: 11px;\n}\n\n.cll-timers::before {\n  content: attr(data-name);\n  font-size: 9px;\n  padding: 1px 0;\n  font-family: sans-serif;\n  letter-spacing: 0.5px;\n}\n\n.cll-timer {\n  text-align: center;\n  font-family: Segoe UI,sans-serif;\n  margin-top: -1px;\n  margin-left: -1px;\n  display: inline-block;\n  background: black;\n  border: 1px solid rgb(19, 55, 62);\n  flex-basis: 130px;\n  cursor: pointer;\n  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);\n  text-shadow: 1px 1px 2px black;\n}\n\n.cll-other-tip::after {\n\tdisplay: block;\n  width: 100%;\n  height: auto;\n  z-index: 99999;\n  background: rgba(0, 0, 0, 0.8);\n  content: attr(data-content);\n  padding: 5px 3px;\n  top: calc(100% + 5px);\n  box-sizing: border-box;\n  font-size: 12px;\n  position: absolute;\n  text-align: center;\n  left: 0;\n}\n\n.cll-timer-highlighted {\n  background: #002758;\n}\n\n.cll-timer.cll-timer-highlighted:hover {\n  background: #033471;\n}\n\n.cll-timer:hover {\n  background: #2b2a2a;\n}\n\n.cll-timer-time {\n  color: white;\n  position: relative;\n  pointer-events: none;\n}\n\n.cll-timer-sound-enabled .cll-timer-time:after {\n  content: '';\n  display: block;\n  width: 3px;\n  height: 3px;\n  position: absolute;\n  background: #00ff08;\n  bottom: 2px;\n  right: 2px;\n}\n\n.cll-timer-monster {\n  color: rgb(70, 227, 255);\n  margin-bottom: -1px;\n  pointer-events: none;\n}\n\n.cll-tip-time {\n  color: green;\n}\n.cll-tip-time-reached {\n  color: red;\n}\n\n.cll-alert {\n  position: absolute;\n  width: 90%;\n  min-width: 180px;\n  max-width: 500px;\n  background: white;\n  z-index: 400;\n  border: 3px double red;\n  padding: 5px;\n  text-align: center;\n  font-family: Segoe UI, sans-serif;\n  pointer-events: initial;\n  box-shadow: 4px 4px 14px 0px rgba(19, 19, 19, 0.6);\n}\n\n.cll-alert-npcspotted {\n  z-index: 500;\n}\n\n.cll-alert-header {\n  font-weight: bold;\n  text-transform: uppercase;\n  font-size: 14px;\n}\n\n.cll-alert-content {\n  margin: 12px 0 0;\n  font-size: 11px;\n  width: 100%;\n  border: none;\n  resize: none;\n  text-align: center;\n  font-family: Arial;\n}\n\n.cll-alert button {\n  margin: 5px auto 0;\n  font-size: 11px;\n  border: none;\n  padding: 7px 13px 4px;\n  cursor: pointer;\n  outline: none;\n  background: #fd4b4b;\n  color: white;\n  margin-right: 4px;\n  box-shadow: 1px 1px 4px #696969;\n}\n\n.cll-alert button:hover {\n  background: #ff0000;\n}\n\n.cll-menu {\n  position: absolute;\n  width: 100px;\n  font-size: 9px;\n  z-index: 999;\n  background: #e2e2e2;\n  font-family: Segoe UI, sans-serif;\n  line-height: 10px;\n  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);\n}\n\n.cll-menu-item {\n\tdisplay: block;\n  text-align: center;\n  cursor: pointer;\n  padding: 3px 1px;\n  border-top: 1px solid transparent;\n  border-bottom: 1px solid transparent;\n  text-decoration: none;\n  color: black;\n}\n\n.cll-menu-item:hover {\n  background: white;\n  border-color: #ff7373;\n}\n\n.cll-settings {\n  text-align: left;\n  font-size: 11px;\n  color: #a7a7a7;\n}\n\n.cll-modal label {\n  display: block;\n}\n\n.cll-addtimer {\n  font-size: 11px;\n  color: #a7a7a7;\n  min-width: 400px;\n}\n\n.cll-addtimer label,\n.cll-addtimer p {\n  margin: 12px 0 4px;\n}\n\n.cll-modal .cll-addtimer input[type=\"number\"] {\n  width: 50px;\n  padding: 4px;\n}\n\n.cll-modal .cll-addtimer input[type=\"text\"] {\n  width: 200px;\n  padding: 4px;\n}\n\n.cll-modal input[type=number],\n.cll-modal input[type=text] {\n  width: 100px;\n  border: none;\n  padding: 2px 5px;\n  font-size: 12px;\n  outline: none;\n  margin: 0 3px 3px 4px;\n  background: #aeadad;\n}\n\n.cll-info {\n  font-size: 11px;\n  color: #ffb500;\n}\n\n.cll-daily-msg {\n  font-family: sans-serif;\n  font-size: 11px;\n  font-weight: bold;\n  color: yellow;\n  margin: 10px 20px 10px 10px;\n  border-top: 1px dashed #ffffff26;\n  border-bottom: 1px dashed #ffffff26;\n  padding: 5px 0;\n  text-align: center;\n}\n.cll-hot-img {\n\tmax-height: 100px;\n}\n\n.cll-min-lvl, .cll-max-lvl {\n  border: 1px solid grey;\n  background: white;\n  width: 30px;\n  padding: 2px 4px;\n  text-align: center;\n  font-size: 12px;\n}\n\n@media (min-width: 800px) {\n  .c-tip {\n    max-width: 450px;\n  }\n}\n\n.c-tip {\n  font-family: sans-serif;\n  display: none;\n  background: #171819;\n  border: 1px solid #333c43;\n  color: #a9b2ba;\n  font-size: 12px;\n  line-height: 18px;\n  max-width: 92vw;\n  padding: 5px 10px 4px;\n  position: absolute;\n  box-shadow: 0 1px 6px 0 #0c0e11;\n  border-radius: 5px;\n  z-index: 999;\n}\n\n.c-tip--visible {\n  display: block !important;\n}\n\n</style>\n"),
        t.$body.on({
            mousedown: t=>{
                t.target.classList.contains("cll-menu-item") && "A" === t.target.tagName || h()
            }
            ,
            mousewheel: t=>{
                t.target.className.startsWith("cll-") && t.stopPropagation()
            }
        }),
        t.$body.on("mouseenter", "[data-tip]", (e=>{
            e.target.dataset.tip && (e.target.classList.toString().includes("cll") || e.target.parentNode.classList.toString().includes("cll")) && t.Tip.showFor(e.target, e.target.dataset.tip)
        }
        ))
    }();
}());
