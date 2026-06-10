(function() {
  var aa = "_gat",ba = "_gaq",r = true,v = false,w = undefined,ca = "4.6.5",x = "length",y = "cookie",A = "location",B = "&",C = "=",D = "__utma=",E = "__utmb=",G = "__utmc=",da = "__utmk=",H = "__utmv=",J = "__utmz=",K = "__utmx=",L = "GASO=";
  var N = function(i) {
    return w == i || "-" == i || "" == i
  },ea = function(i) {
    return i[x] > 0 && " \n\r\t".indexOf(i) > -1
  },P = function(i, l, g) {
    var t = "-",k;
    if (!N(i) && !N(l) && !N(g)) {
      k = i.indexOf(l);
      if (k > -1) {
        g = i.indexOf(g, k);
        if (g < 0)g = i[x];
        t = O(i, k + l.indexOf(C) + 1, g)
      }
    }
    return t
  },Q = function(i) {
    var l = v,g = 0,t,k;
    if (!N(i)) {
      l = r;
      for (t = 0; t < i[x]; t++) {
        k = i.charAt(t);
        g += "." == k ? 1 : 0;
        l = l && g <= 1 && (0 == t && "-" == k || ".0123456789".indexOf(k) > -1)
      }
    }
    return l
  },S = function(i, l) {
    var g = encodeURIComponent;
    return g instanceof Function ? l ? encodeURI(i) : g(i) : escape(i)
  },
    T = function(i, l) {
      var g = decodeURIComponent,t;
      i = i.split("+").join(" ");
      if (g instanceof Function)try {
        t = l ? decodeURI(i) : g(i)
      } catch(k) {
        t = unescape(i)
      } else t = unescape(i);
      return t
    },U = function(i, l) {
    return i.indexOf(l) > -1
  },V = function(i, l) {
    i[i[x]] = l
  },W = function(i) {
    return i.toLowerCase()
  },X = function(i, l) {
    return i.split(l)
  },fa = function(i, l) {
    return i.indexOf(l)
  },O = function(i, l, g) {
    g = w == g ? i[x] : g;
    return i.substring(l, g)
  },ga = function(i, l) {
    return i.join(l)
  },ia = function(i) {
    var l = 1,g = 0,t;
    if (!N(i)) {
      l = 0;
      for (t = i[x] - 1; t >= 0; t--) {
        g =
        i.charCodeAt(t);
        l = (l << 6 & 268435455) + g + (g << 14);
        g = l & 266338304;
        l = g != 0 ? l ^ g >> 21 : l
      }
    }
    return l
  },ja = function() {
    var i = window,l = w;
    if (i && i.gaGlobal && i.gaGlobal.hid)l = i.gaGlobal.hid; else {
      l = Y();
      i.gaGlobal = i.gaGlobal ? i.gaGlobal : {};
      i.gaGlobal.hid = l
    }
    return l
  },Y = function() {
    return Math.round(Math.random() * 2147483647)
  },Z = {Ha:function(i, l) {
    this.bb = i;
    this.nb = l
  },ib:v,_gasoDomain:w,_gasoCPath:w};
  Z.Gb = function() {
    function i(k) {
      return new t(k[0], k[1])
    }

    function l(k) {
      var p = [];
      k = k.split(",");
      var f;
      for (f = 0; f < k.length; ++f)p.push(i(k[f].split(":")));
      return p
    }

    var g = this,t = Z.Ha;
    g.Ia = "utm_campaign";
    g.Ja = "utm_content";
    g.Ka = "utm_id";
    g.La = "utm_medium";
    g.Ma = "utm_nooverride";
    g.Na = "utm_source";
    g.Oa = "utm_term";
    g.Pa = "gclid";
    g.ba = 0;
    g.z = 0;
    g.Ta = 15768E6;
    g.sb = 18E5;
    g.v = 63072E6;
    g.ta = [];
    g.va = [];
    g.nc = "cse";
    g.oc = "q";
    g.ob = 5;
    g.T = l("daum:q,eniro:search_word,naver:query,images.google:q,google:q,yahoo:p,msn:q,bing:q,aol:query,aol:encquery,lycos:query,ask:q,altavista:q,netscape:query,cnn:query,about:terms,mamma:query,alltheweb:q,voila:rdata,virgilio:qs,live:q,baidu:wd,alice:qs,yandex:text,najdi:q,aol:q,mama:query,seznam:q,search:q,wp:szukaj,onet:qt,szukacz:q,yam:k,pchome:q,kvasir:q,sesam:q,ozu:q,terra:query,mynet:q,ekolay:q,rambler:words");
    g.t = w;
    g.lb = v;
    g.h = "/";
    g.U = 100;
    g.oa = "/__utm.gif";
    g.ga = 1;
    g.ha = 1;
    g.u = "|";
    g.fa = 1;
    g.da = 1;
    g.Ra = 1;
    g.b = "auto";
    g.I = 1;
    g.ra = 1E3;
    g.Jc = 10;
    g.Pb = 10;
    g.Kc = 0.2;
    g.o = w;
    g.a = document;
    g.e = window
  };
  Z.Hb = function(i) {
    function l(d, a, j, c) {
      var n = "",s = 0;
      n = P(d, "2" + a, ";");
      if (!N(n)) {
        d = n.indexOf("^" + j + ".");
        if (d < 0)return["",0];
        n = O(n, d + j[x] + 2);
        if (n.indexOf("^") > 0)n = n.split("^")[0];
        j = n.split(":");
        n = j[1];
        s = parseInt(j[0], 10);
        if (!c && s < p.r)n = ""
      }
      if (N(n))n = "";
      return[n,s]
    }

    function g(d, a) {
      return"^" + ga([[a,d[1]].join("."),d[0]], ":")
    }

    function t(d, a) {
      f.a[y] = d + "; path=" + f.h + "; " + a + p.fb()
    }

    function k(d) {
      var a = new Date;
      d = new Date(a.getTime() + d);
      return"expires=" + d.toGMTString() + "; "
    }

    var p = this,f = i;
    p.r = (new Date).getTime();
    var h = [D,E,G,J,H,K,L];
    p.k = function() {
      var d = f.a[y];
      return f.o ? p.Wb(d, f.o) : d
    };
    p.Wb = function(d, a) {
      var j = [],c,n;
      for (c = 0; c < h[x]; c++) {
        n = l(d, h[c], a)[0];
        N(n) || (j[j[x]] = h[c] + n + ";")
      }
      return j.join("")
    };
    p.l = function(d, a, j) {
      var c = j > 0 ? k(j) : "";
      if (f.o) {
        a = p.kc(f.a[y], d, f.o, a, j);
        d = "2" + d;
        c = j > 0 ? k(f.v) : ""
      }
      t(d + a, c)
    };
    p.kc = function(d, a, j, c, n) {
      var s = "";
      n = n || f.v;
      c = g([c,p.r + n * 1], j);
      s = P(d, "2" + a, ";");
      if (!N(s)) {
        d = g(l(d, a, j, r), j);
        s = ga(s.split(d), "");
        return s = c + s
      }
      return c
    };
    p.fb = function() {
      return N(f.b) ? "" : "domain=" + f.b + ";"
    }
  };
  Z.$ = function(i) {
    function l(b) {
      b = b instanceof Array ? b.join(".") : "";
      return N(b) ? "-" : b
    }

    function g(b, e) {
      var o = [];
      if (!N(b)) {
        o = b.split(".");
        if (e)for (b = 0; b < o[x]; b++)Q(o[b]) || (o[b] = "-")
      }
      return o
    }

    function t(b, e, o) {
      var m = c.M,q,u;
      for (q = 0; q < m[x]; q++) {
        u = m[q][0];
        u += N(e) ? e : e + m[q][4];
        m[q][2](P(b, u, o))
      }
    }

    var k,p,f,h,d,a,j,c = this,n,s = i;
    c.j = new Z.Hb(i);
    c.kb = function() {
      return w == n || n == c.P()
    };
    c.k = function() {
      return c.j.k()
    };
    c.ma = function() {
      return d ? d : "-"
    };
    c.vb = function(b) {
      d = b
    };
    c.za = function(b) {
      n = Q(b) ? b * 1 : "-"
    };
    c.la = function() {
      return l(a)
    };
    c.Aa = function(b) {
      a = g(b)
    };
    c.Vb = function() {
      c.j.l(H, "", -1)
    };
    c.lc = function() {
      return n ? n : "-"
    };
    c.fb = function() {
      return N(s.b) ? "" : "domain=" + s.b + ";"
    };
    c.ja = function() {
      return l(k)
    };
    c.tb = function(b) {
      k = g(b, 1)
    };
    c.C = function() {
      return l(p)
    };
    c.ya = function(b) {
      p = g(b, 1)
    };
    c.ka = function() {
      return l(f)
    };
    c.ub = function(b) {
      f = g(b, 1)
    };
    c.na = function() {
      return l(h)
    };
    c.wb = function(b) {
      h = g(b);
      for (b = 0; b < h[x]; b++)if (b < 4 && !Q(h[b]))h[b] = "-"
    };
    c.fc = function() {
      return j
    };
    c.Dc = function(b) {
      j = b
    };
    c.Sb = function() {
      k = [];
      p = [];
      f = [];
      h = [];
      d = w;
      a = [];
      n =
      w
    };
    c.P = function() {
      var b = "",e;
      for (e = 0; e < c.M[x]; e++)b += c.M[e][1]();
      return ia(b)
    };
    c.ua = function(b) {
      var e = c.k(),o = v;
      if (e) {
        t(e, b, ";");
        c.za(c.P());
        o = r
      }
      return o
    };
    c.zc = function(b) {
      t(b, "", B);
      c.za(P(b, da, B))
    };
    c.Hc = function() {
      var b = c.M,e = [],o;
      for (o = 0; o < b[x]; o++)V(e, b[o][0] + b[o][1]());
      V(e, da + c.P());
      return e.join(B)
    };
    c.Nc = function(b, e) {
      var o = c.M,m = s.h;
      c.ua(b);
      s.h = e;
      for (b = 0; b < o[x]; b++)N(o[b][1]()) || o[b][3]();
      s.h = m
    };
    c.Cb = function() {
      c.j.l(D, c.ja(), s.v)
    };
    c.Ea = function() {
      c.j.l(E, c.C(), s.sb)
    };
    c.Db = function() {
      c.j.l(G,
        c.ka(), 0)
    };
    c.Ga = function() {
      c.j.l(J, c.na(), s.Ta)
    };
    c.Eb = function() {
      c.j.l(K, c.ma(), s.v)
    };
    c.Fa = function() {
      c.j.l(H, c.la(), s.v)
    };
    c.Oc = function() {
      c.j.l(L, c.fc(), 0)
    };
    c.M = [
      [D,c.ja,c.tb,c.Cb,"."],
      [E,c.C,c.ya,c.Ea,""],
      [G,c.ka,c.ub,c.Db,""],
      [K,c.ma,c.vb,c.Eb,""],
      [J,c.na,c.wb,c.Ga,"."],
      [H,c.la,c.Aa,c.Fa,"."]
    ]
  };
  Z.Kb = function(i) {
    var l = this,g = i,t = new Z.$(g),k = function() {
    },p = function(f) {
      var h = (new Date).getTime(),d;
      d = (h - f[3]) * (g.Kc / 1E3);
      if (d >= 1) {
        f[2] = Math.min(Math.floor(f[2] * 1 + d), g.Pb);
        f[3] = h
      }
      return f
    };
    l.H = function(f, h, d, a, j, c) {
      var n,s = g.I,b = g.a[A];
      t.ua(d);
      n = X(t.C(), ".");
      if (n[1] < 500 || a) {
        if (j)n = p(n);
        if (a || !j || n[2] >= 1) {
          if (!a && j)n[2] = n[2] * 1 - 1;
          n[1] = n[1] * 1 + 1;
          f = "?utmwv=" + ca + "&utmn=" + Y() + (N(b.hostname) ? "" : "&utmhn=" + S(b.hostname)) + (g.U == 100 ? "" : "&utmsp=" + S(g.U)) + f;
          if (0 == s || 2 == s) {
            a = 2 == s ? k : c || k;
            l.$a(g.oa + f, a)
          }
          if (1 == s ||
              2 == s) {
            f = ("https:" == b.protocol ? "https://ssl.google-analytics.com/__utm.gif" : "http://www.google-analytics.com/__utm.gif") + f + "&utmac=" + h + "&utmcc=" + l.ac(d);
            if (ka)f += "&gaq=1";
            l.$a(f, c)
          }
        }
      }
      t.ya(n.join("."));
      t.Ea()
    };
    l.$a = function(f, h) {
      var d = new Image(1, 1);
      d.src = f;
      d.onload = function() {
        d.onload = null;
        (h || k)()
      }
    };
    l.ac = function(f) {
      var h = [],d = [D,J,H,K],a,j = t.k(),c;
      for (a = 0; a < d[x]; a++) {
        c = P(j, d[a] + f, ";");
        if (!N(c)) {
          if (d[a] == H) {
            c = X(c.split(f + ".")[1], "|")[0];
            if (N(c))continue;
            c = f + "." + c
          }
          V(h, d[a] + c + ";")
        }
      }
      return S(h.join("+"))
    }
  };
  Z.n = function() {
    var i = this;
    i.Y = [];
    i.hb = function(l) {
      var g,t = i.Y,k;
      for (k = 0; k < t.length; k++)g = l == t[k].q ? t[k] : g;
      return g
    };
    i.Ob = function(l, g, t, k, p, f, h, d) {
      var a = i.hb(l);
      if (w == a) {
        a = new Z.n.Mb(l, g, t, k, p, f, h, d);
        V(i.Y, a)
      } else {
        a.Qa = g;
        a.Ab = t;
        a.zb = k;
        a.xb = p;
        a.Xa = f;
        a.yb = h;
        a.Za = d
      }
      return a
    }
  };
  Z.n.Lb = function(i, l, g, t, k, p) {
    var f = this;
    f.Bb = i;
    f.Ba = l;
    f.D = g;
    f.Va = t;
    f.pb = k;
    f.qb = p;
    f.Ca = function() {
      return"&" + ["utmt=item","tid=" + S(f.Bb),"ipc=" + S(f.Ba),"ipn=" + S(f.D),"iva=" + S(f.Va),"ipr=" + S(f.pb),"iqt=" + S(f.qb)].join("&utm")
    }
  };
  Z.n.Mb = function(i, l, g, t, k, p, f, h) {
    var d = this;
    d.q = i;
    d.Qa = l;
    d.Ab = g;
    d.zb = t;
    d.xb = k;
    d.Xa = p;
    d.yb = f;
    d.Za = h;
    d.R = [];
    d.Nb = function(a, j, c, n, s) {
      var b = d.gc(a),e = d.q;
      if (w == b)V(d.R, new Z.n.Lb(e, a, j, c, n, s)); else {
        b.Bb = e;
        b.Ba = a;
        b.D = j;
        b.Va = c;
        b.pb = n;
        b.qb = s
      }
    };
    d.gc = function(a) {
      var j,c = d.R,n;
      for (n = 0; n < c.length; n++)j = a == c[n].Ba ? c[n] : j;
      return j
    };
    d.Ca = function() {
      return"&" + ["utmt=tran","id=" + S(d.q),"st=" + S(d.Qa),"to=" + S(d.Ab),"tx=" + S(d.zb),"sp=" + S(d.xb),"ci=" + S(d.Xa),"rg=" + S(d.yb),"co=" + S(d.Za)].join("&utmt")
    }
  };
  Z.Fb = function(i) {
    function l() {
      var f,h,d;
      h = "ShockwaveFlash";
      var a = "$version",j = k.d ? k.d.plugins : w;
      if (j && j[x] > 0)for (f = 0; f < j[x] && !d; f++) {
        h = j[f];
        if (U(h.name, "Shockwave Flash"))d = h.description.split("Shockwave Flash ")[1]
      } else {
        h = h + "." + h;
        try {
          f = new ActiveXObject(h + ".7");
          d = f.GetVariable(a)
        } catch(c) {
        }
        if (!d)try {
          f = new ActiveXObject(h + ".6");
          d = "WIN 6,0,21,0";
          f.AllowScriptAccess = "always";
          d = f.GetVariable(a)
        } catch(n) {
        }
        if (!d)try {
          f = new ActiveXObject(h);
          d = f.GetVariable(a)
        } catch(s) {
        }
        if (d) {
          d = X(d.split(" ")[1], ",");
          d = d[0] +
              "." + d[1] + " r" + d[2]
        }
      }
      return d ? d : p
    }

    var g = i,t = g.e,k = this,p = "-";
    k.V = t.screen;
    k.Sa = !k.V && t.java ? java.awt.Toolkit.getDefaultToolkit() : w;
    k.d = t.navigator;
    k.W = p;
    k.xa = p;
    k.Wa = p;
    k.qa = p;
    k.pa = 1;
    k.eb = p;
    k.bc = function() {
      var f;
      if (t.screen) {
        k.W = k.V.width + "x" + k.V.height;
        k.xa = k.V.colorDepth + "-bit"
      } else if (k.Sa)try {
        f = k.Sa.getScreenSize();
        k.W = f.width + "x" + f.height
      } catch(h) {
      }
      k.qa = W(k.d && k.d.language ? k.d.language : k.d && k.d.browserLanguage ? k.d.browserLanguage : p);
      k.pa = k.d && k.d.javaEnabled() ? 1 : 0;
      k.eb = g.ha ? l() : p;
      k.Wa = S(g.a.characterSet ?
               g.a.characterSet : g.a.charset ? g.a.charset : p)
    };
    k.Ic = function() {
      return B + "utm" + ["cs=" + S(k.Wa),"sr=" + k.W,"sc=" + k.xa,"ul=" + k.qa,"je=" + k.pa,"fl=" + S(k.eb)].join("&utm")
    };
    k.$b = function() {
      var f = g.a,h = t.history[x];
      f = k.d.appName + k.d.version + k.qa + k.d.platform + k.d.userAgent + k.pa + k.W + k.xa + (f[y] ? f[y] : "") + (f.referrer ? f.referrer : "");
      for (var d = f[x]; h > 0;)f += h-- ^ d++;
      return ia(f)
    }
  };
  Z.m = function(i, l, g, t) {
    function k(d) {
      var a = "";
      d = W(d.split("://")[1]);
      if (U(d, "/")) {
        d = d.split("/")[1];
        if (U(d, "?"))a = d.split("?")[0]
      }
      return a
    }

    function p(d) {
      var a = "";
      a = W(d.split("://")[1]);
      if (U(a, "/"))a = a.split("/")[0];
      return a
    }

    var f = t,h = this;
    h.c = i;
    h.rb = l;
    h.r = g;
    h.ic = function(d) {
      var a = h.gb();
      return new Z.m.w(P(d, f.Ka + C, B), P(d, f.Na + C, B), P(d, f.Pa + C, B), h.Q(d, f.Ia, "(not set)"), h.Q(d, f.La, "(not set)"), h.Q(d, f.Oa, a && !N(a.K) ? T(a.K) : w), h.Q(d, f.Ja, w))
    };
    h.jb = function(d) {
      var a = p(d),j = k(d);
      if (U(a, "google")) {
        d = d.split("?").join(B);
        if (U(d, B + f.oc + C))if (j == f.nc)return r
      }
      return v
    };
    h.gb = function() {
      var d,a = h.rb,j,c,n = f.T;
      if (!(N(a) || "0" == a || !U(a, "://") || h.jb(a))) {
        d = p(a);
        for (j = 0; j < n[x]; j++) {
          c = n[j];
          if (U(d, W(c.bb))) {
            a = a.split("?").join(B);
            if (U(a, B + c.nb + C)) {
              d = a.split(B + c.nb + C)[1];
              if (U(d, B))d = d.split(B)[0];
              return new Z.m.w(w, c.bb, w, "(organic)", "organic", d, w)
            }
          }
        }
      }
    };
    h.Q = function(d, a, j) {
      d = P(d, a + C, B);
      return j = !N(d) ? T(d) : !N(j) ? j : "-"
    };
    h.uc = function(d) {
      var a = f.ta,j = v,c;
      if (d && "organic" == d.S) {
        d = W(T(d.K));
        for (c = 0; c < a[x]; c++)j = j || W(a[c]) == d
      }
      return j
    };
    h.hc = function() {
      var d = "",a = "";
      d = h.rb;
      if (!(N(d) || "0" == d || !U(d, "://") || h.jb(d))) {
        d = d.split("://")[1];
        if (U(d, "/")) {
          a = O(d, d.indexOf("/"));
          a = a.split("?")[0];
          d = W(d.split("/")[0])
        }
        if (0 == d.indexOf("www."))d = O(d, 4);
        return new Z.m.w(w, d, w, "(referral)", "referral", w, a)
      }
    };
    h.Xb = function(d) {
      var a = "";
      if (f.ba) {
        a = d && d.hash ? d.href.substring(d.href.indexOf("#")) : "";
        a = "" != a ? a + B : a
      }
      a += d.search;
      return a
    };
    h.dc = function() {
      return new Z.m.w(w, "(direct)", w, "(direct)", "(none)", w, w)
    };
    h.vc = function(d) {
      var a = v,j,c = f.va;
      if (d && "referral" ==
               d.S) {
        d = W(S(d.X));
        for (j = 0; j < c[x]; j++)a = a || U(d, W(c[j]))
      }
      return a
    };
    h.L = function(d) {
      return w != d && d.mb()
    };
    h.cc = function(d, a) {
      var j = "",c = "-",n,s = 0,b,e,o = h.c;
      if (!d)return"";
      e = d.k();
      j = h.Xb(f.a[A]);
      if (f.z && d.kb()) {
        c = d.na();
        if (!N(c) && !U(c, ";")) {
          d.Ga();
          return""
        }
      }
      c = P(e, J + o + ".", ";");
      n = h.ic(j);
      if (h.L(n)) {
        j = P(j, f.Ma + C, B);
        if ("1" == j && !N(c))return""
      }
      if (!h.L(n)) {
        n = h.gb();
        if (!N(c) && h.uc(n))return""
      }
      if (!h.L(n) && a) {
        n = h.hc();
        if (!N(c) && h.vc(n))return""
      }
      if (!h.L(n))if (N(c) && a)n = h.dc();
      if (!h.L(n))return"";
      if (!N(c)) {
        s = c.split(".");
        b = new Z.m.w;
        b.Zb(s.slice(4).join("."));
        b = W(b.Da()) == W(n.Da());
        s = s[3] * 1
      }
      if (!b || a) {
        a = P(e, D + o + ".", ";");
        e = a.lastIndexOf(".");
        a = e > 9 ? O(a, e + 1) * 1 : 0;
        s++;
        a = 0 == a ? 1 : a;
        d.wb([o,h.r,a,s,n.Da()].join("."));
        d.Ga();
        return B + "utmcn=1"
      } else return B + "utmcr=1"
    }
  };
  Z.m.w = function(i, l, g, t, k, p, f) {
    var h = this;
    h.q = i;
    h.X = l;
    h.ea = g;
    h.D = t;
    h.S = k;
    h.K = p;
    h.Ya = f;
    h.Da = function() {
      var d = [],a = [
        ["cid",h.q],
        ["csr",h.X],
        ["gclid",h.ea],
        ["ccn",h.D],
        ["cmd",h.S],
        ["ctr",h.K],
        ["cct",h.Ya]
      ],j,c;
      if (h.mb())for (j = 0; j < a[x]; j++)if (!N(a[j][1])) {
        c = a[j][1].split("+").join("%20");
        c = c.split(" ").join("%20");
        V(d, "utm" + a[j][0] + C + c)
      }
      return d.join("|")
    };
    h.mb = function() {
      return!(N(h.q) && N(h.X) && N(h.ea))
    };
    h.Zb = function(d) {
      var a = function(j) {
        return T(P(d, "utm" + j + C, "|"))
      };
      h.q = a("cid");
      h.X = a("csr");
      h.ea = a("gclid");
      h.D = a("ccn");
      h.S = a("cmd");
      h.K = a("ctr");
      h.Ya = a("cct")
    }
  };
  Z.Ib = function(i, l, g, t) {
    function k(j, c, n) {
      var s;
      if (!N(n)) {
        n = n.split(",");
        for (var b = 0; b < n[x]; b++) {
          s = n[b];
          if (!N(s)) {
            s = s.split(h);
            if (s[x] == 4)c[s[0]] = [s[1],s[2],j]
          }
        }
      }
    }

    var p = this,f = l,h = C,d = i,a = t;
    p.O = g;
    p.sa = "";
    p.p = {};
    p.tc = function() {
      var j;
      j = X(P(p.O.k(), H + f + ".", ";"), f + ".")[1];
      if (!N(j)) {
        j = j.split("|");
        k(1, p.p, j[1]);
        p.sa = j[0];
        p.Z()
      }
    };
    p.Z = function() {
      p.Qb();
      var j = p.sa,c,n,s = "";
      for (c in p.p)if ((n = p.p[c]) && 1 === n[2])s += c + h + n[0] + h + n[1] + h + 1 + ",";
      N(s) || (j += "|" + s);
      if (N(j))p.O.Vb(); else {
        p.O.Aa(f + "." + j);
        p.O.Fa()
      }
    };
    p.Ec =
    function(j) {
      p.sa = j;
      p.Z()
    };
    p.Cc = function(j, c, n, s) {
      if (1 != s && 2 != s && 3 != s)s = 3;
      var b = v;
      if (c && n && j > 0 && j <= d.ob) {
        c = S(c);
        n = S(n);
        if (c[x] + n[x] <= 64) {
          p.p[j] = [c,n,s];
          p.Z();
          b = r
        }
      }
      return b
    };
    p.mc = function(j) {
      if ((j = p.p[j]) && 1 === j[2])return j[1]
    };
    p.Ub = function(j) {
      var c = p.p;
      if (c[j]) {
        delete c[j];
        p.Z()
      }
    };
    p.Qb = function() {
      a._clearKey(8);
      a._clearKey(9);
      a._clearKey(11);
      var j = p.p,c,n;
      for (n in j)if (c = j[n]) {
        a._setKey(8, n, c[0]);
        a._setKey(9, n, c[1]);
        (c = c[2]) && 3 != c && a._setKey(11, n, "" + c)
      }
    }
  };
  Z.N = function() {
    function i(m, q, u, z) {
      if (w == f[m])f[m] = {};
      if (w == f[m][q])f[m][q] = [];
      f[m][q][u] = z
    }

    function l(m, q) {
      if (w != f[m] && w != f[m][q]) {
        f[m][q] = w;
        q = r;
        var u;
        for (u = 0; u < a[x]; u++)if (w != f[m][a[u]]) {
          q = v;
          break
        }
        if (q)f[m] = w
      }
    }

    function g(m) {
      var q = "",u = v,z,M;
      for (z = 0; z < a[x]; z++) {
        M = m[a[z]];
        if (w != M) {
          if (u)q += a[z];
          q += t(M);
          u = v
        } else u = r
      }
      return q
    }

    function t(m) {
      var q = [],u,z;
      for (z = 0; z < m[x]; z++)if (w != m[z]) {
        u = "";
        if (z != o && w == m[z - 1])u += z.toString() + s;
        u += k(m[z]);
        V(q, u)
      }
      return j + q.join(n) + c
    }

    function k(m) {
      var q = "",u,z,M;
      for (u = 0; u <
                  m[x]; u++) {
        z = m.charAt(u);
        M = e[z];
        q += w != M ? M : z
      }
      return q
    }

    var p = this,f = {},h = "k",d = "v",a = [h,d],j = "(",c = ")",n = "*",s = "!",b = "'",e = {};
    e[b] = "'0";
    e[c] = "'1";
    e[n] = "'2";
    e[s] = "'3";
    var o = 1;
    p.qc = function(m) {
      return w != f[m]
    };
    p.G = function() {
      var m = "",q;
      for (q in f)if (w != f[q])m += q.toString() + g(f[q]);
      return m
    };
    p.Ac = function(m) {
      if (m == w)return p.G();
      var q = m.G(),u;
      for (u in f)if (w != f[u] && !m.qc(u))q += u.toString() + g(f[u]);
      return q
    };
    p._setKey = function(m, q, u) {
      if (typeof u != "string")return v;
      i(m, h, q, u);
      return r
    };
    p._setValue = function(m,
                           q, u) {
      if (typeof u != "number" && (w == Number || !(u instanceof Number)) || Math.round(u) != u || u == NaN || u == Infinity)return v;
      i(m, d, q, u.toString());
      return r
    };
    p._getKey = function(m, q) {
      return w != f[m] && w != f[m][h] ? f[m][h][q] : w
    };
    p._getValue = function(m, q) {
      return w != f[m] && w != f[m][d] ? f[m][d][q] : w
    };
    p._clearKey = function(m) {
      l(m, h)
    };
    p._clearValue = function(m) {
      l(m, d)
    }
  };
  Z.Jb = function(i, l) {
    var g = this;
    g.Qc = l;
    g.xc = i;
    g._trackEvent = function(t, k, p) {
      return l._trackEvent(g.xc, t, k, p)
    }
  };
  Z.aa = function(i, l) {
    function g() {
      if ("auto" == c.b) {
        var b = c.a.domain;
        if ("www." == O(b, 0, 4))b = O(b, 4);
        c.b = b
      }
      c.b = W(c.b)
    }

    function t() {
      var b = c.b,e = b.indexOf("www.google.") * b.indexOf(".google.") * b.indexOf("google.");
      return e || "/" != c.h || b.indexOf("google.org") > -1
    }

    function k(b, e, o) {
      if (N(b) || N(e) || N(o))return"-";
      b = P(b, D + a.c + ".", e);
      if (!N(b)) {
        b = b.split(".");
        b[5] = b[5] ? b[5] * 1 + 1 : 1;
        b[3] = b[4];
        b[4] = o;
        b = b.join(".")
      }
      return b
    }

    function p() {
//      return"file:" != c.a[A].protocol && t()
      return true; /* Mojo apps are loaded via the file protocol, so return true here to enable tracking */
    }

    function f(b) {
      if (!b || "" == b)return"";
      for (; ea(b.charAt(0));)b =
                              O(b, 1);
      for (; ea(b.charAt(b[x] - 1));)b = O(b, 0, b[x] - 1);
      return b
    }

    function h(b, e, o, m) {
      if (!N(b())) {
        e(m ? T(b()) : b());
        U(b(), ";") || o()
      }
    }

    function d(b) {
      var e,o = "" != b && c.a[A].host != b;
      if (o)for (e = 0; e < c.t[x]; e++)o = o && fa(W(b), W(c.t[e])) == -1;
      return o
    }

    var a = this,j = w,c = new Z.Gb,n = v,s = w;
    a.e = window;
    a.r = Math.round((new Date).getTime() / 1E3);
    a.s = i || "UA-XXXXX-X";
    a.ab = c.a.referrer;
    a.ia = w;
    a.f = w;
    a.B = w;
    a.F = v;
    a.A = w;
    a.Ua = "";
    a.g = w;
    a.cb = w;
    a.c = w;
    a.i = w;
    c.o = l ? S(l) : w;
    a.wc = function() {
      var b = v;
      if (a.B)b = a.B.match(/^[0-9a-z-_.]{10,1200}$/i);
      return b
    };
    a.jc = function() {
      return Y() ^ a.A.$b() & 2147483647
    };
    a.ec = function() {
      if (!c.b || "" == c.b || "none" == c.b) {
        c.b = "";
        return 1
      }
      g();
      return c.Ra ? ia(c.b) : 1
    };
    a.Yb = function(b, e) {
      if (N(b))b = "-"; else {
        e += c.h && "/" != c.h ? c.h : "";
        e = b.indexOf(e);
        b = e >= 0 && e <= 8 ? "0" : "[" == b.charAt(0) && "]" == b.charAt(b[x] - 1) ? "-" : b
      }
      return b
    };
    a.wa = function(b) {
      var e = "",o = c.a;
      e += c.fa ? a.A.Ic() : "";
      e += c.da ? a.Ua : "";
      e += c.ga && !N(o.title) ? "&utmdt=" + S(o.title) : "";
      e += "&utmhid=" + ja() + "&utmr=" + S(a.ia) + "&utmp=" + S(a.Bc(b));
      return e
    };
    a.Bc = function(b) {
      var e = c.a[A];
      return b = w != b && "" != b ? S(b, r) : S(e.pathname + e.search, r)
    };
    a.Lc = function(b) {
      if (a.J()) {
        var e = "";
        if (a.g != w && a.g.G()[x] > 0)e += "&utme=" + S(a.g.G());
        e += a.wa(b);
        j.H(e, a.s, a.c)
      }
    };
    a.Tb = function() {
      var b = new Z.$(c);
      return b.ua(a.c) ? b.Hc() : w
    };
    a._getLinkerUrl = function(b, e) {
      var o = b.split("#"),m = b,q = a.Tb();
      if (q)if (e && 1 >= o[x])m += "#" + q; else if (!e || 1 >= o[x])if (1 >= o[x])m += (U(b, "?") ? B : "?") + q; else m = o[0] + (U(b, "?") ? B : "?") + q + "#" + o[1];
      return m
    };
    a.Fc = function() {
      var b;
      if (a.wc()) {
        a.i.Dc(a.B);
        a.i.Oc();
        Z._gasoDomain = c.b;
        Z._gasoCPath =
        c.h;
        b = c.a.createElement("script");
        b.type = "text/javascript";
        b.id = "_gasojs";
        b.src = "https://www.google.com/analytics/reporting/overlay_js?gaso=" + a.B + B + Y();
        c.a.getElementsByTagName("head")[0].appendChild(b)
      }
    };
    a.pc = function() {
      var b = a.r,e = a.i,o = e.k(),m = a.c + "",q = c.e,u = q ? q.gaGlobal : w,z,M = U(o, D + m + "."),la = U(o, E + m),ma = U(o, G + m),F,I = [],R = "",ha = v;
      o = N(o) ? "" : o;
      if (c.z) {
        z = c.a[A] && c.a[A].hash ? c.a[A].href.substring(c.a[A].href.indexOf("#")) : "";
        if (c.ba && !N(z))R = z + B;
        R += c.a[A].search;
        if (!N(R) && U(R, D)) {
          e.zc(R);
          e.kb() || e.Sb();
          F = e.ja()
        }
        h(e.ma, e.vb, e.Eb, true);
        h(e.la, e.Aa, e.Fa)
      }
      if (N(F))if (M)if (!la || !ma) {
        F = k(o, ";", b);
        a.F = r
      } else {
        F = P(o, D + m + ".", ";");
        I = X(P(o, E + m, ";"), ".")
      } else {
        F = ga([m,a.jc(),b,b,b,1], ".");
        ha = a.F = r
      } else if (N(e.C()) || N(e.ka())) {
        F = k(R, B, b);
        a.F = r
      } else {
        I = X(e.C(), ".");
        m = I[0]
      }
      F = F.split(".");
      if (q && u && u.dh == m && !c.o) {
        F[4] = u.sid ? u.sid : F[4];
        if (ha) {
          F[3] = u.sid ? u.sid : F[4];
          if (u.vid) {
            b = u.vid.split(".");
            F[1] = b[0];
            F[2] = b[1]
          }
        }
      }
      e.tb(F.join("."));
      I[0] = m;
      I[1] = I[1] ? I[1] : 0;
      I[2] = w != I[2] ? I[2] : c.Jc;
      I[3] = I[3] ? I[3] : F[4];
      e.ya(I.join("."));
      e.ub(m);
      N(e.lc()) || e.za(e.P());
      e.Cb();
      e.Ea();
      e.Db()
    };
    a.rc = function() {
      j = new Z.Kb(c)
    };
    a._initData = function() {
      var b;
      if (!n) {
        if (!a.A) {
          a.A = new Z.Fb(c);
          a.A.bc()
        }
        a.c = a.ec();
        a.i = new Z.$(c);
        a.g = new Z.N;
        s = new Z.Ib(c, a.c, a.i, a.g);
        a.rc()
      }
      if (p()) {
        a.pc();
        s.tc()
      }
      if (!n) {
        if (p()) {
          a.ia = a.Yb(a.ab, c.a.domain);
          if (c.da) {
            b = new Z.m(a.c, a.ia, a.r, c);
            a.Ua = b.cc(a.i, a.F)
          }
        }
        a.cb = new Z.N;
        n = r
      }
      Z.ib || a.sc()
    };
    a._visitCode = function() {
      a._initData();
      var b = P(a.i.k(), D + a.c + ".", ";");
      b = b.split(".");
      return b[x] < 4 ? "" : b[1]
    };
    a._cookiePathCopy = function(b) {
      a._initData();
      a.i && a.i.Nc(a.c, b)
    };
    a.sc = function() {
      var b = c.a[A].hash;
      if (b && 1 == b.indexOf("gaso="))b = P(b, "gaso=", B); else b = (b = c.e.name) && 0 <= b.indexOf("gaso=") ? P(b, "gaso=", B) : P(a.i.k(), L, ";");
      if (b[x] >= 10) {
        a.B = b;
        a.Fc()
      }
      Z.ib = r
    };
    a.J = function() {
      return a._visitCode() % 1E4 < c.U * 100
    };
    a.Gc = function() {
      var b,e,o = c.a.links;
      if (!c.lb) {
        b = c.a.domain;
        if ("www." == O(b, 0, 4))b = O(b, 4);
        c.t.push("." + b)
      }
      for (b = 0; b < o[x] && (c.ra == -1 || b < c.ra); b++) {
        e = o[b];
        if (d(e.host))if (!e.gatcOnclick) {
          e.gatcOnclick = e.onclick ? e.onclick : a.yc;
          e.onclick = function(m) {
            var q =
              !this.target || this.target == "_self" || this.target == "_top" || this.target == "_parent";
            q = q && !a.Rb(m);
            a.Mc(m, this, q);
            return q ? v : this.gatcOnclick ? this.gatcOnclick(m) : r
          }
        }
      }
    };
    a.yc = function() {
    };
    a._trackPageview = function(b) {
      if (p()) {
        a._initData();
        c.t && a.Gc();
        a.Lc(b);
        a.F = v
      }
    };
    a._trackTrans = function() {
      var b = a.c,e = [],o,m,q;
      a._initData();
      if (a.f && a.J()) {
        for (o = 0; o < a.f.Y[x]; o++) {
          m = a.f.Y[o];
          V(e, m.Ca());
          for (q = 0; q < m.R[x]; q++)V(e, m.R[q].Ca())
        }
        for (o = 0; o < e[x]; o++)j.H(e[o], a.s, b, r)
      }
    };
    a._setTrans = function() {
      var b = c.a,e,o,m;
      b = b.getElementById ?
          b.getElementById("utmtrans") : b.utmform && b.utmform.utmtrans ? b.utmform.utmtrans : w;
      a._initData();
      if (b && b.value) {
        a.f = new Z.n;
        m = b.value.split("UTM:");
        c.u = !c.u || "" == c.u ? "|" : c.u;
        for (b = 0; b < m[x]; b++) {
          m[b] = f(m[b]);
          e = m[b].split(c.u);
          for (o = 0; o < e[x]; o++)e[o] = f(e[o]);
          if ("T" == e[0])a._addTrans(e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8]); else"I" == e[0] && a._addItem(e[1], e[2], e[3], e[4], e[5], e[6])
        }
      }
    };
    a._addTrans = function(b, e, o, m, q, u, z, M) {
      a.f = a.f ? a.f : new Z.n;
      return a.f.Ob(b, e, o, m, q, u, z, M)
    };
    a._addItem = function(b, e, o, m, q, u) {
      var z;
      a.f = a.f ? a.f : new Z.n;
      (z = a.f.hb(b)) || (z = a._addTrans(b, "", "", "", "", "", "", ""));
      z.Nb(e, o, m, q, u)
    };
    a._setVar = function(b) {
      if (b && "" != b && t()) {
        a._initData();
        s.Ec(S(b));
        a.J() && j.H("&utmt=var", a.s, a.c)
      }
    };
    a._setCustomVar = function(b, e, o, m) {
      a._initData();
      return s.Cc(b, e, o, m)
    };
    a._deleteCustomVar = function(b) {
      a._initData();
      s.Ub(b)
    };
    a._getVisitorCustomVar = function(b) {
      a._initData();
      return s.mc(b)
    };
    a._setMaxCustomVariables = function(b) {
      c.ob = b
    };
    a._link = function(b, e) {
      if (c.z && b) {
        a._initData();
        c.a[A].href = a._getLinkerUrl(b,
          e)
      }
    };
    a._linkByPost = function(b, e) {
      if (c.z && b && b.action) {
        a._initData();
        b.action = a._getLinkerUrl(b.action, e)
      }
    };
    a._setXKey = function(b, e, o) {
      a.g._setKey(b, e, o)
    };
    a._setXValue = function(b, e, o) {
      a.g._setValue(b, e, o)
    };
    a._getXKey = function(b, e) {
      return a.g._getKey(b, e)
    };
    a._getXValue = function(b, e) {
      return a.g.getValue(b, e)
    };
    a._clearXKey = function(b) {
      a.g._clearKey(b)
    };
    a._clearXValue = function(b) {
      a.g._clearValue(b)
    };
    a._createXObj = function() {
      a._initData();
      return new Z.N
    };
    a._sendXEvent = function(b) {
      var e = "";
      a._initData();
      if (a.J()) {
        e += "&utmt=event&utme=" + S(a.g.Ac(b)) + a.wa();
        j.H(e, a.s, a.c, v, r)
      }
    };
    a._createEventTracker = function(b) {
      a._initData();
      return new Z.Jb(b, a)
    };
    a._trackEvent = function(b, e, o, m) {
      var q = a.cb;
      if (w != b && w != e && "" != b && "" != e) {
        q._clearKey(5);
        q._clearValue(5);
        (b = q._setKey(5, 1, b) && q._setKey(5, 2, e) && (w == o || q._setKey(5, 3, o)) && (w == m || q._setValue(5, 1, m))) && a._sendXEvent(q)
      } else b = v;
      return b
    };
    a.Mc = function(b, e, o) {
      a._initData();
      if (a.J()) {
        var m = new Z.N;
        m._setKey(6, 1, e.href);
        var q = o ? function() {
          a.db(b, e)
        } : w;
        j.H("&utmt=event&utme=" +
            S(m.G()) + a.wa(), a.s, a.c, v, r, q);
        if (o) {
          var u = this;
          c.e.setTimeout(function() {
            u.db(b, e)
          }, 500)
        }
      }
    };
    a.db = function(b, e) {
      if (!b)b = c.e.event;
      var o = r;
      if (e.gatcOnclick)o = e.gatcOnclick(b);
      if (o || typeof o == "undefined")if (!e.target || e.target == "_self")c.e[A] = e.href; else if (e.target == "_top")c.e.top.document[A] = e.href; else if (e.target == "_parent")c.e.parent.document[A] = e.href
    };
    a.Rb = function(b) {
      if (!b)b = c.e.event;
      var e = b.shiftKey || b.ctrlKey || b.altKey;
      if (!e)if (b.modifiers && c.e.Event)e = b.modifiers & c.e.Event.CONTROL_MASK ||
                                              b.modifiers & c.e.Event.SHIFT_MASK || b.modifiers & c.e.Event.ALT_MASK;
      return e
    };
    a.Pc = function() {
      return c
    };
    a._setDomainName = function(b) {
      c.b = b
    };
    a._addOrganic = function(b, e, o) {
      c.T.splice(o ? 0 : c.T.length, 0, new Z.Ha(b, e))
    };
    a._clearOrganic = function() {
      c.T = []
    };
    a._addIgnoredOrganic = function(b) {
      V(c.ta, b)
    };
    a._clearIgnoredOrganic = function() {
      c.ta = []
    };
    a._addIgnoredRef = function(b) {
      V(c.va, b)
    };
    a._clearIgnoredRef = function() {
      c.va = []
    };
    a._setAllowHash = function(b) {
      c.Ra = b ? 1 : 0
    };
    a._setCampaignTrack = function(b) {
      c.da = b ? 1 : 0
    };
    a._setClientInfo =
    function(b) {
      c.fa = b ? 1 : 0
    };
    a._getClientInfo = function() {
      return c.fa
    };
    a._setCookiePath = function(b) {
      c.h = b
    };
    a._setTransactionDelim = function(b) {
      c.u = b
    };
    a._setCookieTimeout = function(b) {
      a._setCampaignCookieTimeout(b * 1E3)
    };
    a._setCampaignCookieTimeout = function(b) {
      c.Ta = b
    };
    a._setDetectFlash = function(b) {
      c.ha = b ? 1 : 0
    };
    a._getDetectFlash = function() {
      return c.ha
    };
    a._setDetectTitle = function(b) {
      c.ga = b ? 1 : 0
    };
    a._getDetectTitle = function() {
      return c.ga
    };
    a._setLocalGifPath = function(b) {
      c.oa = b
    };
    a._getLocalGifPath = function() {
      return c.oa
    };
    a._setLocalServerMode = function() {
      c.I = 0
    };
    a._setRemoteServerMode = function() {
      c.I = 1
    };
    a._setLocalRemoteServerMode = function() {
      c.I = 2
    };
    a._getServiceMode = function() {
      return c.I
    };
    a._setSampleRate = function(b) {
      c.U = b
    };
    a._setSessionTimeout = function(b) {
      a._setSessionCookieTimeout(b * 1E3)
    };
    a._setSessionCookieTimeout = function(b) {
      c.sb = b
    };
    a._setAllowLinker = function(b) {
      c.z = b ? 1 : 0
    };
    a._setAllowAnchor = function(b) {
      c.ba = b ? 1 : 0
    };
    a._setCampNameKey = function(b) {
      c.Ia = b
    };
    a._setCampContentKey = function(b) {
      c.Ja = b
    };
    a._setCampIdKey = function(b) {
      c.Ka =
      b
    };
    a._setCampMediumKey = function(b) {
      c.La = b
    };
    a._setCampNOKey = function(b) {
      c.Ma = b
    };
    a._setCampSourceKey = function(b) {
      c.Na = b
    };
    a._setCampTermKey = function(b) {
      c.Oa = b
    };
    a._setCampCIdKey = function(b) {
      c.Pa = b
    };
    a._getAccount = function() {
      return a.s
    };
    a._setAccount = function(b) {
      a.s = b
    };
    a._setNamespace = function(b) {
      c.o = b ? S(b) : w
    };
    a._getVersion = function() {
      return ca
    };
    a._setAutoTrackOutbound = function(b) {
      c.t = [];
      if (b)c.t = b
    };
    a._setTrackOutboundSubdomains = function(b) {
      c.lb = b
    };
    a._setHrefExamineLimit = function(b) {
      c.ra = b
    };
    a._setReferrerOverride =
    function(b) {
      a.ab = b
    };
    a._setCookiePersistence = function(b) {
      a._setVisitorCookieTimeout(b)
    };
    a._setVisitorCookieTimeout = function(b) {
      c.v = b
    }
  };
  Z._getTracker = function(i, l) {
    return new Z.aa(i, l)
  };
  var ka = v,$ = {ca:{},_createAsyncTracker:function(i, l) {
    l = l || "";
    i = new Z.aa(i);
    $.ca[l] = i;
    ka = r;
    return i
  },_getAsyncTracker:function(i) {
    i = i || "";
    var l = $.ca[i];
    if (!l) {
      l = new Z.aa;
      $.ca[i] = l;
      ka = r
    }
    return l
  },push:function() {
    for (var i = arguments,l = 0,g = 0; g < i[x]; g++)try {
      if (typeof i[g] === "function")i[g](); else {
        var t = "",k = i[g][0],p = k.lastIndexOf(".");
        if (p > 0) {
          t = O(k, 0, p);
          k = O(k, p + 1)
        }
        var f = $._getAsyncTracker(t);
        f[k].apply(f, i[g].slice(1))
      }
    } catch(h) {
      l++
    }
    return l
  }};
  window[aa] = Z;
  function na() {
    var i = window[ba],l = v;
    if (i && typeof i.push == "function") {
      l = i.constructor == Array;
      if (!l)return
    }
    window[ba] = $;
    l && $.push.apply($, i)
  }

  na();
})()
function GoogleAnalytics(accountId) {
  var self = {};
  var hasNetConnection = false;
  var trackings = [];


  self.trackPageview = function(pageName) {
    Mojo.Log.info("GoogleAnalytics#trackPageView(%s) on %s", pageName, self.accountId);
    trackOrSaveForWhenThereIsAConnection(['_trackPageview', pageName]);
  };

  self.setAccountId = function(accountId) {
    Mojo.Log.info("GoogleAnalytics#setAccountId(%s)", accountId);
    self.accountId = accountId;
    trackOrSaveForWhenThereIsAConnection(['_setAccount', self.accountId]);
    trackOrSaveForWhenThereIsAConnection(['_trackPageview', '/']);
  }

  self.trackEvent = function() {
    Mojo.Log.info("GoogleAnalytics#trackEvent");
    var event = ['_trackEvent'];
    event.push.apply(event, arguments);
    trackOrSaveForWhenThereIsAConnection(event)

    ensureArugment(arguments[2], 'label', 'string');
    ensureArugment(arguments[3], 'value', 'number');
  };

  self.setInternetConnection = function(value) {
    Mojo.Log.info("GoogleAnalytics#setInternetConnection(%s)", value);
    hasNetConnection = value;

    if (hasNetConnection && trackings.length > 0) {
      trackings.forEach(function(tracking) {
                           Mojo.Log.info("GoogleAnalytics#setInternetConnection: FLUSHED ITEM [%s, %s]", tracking[0], tracking[1]);
                          _gaq.push(tracking);
                       });
    }
  };

  self.hasInternetConnection = function() {
    return hasNetConnection;
  };

  return self;

  function trackOrSaveForWhenThereIsAConnection(item) {
    if (hasNetConnection) {
      Mojo.Log.info("GoogleAnalytics#trackOrSaveForWhenThereIsAConnection: PUSHED ITEM [%s, %s]", item[0], item[1]);
      _gaq.push(item);
    } else {
      Mojo.Log.info("GoogleAnalytics#trackOrSaveForWhenThereIsAConnection: INTERNET BROKEN");
      trackings.push(item);
    }
  }

  function ensureArugment(arg, name, type) {
    if (arg != undefined && typeof arg != type) {
      console.error('GoogleAnalytics#trackEvent: '+ name + ' must be a ' + type + ' - event will not be tracked')
    }
  }

}
function AppMetrics(accountId, depot) {
  var self = {};
  var googleAnalytics = new GoogleAnalytics(accountId);

  self.setInternetConnection = function(status) {
    googleAnalytics.setInternetConnection(status);
  };

  self.setAccountId = function(accountId) {
    googleAnalytics.setAccountId(accountId);
  };

  self.trackEvent = function() {
    googleAnalytics.trackEvent.apply(googleAnalytics, arguments);
  };

  self.trackLaunch = function(appVersion) {
    googleAnalytics.trackEvent('Launch', 'Version', appVersion);
  };

  self.trackNewScene = function(sceneName) {
    googleAnalytics.trackPageview(sceneName);
  };

  self.trackRegistration = function(appVersion) {
    if (!depot) {
      return;
    }
    
    depot.get(AppMetrics.registrationKey, trackIfNotRegistered, track);

    function trackIfNotRegistered(registeredVersion) {
      if (registeredVersion != appVersion) {
        track();
      }
    }

    function track() {
      self.trackEvent('Registration', appVersion);
      depot.add(AppMetrics.registrationKey, appVersion, doNothing, doNothing);
    }

  };

  return self;

  function doNothing() {}
}

AppMetrics.registrationKey = 'AppMetrics__Registration';
/* Copyright 2009 Palm, Inc.  All rights reserved. */

var AppAssistant = Class.create({
	
	_name: 'findapps',
	
	initialize: function()
	{
		Mojo.Log.info("AppAssistant::initialize");
	    Weave.Services.ConnectionManager.monitor();
		Weave.Services.ConnectionManager.getDataService();
    this.depot = new Mojo.Depot({ name: Mojo.appInfo.id, version: 1, replace: false});
    this.appMetrics = new AppMetrics(null, this.depot);
	},
	
 // adding google analytics specific objects
  setupGoogleAnalytics: function(gaAccount) {
    var self = this;
    this.appMetrics.setAccountId(gaAccount);
    // google analytics connection status setup
    Weave.Services.ConnectionManager.getStatus(function(online) {
                                                 self.appMetrics.setInternetConnection(online);
                                              });
    this.appMetrics.trackLaunch(Mojo.appInfo.version);
    this.appMetrics.trackRegistration(Mojo.appInfo.version);
  },

	setup: function()
	{
		Mojo.Log.info("AppAssistant::setup");

		
		var self = this;		
    // getting Google Analytics Property ID from App Catalog Server
    Weave.Services.AccountServices.getGoogleAnalyticsWebPropertyID(function(success, accountId) {
                                                  Mojo.Log.info("Google Analytics API RESPONSE: "+success+" value is: "+accountId);
                                                  self.setupGoogleAnalytics(accountId);
                                                });

		Weave.System.Activator.addInterface('main',
		{
			_defaultStage: "default",
			
			init: function(target)
			{
				var me = this;
				Weave.System.Activator.open(this._defaultStage, "DefaultStageAssistant", function(stage)
				{
					me.start(stage, me._defaultStage);
				});
			},
			
			start: function(stage, stageName)
			{
				Mojo.Log.info("AppAssistant(main) start");
				if (!TermsOfUse.isAccepted())
				{
					stage.controller.pushScene('terms', function(accepted)
					{
						if (accepted) 
						{
							stage._gotoMain();
						}
						else 
						{
							Weave.System.Activator.close(stageName);
						}
					});
				}
				else
				{
					stage._gotoMain();
				}
				//stage.controller.activate();
				
				// is this needed?
				// Delay starting up to try to let the card come up a bit faster
				/*(function()
				{
					stage._gotoMain();
					stage.controller.activate();
				}).delay(1);
				*/
			}
		});
		
		Weave.System.Activator.addInterface('myapps',
		{
			_defaultStage: "default",
			
			init: function(target)
			{
				var me = this;
				Weave.System.Activator.open(this._defaultStage, "DefaultStageAssistant", function(stage)
				{
					me.start(stage, me._defaultStage);
				});
			},
			
			start: function(stage, stageName)
			{
				Mojo.Log.info("AppAssistant(myapps) start");
				
				var top = stage.controller.topScene();
				if (!top || top.sceneName != "myapps") 
				{
					stage.controller.pushScene('myapps');	
				}
				//stage.controller.activate();
			}
		});
		
		Weave.System.Activator.addInterface('target',
		{
			_defaultStage: "default",
			_webDistributedStage: "webDistributed",
			
			// perform any initialization determine which stage to open
			init: function(target)
			{
				Mojo.Log.info("AppAssistant(target).init target %s", target);
				
				// promo code parse from target url firstly
				var promoCode = self._parsePromoCode(target);
				if(!promoCode || promoCode=="") { // if promo code not exists, parse appid or packageid as original
					Mojo.Log.info("Not promo");
					
					var ids = self._findAppAndPackageId(target);
					
					// call server to find out the type of this application
					var appDetails = new AppDetails(ids.applicationId, ids.packageId);
					appDetails.attach(this);
					appDetails.getDetailsFromServer();
				} else { // promo code exists, go on
					Mojo.Log.info("promo. Check network online status firstly to avoid _callServer on offline track.[NOV-122941]");
					var me = this;
					Weave.Services.ConnectionManager.getStatus(function(online){
                    	if(online) {
                    		Mojo.Log.info("AppAssistant.target_promo.init# online, _handlePromo.");
                    		self._handlePromo(promoCode, me);
                    	}
                    	else {
                    		Mojo.Log.info("AppAssistant.target_promo.init# offline, gotoMain for show default error!");
                    		Weave.System.Activator.open(
                				"default", 
                				"DefaultStageAssistant", 
                				function(stage) {
                					stage._gotoMain();
                				}
                    		);
//            				Utilities.Errors.displayError("failure", null, "offline");
                    	}
                    });
				}
				
			},
			
			updateDetails: function(app)
			{
				var stageName = this._defaultStage;
				var stageAssistantName = "DefaultStageAssistant";
				
				var programType = app.getProgramType();
				Mojo.Log.info("AppAssistant(target).updateDetails programType %s", programType);
				
				// figure out which stage to push
				if (programType && (programType == "W" || programType == "B"))
				{
					stageName = this._webDistributedStage + (new Date()).getTime();
					stageAssistantName = "WebDistributedStageAssistant"
				}
				
				var me = this;				
				Weave.System.Activator.open(stageName, stageAssistantName, function(stage)
				{
					me.target(app, stage, stageName);
				})
			},
			
			target: function(app, stage, stageName)
			{
				Mojo.Log.info("AppAssistant(target).target id:%j", app._packageid);
				app.detach(this);
				
				if (!TermsOfUse.isAccepted())
				{
					stage.controller.pushScene('terms', function(accepted)
					{
						if (accepted) 
						{
							stage.controller.swapScene('details', null, null, app);
						}
						else 
						{
							Weave.System.Activator.close(stageName);
						}
					});
				}
				else
				{
					stage.controller.pushScene('details', null, null, app);
				}
				//stage.controller.activate();
			}
		});

                Weave.System.Activator.addInterface('common',
                {
                        _defaultStage: "default",
                        _webDistributedStage: "webDistributed",

                        // perform any initialization determine which stage to open
                        init: function(params)
                        {
                                Mojo.Log.info("AppAssistant(target).init params %j, %s ", params, params.sceneType);

                                this.sceneType = params.sceneType;

                                if (this.sceneType != "search") {
                                        var id = params.id;
                                        // call server to find out the type of this application
                                        var appDetails = new AppDetails("", id);
                                        appDetails.attach(this);
                                        appDetails.getDetailsFromServer();
                                }
                                else{
                                        this.showSearch(params);
                                }
                        },

                        //support cross launching to search scene
                        showSearch: function(args)
                        {
                                Mojo.Log.info("AppAssistant showSearch %s", args.search);
                                var self               = this,
                                    passedParams       = args.params,
                                    stageName          = this._defaultStage,
                                    stageAssistantName = "DefaultStageAssistant";

                                Weave.System.Activator.open(stageName, stageAssistantName, function(stage)
                                {
                                        self.pushScene(stage, self.sceneType, passedParams);
                                });
                        },

                        /*
                         * pushes the scene with given params. Check whether terms are accepted.
                         * otherwise first pushes term scene
                         */
                        pushScene: function(stage, sceneType, params){
                                if (!TermsOfUse.isAccepted())
                                        {
                                                stage.controller.pushScene('terms', function(accepted)
                                                {
                                                        if (accepted)
                                                        {
                                                                stage.controller.swapScene(sceneType, params);
                                                        }
                                                        else
                                                        {
                                                                Weave.System.Activator.close(stageName);
                                                        }
                                                });
                                        }
                                        else
                                        {
                                                stage.controller.pushScene(sceneType, params);
                                        }
                        },

                        //support cross launching to details, review or inapproprite scene
                        updateDetails: function(app)
                        {
                                var stageName = this._defaultStage;
                                var stageAssistantName = "DefaultStageAssistant";

                                var programType = app.getProgramType();
                                Mojo.Log.info("AppAssistant(target).updateDetails programType %s", programType);

                                // figure out which stage to push
                                if (programType && (programType == "W" || programType == "B"))
                                {
                                        stageName = this._webDistributedStage + (new Date()).getTime();
                                        stageAssistantName = "WebDistributedStageAssistant"
                                }

                                var me = this;
                                Weave.System.Activator.open(stageName, stageAssistantName, function(stage)
                                {
                                        me.target(app, stage, stageName);
                                })
                        },

                        target: function(app, stage, stageName)
                        {
                                Mojo.Log.info("AppAssistant(target).target id:%j", app._packageid);
                                app.detach(this);
                                this.pushScene(stage, this.sceneType, app);
                        }
                });
	},

	
	cleanup: function()
	{
		Mojo.Log.info("AppAssistant.cleanup");
		if (Catalog && Catalog.AppDownloadMngr)
			Catalog.AppDownloadMngr.cleanup();
			
		Weave.Services.ConnectionManager.cleanup();
	},
	
	handleLaunch: function(params)
    {
		Mojo.Log.info("AppAssistant::handleLaunch params *%j*", params);
		var processedParams = this._processParams(params);
		
		Weave.System.Activator.run(params);
    },
	
	_processParams: function(params){
		var processedParams = {};
		if (!params || params == "") 
			processedParams = {
				main: ""
			};
		else {
			for (var k in params) {
				Mojo.Log.info("AppAssistant::params[%s]", k);
				if (k.charAt(0) !== '$') {
					processedParams[k] = params[k];
				}
			}
			if(Utilities.Common.isEmpty(processedParams)){
				processedParams = {
					main: ""
				};
			}
		}
		Mojo.Log.info("AppAssistant::_processedParams %j", processedParams);
		return processedParams;
	},
	
	_findAppAndPackageId: function(target)
	{
		Mojo.Log.info("AppAssistant::_findAppAndPackageId target", target);
		var matches = /[?&]packageid=([^&]*)(?:&applicationid=(\d*)){0,1}/.exec(target);
		return matches ? { packageId: matches[1], applicationId: matches[2] } : {};
	},
	
	/*** promo code support */
	// Get promo code from target url, exp:
	// 	url - "http://developer.palm.com/appredirect/?promocode=ABCXYZ"
	// 	promocode - "ABCXYZ" 
	_parsePromoCode: function(target) {
		var promoCode = "";
		var matches = /[?&]promocode=([^&]*){0,1}/.exec(target);
		promoCode = matches ? matches[1] : "";
		
		return promoCode;
	},
	
	// launch appropriate page based on the promo code type
	// save promo code into database
	_handlePromo: function(promoCode, context) {
		Mojo.Log.info("_handlePromo, promoCode:%s", promoCode);
		
		var self = this;
		Weave.Services.PaymentServer.getCodeInfos(promoCode, function(status, response) {
			Mojo.Log.info("AppAsistant._handlePromo.getCodeInfos# status[%s], response[%j]", status, response);
			var promoInfo = {};
			if(status) {
				var outGetCodeInfos = response.OutGetPromoCodeInfos;
				promoInfo.callbackStatus = true;
				promoInfo.status = outGetCodeInfos.status;
				promoInfo.campaignStatus = outGetCodeInfos.campaignStatus;
				promoInfo.validTo = outGetCodeInfos.validTo;
				promoInfo.type = outGetCodeInfos.campaignType;		// should be GP/A*
				var isValidType = false;
				if(promoInfo.type == "GP") {
					Mojo.Log.info("_handlePromo, GP, go to main!");
					promoInfo.amount = outGetCodeInfos.amount;
					isValidType = true;
					// get into main page
					Weave.System.Activator.open(
							"default", 
							"DefaultStageAssistant", 
							function(stage) {
								if (!TermsOfUse.isAccepted()) {
									stage.controller.pushScene('terms', function(accepted) {
										if (accepted) {
											stage._gotoMain(promoInfo);
										}
										else {
											Weave.System.Activator.close("default");
										}
									});
								}
								else {
									stage._gotoMain(promoInfo);
								}
							}
					);
				}
				else if(promoInfo.type == "AP" || 
						promoInfo.type == "AJ" || 
						promoInfo.type == "AD") {
					promoInfo.publicApplicationId = outGetCodeInfos.items[0].id;
					Mojo.Log.info("_handlePromo, A*, ptype:%s, paid:%s", 
							promoInfo.type, promoInfo.publicApplicationId);
					isValidType = true;
					// get into app detail page
					var appDetails = new AppDetails("", promoInfo.publicApplicationId);
					appDetails.setPromoInfo(promoInfo);
					appDetails.attach(context);
					appDetails.getDetailsFromServer();
				}
				else {
					Mojo.Log.error("_handlePromo, invalid promotype:%s", promoInfo.prototype);
				}
				
				var promoCode4Store = "";
				if(isValidType && promoInfo.campaignStatus=="A" && promoInfo.status=="A") {
					// Save promo code to depot for promo code view retrieve
					self._savePromoToDB(promoCode, promoInfo.type);
					promoCode4Store = promoCode;
				}
				// Save promo code to cookie for synchronized retrieve when 
				// display the promo tag on download button
				var cookiePC = new Mojo.Model.Cookie("PromoCode");
				cookiePC.put(promoCode4Store);
				Mojo.Log.info("AppAssistant, promocode cookie store:[%s]", promoCode4Store);
			}
			else {
				Mojo.Log.error("getCodeInfos from server fail, status:%s, response:%j", status, response);
				promoInfo.callbackStatus = false;
//				Weave.System.Activator.open(
//						"default", 
//						"DefaultStageAssistant", 
//						function(stage) {
//							stage._gotoMain(promoInfo);
//						}
//				);
////				Utilities.Errors.displayPromoErrorDialog();
				var err = response.errorCode ? response.errorCode : response;
				Mojo.Log.info("AppAssistant._handlePromo# err:[%j]", err);
				Utilities.Errors.displayError(err, {errCode: err}, "PMT_catchAll");

			}
		});
		
	},
	
	// Save promo code into on-device database
	_savePromoToDB: function(promoCode, promoType) {
		var self = this;
		
		if(!self._promoDB) {
			self._promoDB = new Mojo.Depot({
				name:"promoDB", version:1, estimatedSize: 500, replace: false},
				function() {
					Mojo.Log.info("PromoDB load/create done!");
				},
				function(result) {
					Mojo.Log.error("PromoDB load/create failed: ", result);
				}
			);
		}
		
		self._promoDB.add("promoCode", promoCode,
				function() { 
					Mojo.Log.info("promoDB code save done, promocode:%s, promotype:%s", promoCode, promoType);
					self.getPromoFromDBExt(function(promocode){
						Mojo.Log.info("promoDB code get done, promocode:%s", promoCode);
					});
				},
				function(result) { 
					Mojo.Log.error("promoDB code save fail: ", result); 
				}
		);
	},
	
	// Get promo code from on-device database: 'promoDB'
	// callback: function(promocode)
	getPromoFromDBExt: function(callback) {
		var self = this;
		
		self._promoDB.get("promoCode", 
				function(pc) { 
					callback(pc)
					Mojo.Log.info("promoDB code get done, pc:%s", pc);
				},
				function(result) { 
					Mojo.Log.error("promoDB code get fail: ", result); 
				}
		);
	}
	/*** promo code support end */
});

var DefaultStageAssistant = Class.create(
{	
	setup: function()
	{
		// Default AppMenu
		var self = this;
		var menu = new Weave.Utilities.AppMenu()
			.addEdit()
			.addPreferencesAndAcc(self.controller)
                        .addSoftwareManager()
			.addHelp('http://help.palm.com/app_catalog/index.html');
		Weave.Utilities.AppMenu.setDefault(menu);
		Weave.Utilities.AppMenu.enablePref(menu);
	},
	
	_gotoMain: function(promoInfo)
	{
		Mojo.Log.info("_gotoMain, promoInfo:%j", promoInfo);
		var mainSceneExists = false;
		var mainScene;
		var sceneStack = this.controller.getScenes();
		if (sceneStack) 
		{
			for (var index = sceneStack.size()-1; index >= 0; index--) 
			{
				var scene = sceneStack[index];
				if (scene.sceneName == "main") 
				{
					Mojo.Log.info("got main scene");
					mainSceneExists = true;
					mainScene = scene;	// hold the main scene in stack for further promo pop up 
					break;
				}
			}
		}
			
		// If we're on the main screen, stay there, otherwise pop all the scenes to main
		var top = this.controller.topScene();
		if (top && top.sceneName != "main") 
		{
			Mojo.Log.info("pop scene to main");
			this.controller.popScenesTo("main");
		}
		
		if (!mainSceneExists) {
			Mojo.Log.info("AppAssistant._gotoMain# main page not in stack, push into stack");
			// Invoke from promo code links
			if(promoInfo) { // push main scene with promoInfo params for show pop up dialog in MainAssistant's setup()
				this.controller.pushScene({name: "main", disableSceneScroller: true}, 
						{callbackStatus: promoInfo.callbackStatus, 
						status: promoInfo.status, 
						campaignStatus: promoInfo.campaignStatus, 
						promoExpiredDate: promoInfo.validTo, 
						promoAmount: promoInfo.amount});
			}
			else {
				this.controller.pushScene({name: "main", disableSceneScroller: true});
			}
		}
		else {
			Mojo.Log.info("AppAssistant._gotoMain# main page already in stack and have pop to top");
			if(promoInfo) { // show pop up dialog on top(main)
				Mojo.Log.info("main already there, plan to show promo popup, stageController.activeScene().sceneName:%s", 
						this.controller.activeScene().sceneName);
				
				if(promoInfo.callbackStatus) {
					if(promoInfo.campaignStatus=="A" && promoInfo.status=="A") {
						var stageController = this.controller;
						mainScene.showAlertDialog({
							onChoose: function(value) {
								// set the promoExpiredDate on MainAssistant for further show promo tag in detail page
								stageController.delegateToSceneAssistant("_markPromoInfo", promoInfo);
							},
							title: "Promo Code",
							message: $L('You can download one app for free up to $#{promoAmount} until #{promoExpiredDate}.').interpolate({
								promoAmount: promoInfo.amount, 
								promoExpiredDate: Utilities.Common.formatDateStr(promoInfo.validTo)}),
								choices: [{label: "OK", value: "ok"}]
						});
					}
					else {
						Utilities.Errors.displayPromoErrorDialog(mainScene, "invalid");
					}
				}
				else {
					Utilities.Errors.displayPromoErrorDialog(mainScene, "fail");
				}
			}
		}
	}
});

var WebDistributedStageAssistant = Class.create(
{	
	setup: function()
	{
		// Default AppMenu
		var self = this;
		var menu = new Weave.Utilities.AppMenu()
			.addEdit()
			.addPreferencesAndAcc(self.controller)
			.addHelp('http://help.palm.com/app_catalog/index.html');
		Weave.Utilities.AppMenu.setDefault(menu);
		Weave.Utilities.AppMenu.enablePref(menu);
	},
	
	/**********************************************
    * Global data
    ***********************************************/
	
	embargoedCounrtyList: undefined
});
/* Copyright 2009 Palm, Inc.  All rights reserved. */

var MainAssistant = Class.create(
{
	initialize : function(params)
	{
		Mojo.Log.info("MainAssistant.initialize");
		if(params) {
			Mojo.Log.info("MainAssistant.initialize with params, promoExpiredDate:%s, promoAmount:%s", 
					params.promoExpiredDate, params.promoAmount);
            // Promo 
			this.promoCallbackStatus=params.callbackStatus;
			this.promoStatus = params.status;
			this.promoCampaignStatus=params.campaignStatus;
			if(this.promoCampaignStatus=="A" && this.promoStatus=="A") {
				this.promoExpiredDate = params.promoExpiredDate;
				this.promoAmount = params.promoAmount;
			}
			this.promoLaunchError = params.promoLaunchError;
		}

                this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;

                this._searchTermCookie = new Mojo.Model.Cookie("com.palm.app.findapps.searchTerm");

                this._sort  = 'RATING_DESC';
		this._query = '';
                this._queryFragment = '';
                this._qid = 'Blowfish2Query1';
                this._connectors = '';
		this._installedApps = {};
                this._commandMenuReady = false;
                this._justTypeTimer = null;
                this._searchInProgress = false;

		this.searchFieldModel = {
                    'original': ''
		};

                this._scrollerInfo = {
                    position: 0,
                    minScrollPositionOfInterest: 0, //top of list
                    maxScrollPositionOfInterest: -130,
                    customHeight: (Mojo.Environment.DeviceInfo.screenHeight - 135) + 'px'
                };

                this._featureTileInfo = {
                    minDivHeight: 0,
                    maxDivHeight: 115,
                    containerDiv: null,
                    tiles: [],
                    active: true
                };

                //Category setup
                this._appCategoriesHelper = new Weave.Utilities.AppCategoriesHelper();
                this._categoryInfo = this._appCategoriesHelper.categoryInfo;
                this._appCategoriesHelper.updateCategorySelector(); //Fill this._categoryInfo.items
                this._categorySelectorFadeStatus = 0;
	},

	setup: function()
	{
		Mojo.Log.info("MainAssistant.setup");
    // Google Analytics
    this.appMetrics.trackNewScene("main");

                this._searchItemsCallback = this._searchItemsCallback.bind(this);
		this._gotoApp = this._gotoApp.bindAsEventListener(this);
		this._searchAppsKey = this._searchAppsKey.bindAsEventListener(this);
		this._searchApps = this._searchApps.bindAsEventListener(this);
                this._openFeatureTile = this._openFeatureTile.bind(this);

		// Set up the attributes & prepare this widget for lazy loading of data
		this._searchListAttr =
		{
			itemTemplate: 'main/main-appsummary',
			dividerTemplate: 'main/main-appdivider',
			itemsCallback: this._searchItemsCallback.bind(this),
			formatters: {
				dummy: this._formatAppSummary.bind(this)
			},
			onItemRendered: this._renderedAppSummary.bind(this),

			// These values have been set after a lot of experimentation
			// with the list scrolling performance. Since list is loading
			// more items as user scrolls it is critical to get these numbers
			// right. Don't change before carefully reevaluating scrolling perf.
			// also update this.listRerenderCount
			renderLimit: 40,
			lookahead: 50,
			scrollThreshold: 600
		};

		this.listRerenderCount = 140; // 2*lookahead + renderLimit

		// setup search field
		this.searchFieldModel.attributes = {
                        hintText: $L(" Search App Catalog..."),
	  		enterSubmits: true,
                        focus: true,
			multiline: false,
			modelProperty: 'original',
			modifierState: Mojo.Widget.steModeSentenceCase,
			focusMode: Mojo.Widget.focusSelectMode,
			autoReplace: false,
			requiresEnterKey: true,
			changeOnKeyPress: true
                };
                this.controller.setupWidget(
			'in-fa-search-text',
			this.searchFieldModel.attributes,
			this.searchFieldModel
		);

                //Searchbar
		this._appsSearch =
		{
			widget: this.controller.get('in-fa-search-text'),
                        barText: this.controller.get('app-search-bar-text'),
                        barIcon: this.controller.get('app-search-bar-icon'),
			button: this.controller.get('searchResultsModified'),
                        inactiveSearchBar: this.controller.get("app-search-bar-inactive"),
                        activeSearchBar: this.controller.get("app-search-bar-active"),
                        searchScrim: this.controller.get("app-search-bar-scrim"),
                        inSearchMode: false
		};
                this._updateSearchBarIndicators();

                //Scroller
                this._scrollerModel = {
                    mode: 'vertical',
                    weight: 'light',
                    friction: 'low'
                };
                this.controller.setupWidget('applist-scroller', {}, this._scrollerModel);
                this._scroller = this.controller.get("applist-scroller");
                //Dynamically adjust custom scroller height based on available screen real estate
                //this._scroller.style.height = this._scrollerInfo.customHeight;
        		this.scalingFactor = this.controller.window.zoomFactor || 1;
        		this.scaledHeight = Math.floor(Mojo.Environment.DeviceInfo.screenHeight / this.scalingFactor)-135;
        		Mojo.Log.error("Scaled Height: " + this.scaledHeight);
        		this._scroller.style.height = this.scaledHeight+"px";

                this.controller.setupWidget(
			'dv-fa-appslist',
			this._searchListAttr,
			{}
		);
		this._appsListWidget = this.controller.get('dv-fa-appslist');
                this._appListDefaultMessage = this.controller.get('dv-fa-appslist-message-default');
                this._appListMessage = this.controller.get('dv-fa-appslist-message');

                //Featured Apps
                this._featureTileInfo.containerDiv = this.controller.get("featured-app-tiles");
                this._featureTileInfo.tiles[0] = {"tileNode": this.controller.get("feature_tile__0")};
                this._featureTileInfo.tiles[1] = {"tileNode": this.controller.get("feature_tile__1")};

		//Category Selector
                this._categorySelector = this.controller.get("categorySelector");
                this._categorySelectorPlacementAnchor = this.controller.get("categorySelectorPlacementAnchor");
                this._categorySelectorFade = this.controller.get("category-selector-fade");

                //Display feature tiles div if needed
                if (this._featureTileInfo.active === true) {
                    this._featureTileInfo.containerDiv.show();
                } else {
                    this._featureTileInfo.containerDiv.hide();
                }

                // Set up a command menu
                this._queryItems =
                {
                    items: QueryButtons.getQueryButtonsForCategory(this._categoryInfo.category),
                    toggleCmd: this._qid
                };

                this._queryMenu =
                {
                        visible: false, //wait to show until after we have verified the paid icon
                        items: [
                                {},
                                this._queryItems,
                                {}
                        ]
                };
                this.controller.setupWidget(Mojo.Menu.commandMenu, {}, this._queryMenu);

		// Menus
		Weave.Utilities.AppMenu.useDefault(this);

		this._spinner = new Spinner(this, 'spinner', true, 'large');

		// get notified when installed applications change
		Catalog.AppDownloadMngr.attach(this);
		
		// show promo pop up dialog
		if(this.promoCallbackStatus==true) {
			if(this.promoCampaignStatus=="A" && this.promoStatus=="A") {
				this.controller.showAlertDialog({
					title: "Promo Code",
					message: $L('You can download one app for free up to $#{promoAmount} until #{promoExpiredDate}.').interpolate({
						promoAmount: this.promoAmount, 
						promoExpiredDate: Utilities.Common.formatDateStr(this.promoExpiredDate)}),
						choices: [{label: "OK", value: "ok"}]
				});
			}
			else {
				Utilities.Errors.displayPromoErrorDialog(this.controller, "invalid");
			}
		}
		else if(this.promoCallbackStatus==false) {
			Utilities.Errors.displayPromoErrorDialog(this.controller, "fail");
		}
	},

	cleanup: function()
	{
		Catalog.AppDownloadMngr.detach(this);
	},

	activate: function()
	{
		Mojo.Log.info("MainAssistant.activate");

                this._doCustomSearch = this._doCustomSearch.bind(this);
                this._justTypeKeydownHandler = this._justTypeKeydownHandler.bind(this);

		this._appsListWidget.addEventListener(Mojo.Event.listTap, this._gotoApp);
		this._appsSearch.widget.addEventListener(Mojo.Event.propertyChange, this._searchAppsKey);
		this._appsSearch.button.addEventListener(Mojo.Event.tap, this._doCustomSearch);
                this._appsSearch.inactiveSearchBar.addEventListener(Mojo.Event.tap, this._showCustomSearchBar.bind(this));
                this._appsSearch.searchScrim.addEventListener(Mojo.Event.tap, this._hideCustomSearchBar.bind(this));
                this._categorySelector.addEventListener(Mojo.Event.tap, this._showCategoryPopup.bind(this));
                this.controller.sceneElement.addEventListener(Mojo.Event.keydown, this._justTypeKeydownHandler);

                //Applist Scroller Events
                // Bind response handler once here, instead of repeatedly in each listener
                this._scrollStarting = this._scrollStarting.bind(this);
                this.moved = this._scrollerMoved.bind(this);
                // Thrown when scroller starts or stops
                this._scroller.addEventListener(Mojo.Event.scrollStarting, this._scrollStarting.bind(this));

                //Feature tile event handlers
                this._featureTileInfo.tiles[0].tileNode.addEventListener(Mojo.Event.tap, this._openFeatureTile);
                this._featureTileInfo.tiles[1].tileNode.addEventListener(Mojo.Event.tap, this._openFeatureTile);

                //Grab cookie data so that we can restore most recent search term
                this._searchTermCookieData = this._searchTermCookie.get();

                //When returning from the search scene we need to pull down the scrim
                this._hideCustomSearchBar();
                
                if(this.promoLaunchError) {
        			Utilities.Errors.displayPromoErrorDialog(this.controller, "invalid");
        			this.promoLaunchError = false;
                }
	},

	deactivate: function()
	{
		Mojo.Log.info("MainAssistant.deactivate");

		this._appsListWidget.removeEventListener(Mojo.Event.listTap, this._gotoApp);
		this._appsSearch.widget.removeEventListener(Mojo.Event.propertyChange, this._searchAppsKey);
		this._appsSearch.button.removeEventListener(Mojo.Event.tap, this._searchApps);
                this._appsSearch.inactiveSearchBar.removeEventListener(Mojo.Event.tap, this._showCustomSearchBar);
                this._appsSearch.searchScrim.removeEventListener(Mojo.Event.tap, this._hideCustomSearchBar);
                this._categorySelector.removeEventListener(Mojo.Event.tap, this._showCategoryPopup);
                this._scroller.removeEventListener(Mojo.Event.scrollStarting, this._scrollStarting);
                this.controller.sceneElement.removeEventListener(Mojo.Event.keyup, this._justTypeKeydownHandler);

                this._featureTileInfo.tiles[0].tileNode.removeEventListener(Mojo.Event.tap, this._openFeatureTile);
                this._featureTileInfo.tiles[1].tileNode.removeEventListener(Mojo.Event.tap, this._openFeatureTile);
	},

        //Supports "Just Type"
        _justTypeKeydownHandler: function(event) {
            if (event.originalEvent.keyCode !== 27) {
                var self = this;

                if (this._justTypeTimer !== null) {
                    //Typing has started (resumed) clear out timer as needed
                    window.clearTimeout(self._justTypeTimer);
                }

                if (this._searchInProgress === false && this._appsSearch.inSearchMode === false) {
                    //User has started typing and custom search bar is not currently open
                    this._showCustomSearchBar(event, false);
                }

                //If backspacing and we've reached the end trigger close of the search bar
                if (event.originalEvent.keyCode === 8 && this._appsSearch.widget.mojo.getValue().length <= 1) {
                    //Pause for a moment before closing in case they just wanted to start over
                    this._justTypeTimer = window.setTimeout(function() {
                                                self._appsSearch.widget.mojo.blur();
                                                self._hideCustomSearchBar();
                                          }, 750);
                }
            }
        },

        _setupExtraSearchOptions: function()
        {
            Mojo.Log.info("_setupExtraSearchOptions");

            if (this._featureTileInfo.active === true) {
                this._featureTileInfo.containerDiv.show();
                this._categorySelector.show();
                this.scalingFactor = this.controller.window.zoomFactor || 1;
        		this.scaledHeight = Math.floor(Mojo.Environment.DeviceInfo.screenHeight / this.scalingFactor)-135;
        		Mojo.Log.error("Scaled Height: " + this.scaledHeight);
                this._scroller.style.height = this.scaledHeight+"px";
            } else {
                this._featureTileInfo.containerDiv.hide();
                this._categorySelector.show();
            }
        },

        _openFeatureTile: function(event) {
            Mojo.Log.info("_openFeatureTile: %s", event.currentTarget.id);

            var searchParams,
                selectedTileId            = parseInt(event.currentTarget.id.split("__")[1], 10),
                selectedTileType          = this._featureTileInfo.tiles[selectedTileId].tileType,
                selectedTileQueryFragment = this._featureTileInfo.tiles[selectedTileId].queryFragment,
                selectedTileLabel         = this._featureTileInfo.tiles[selectedTileId].label,
                selectedTileAppId         = this._featureTileInfo.tiles[selectedTileId].appId,
                selectedTilePublicAppId   = this._featureTileInfo.tiles[selectedTileId].publicApplicationId;

            if (selectedTileType === 'app') {
                this.controller.stageController.pushScene("details", selectedTileAppId, selectedTilePublicAppId, 
                		null,null, this.promoExpiredDate);
            } else if (selectedTileType === 'list') {
                searchParams = {
                    "type": "queryFragment",
                    "customListLabel": selectedTileLabel,
                    "search": selectedTileQueryFragment,
                    "featureTile": true,
                    "promoExpiredDate": this.promoExpiredDate
                };

                this.controller.stageController.pushScene({name: "search", disableSceneScroller: true}, searchParams);
            }
        },

        _doCustomSearch: function()
        {
            Mojo.Log.info("_doCustomSearch");

            var crtSearchTerm = this._appsSearch.widget.mojo.getValue(),
                searchParams = {
                    "type": "query",
                    "search": crtSearchTerm
                };

            this._searchTermCookie.put({ "latestSearchTerm":  crtSearchTerm });
            this.controller.stageController.pushScene({name: "search", transition: Mojo.Transition.none, disableSceneScroller: true}, searchParams);
        },

        _showCustomSearchBar: function(event, restorePreviousTerm)
        {
            Mojo.Log.info("_showCustomSearchBar");
            event.stopPropagation(); //needed for focus

            //Turn search on
            this._appsSearch.inSearchMode = true;

            //Restore previous search term
            if (this._searchTermCookieData  && (restorePreviousTerm !== false)) {
                if (this._searchTermCookieData.latestSearchTerm !== undefined) {
                    this._appsSearch.widget.mojo.setValue(this._searchTermCookieData.latestSearchTerm);
                }
            }

            //Activate search bar
            this._appsSearch.inactiveSearchBar.hide();
            this._appsSearch.activeSearchBar.show();
            this._appsSearch.searchScrim.show();
            this._appsSearch.widget.mojo.focus();
        },

        _hideCustomSearchBar: function()
        {
            Mojo.Log.info("_hideCustomSearchBar");

            //Prevent scrim from being dismissed during search
            if (this._searchInProgress === true) return;

            //Turn search off
            this._appsSearch.inSearchMode = false;

            //Deactivate search bar
            this._appsSearch.activeSearchBar.hide();
            this._appsSearch.inactiveSearchBar.show();
            this._appsSearch.searchScrim.hide();

            //Clear unsearched term.  Previous search will be restored later as needed.
            this._appsSearch.widget.mojo.setValue("");
            this._appsSearch.widget.mojo.blur();
        },

	handleCommand: function(event)
	{
		if (event.type === Mojo.Event.back) {
                    if (this._appsSearch.inSearchMode === true) {
                        //A back swipe with the search open reverts the search state
                        event.stop();
                        this._hideCustomSearchBar();
                        this._setupExtraSearchOptions();
                    } else if (this._categoryInfo.category !== null) {
                        //A back swipe when the category selector is open and home isn't selected
                        //reverts to home state
                        event.stop();
                        this._updateSearchBarIndicators();
                        this._popupCategorySelected('__home');
                    }
                } else if (event.type == Mojo.Event.command) {
        	// Google Analytics tracking Search bar labels
        	this.appMetrics.trackEvent(QueryButtons.getSearchBarLabelForQid(event.command));
			switch (event.command)
			{
				case 'Blowfish2Query1':
				case 'Blowfish2Query2':
				case 'Blowfish2Query3':
				case 'Blowfish2Query4':
				case 'Blowfish2Query5':
                                case 'Blowfish2Query6':
                                case 'Blowfish2Query7':
                                case 'Blowfish2Query8':
                                        //Sorted queries, except for those used on the search
                                        //scene, should not have these override params
                                        this._query = '';
                                        this._queryFragment = '';

					this._qid = event.command;
                                        this._updateSearchBarIndicators();
					this._searchApps();
					break;

				default:
					break;
			}
		}
	},

	// observer method for notifications from AppDownloadMngr
	// called when apps installed on the system change
	updateInstalledApps: function()
	{
		Mojo.Log.info("SearchAssistant.updateInstalledApps");
		if (this._appsListWidget && this._appsListWidget.mojo)
		{
			var range = this._appsListWidget.mojo.getLoadedItemRange();
			this._appsListWidget.mojo.noticeUpdatedItems(range.offset, this._appsListWidget.mojo.getItems(range.offset, range.limit));
		}
	},

	_getApplicationInstalledState: function(summary)
	{
		var app = Catalog.AppDownloadMngr.getInstalledApp(summary.publicApplicationId);
		if (app)
		{
			Mojo.Log.info("versions: installed %s download %s", app.installedVersion, summary.appVersion);
			if (Utilities.VersionCheck.compare(app.installedVersion, summary.appVersion) != -1)
			{
				return 'installed';
			}
			else
			{
				return 'update';
			}
		}
		return 'notinstalled';
	},

        _showCategoryPopup: function(event)
        {
            Mojo.Log.info('_showCategoryPopup');

            this.controller.popupSubmenu({
                onChoose:  this._popupCategorySelected.bind(this),
                placeNear: this._categorySelectorPlacementAnchor,
                items: this._categoryInfo.items,
                popupClass: 'category-popup',
                scrimClass: 'category-popup-scrim'
            });
        },

        _swapQueryButtons: function()
        {
            Mojo.Log.info("_swapQueryButtons");

            //We need to keep the same icon position selected while swapping buttons
            //but update the underlying qid & toggleCmd at the same time
            var newQid = QueryButtons.updateQidForCategory(this._categoryInfo.category, this._qid);

            this._qid = newQid;
            this._queryItems.items = QueryButtons.getQueryButtonsForCategory(this._categoryInfo.category);
            this._queryItems.toggleCmd = newQid;

            this.controller.modelChanged(this._queryMenu);
        },

        _updateQueryButton: function(position, pathToIcon, buttonCommand) {
            if (buttonCommand === undefined) {
                //modelChange requires us to set this again, but in most cases
                //we just want it to remain as is.
                buttonCommand = this._queryItems.items[position].command;
            }

            this._queryItems.items[position] = {
                iconPath: pathToIcon,
                command: buttonCommand
            }

            this.controller.modelChanged(this._queryMenu);
        },

        _popupCategorySelected: function(value)
        {
            Mojo.Log.info('_popupCategorySelected: updating categories');

            if (value !== undefined) {
                var catSelectorText,
                    catDetails       = value.split("__"),
                    isParentCategory = false;

                //Keep the prev cat before updating.  When subcat is selected the cat
                //list is refreshed with the parent just to updated the chosen value.
                this._categoryInfo.prevParentCategory = this._categoryInfo.category;
                this._categoryInfo.prevParentCategoryName = this._categoryInfo.name;

                //If the new cat selection matches the prev one used to search stop here.  No change.
                if (this._categoryInfo.categoryToSearch === catDetails[1]) return;

                this._categoryInfo.name = catDetails[0];
                this._categoryInfo.category = catDetails[1];
                catSelectorText = this._categoryInfo.name;
                isParentCategory = this._appCategoriesHelper.isParentCategory(this._categoryInfo.category);

                //The category value is manipulated in certain cases to properly display
                //parent/subcategory selections.  Thus we need to keep track of the actual
                //category selected for searches independent of the one used for category selector puposes.
                this._categoryInfo.categoryToSearch = catDetails[1];

                //Selecting Home while Home is already selected should be avoided
                if (this._categoryInfo.category === 'all' && this._categoryInfo.prevParentCategory === null)
                    return;

                this._swapQueryButtons();
                Mojo.Log.info('Selected category info, id: %s / name: %s', this._categoryInfo.category, this._categoryInfo.name);

                // Google Analytics
                this.appMetrics.trackEvent("category_selected", this._categoryInfo.name);

                if (this._categoryInfo.category === 'home') {
                    this._categoryInfo.prevParentCategory = null;
                    this._categoryInfo.category = null;
                    catSelectorText = this._categoryInfo.toplevelSelectorLabel;
                } else if (isParentCategory === true) {
                    //Parent category selected
                    this._categoryInfo.prevParentCategory = null;
                    //catSelectorText = $L('All ') + catSelectorText;
					catSelectorText = $L("All #{category}").interpolate({category: catSelectorText});
                } else {
                    //Sub-category selected
                }
                //Update the visual category indicators and refresh cat list as needed
                this._categorySelector.innerHTML = catSelectorText;

                if (this._categoryInfo.category === null || isParentCategory === true) {
                    //The category search bar is not refreshed during a sub-category selection
                    this._updateSearchBarIndicators();
                }

                this._appsSearch.widget.mojo.setValue(''); //Clear search condition before browsing
                this._searchApps();                
                this._appCategoriesHelper.updateCategorySelector();
            }
        },

        //Used to update the search bar text & icon when a new category or command menu item is selected
        _updateSearchBarIndicators: function() {
            var searchBarText;

            if (this._categoryInfo.category === null) {
                //For the "Home" (default) category we apply custom label which
                //correspond to the commandmenu (stored query) buttons
                searchBarText = QueryButtons.getSearchBarLabelForQid(this._qid);
            } else {
                searchBarText = this._categoryInfo.name;
            }

            this._appsSearch.barText.innerHTML = searchBarText;
            this._appsSearch.barIcon.src = this._appCategoriesHelper.getCategoryIconForSearchBar(this._categoryInfo.category);
        },

        /*
         * A scroller will package a scroller property and an addListener method onto the event that is passed here.
         * Note: event.scroller.addListener === event.addListener
         * the addListener functions accept an object with a .moved() method that gets passed
         * true or false while the scroller is moving, indicating whether or not the scroller has stopped yet.
         */
        _scrollStarting: function(event) {
                Mojo.Log.info("scrollStarting");

                event.scroller.addListener(this); //Pass 'this' as the object with the listener to the "move" method"
                Mojo.Log.info(new Date(), "scroll starting");
        },

        _scrollerMoved: function(stopping) {
                //Mojo.Log.info("_scrollerMoved");

                if (stopping) {
                    Mojo.Log.info("Scroller stopping");
                } else if (this._featureTileInfo.active === true && this._appsSearch.inSearchMode === false) {
                    this.doFeatureTileScroll();
                } else if (this._featureTileInfo.active === false) {
                    //We need to hide/show the top scroll fade.  This is done in
                    //doFeatureTileScroll when tiles are present.  When tiles are present
                    //then we handle here.
                    var crtTopScrollPos = this._scroller.mojo.getScrollPosition().top;

                    if (this._categorySelectorFadeStatus === 0 && crtTopScrollPos < 0) {
                        this._categorySelectorFadeStatus = 1;
                        this._categorySelectorFade.show();
                    } else if (this._categorySelectorFadeStatus === 1 && crtTopScrollPos === 0) {
                        this._categorySelectorFadeStatus = 0;
                        this._categorySelectorFade.hide();
                    }
                }
        },

        _setupFeatureTilesForCategory: function(tiles)
        {
            Mojo.Log.info("_setupFeatureTilesForCategory");

            if ((tiles !== undefined && tiles !== null) && tiles.length > 0) {
                Mojo.Log.info("_setupFeatureTilesForCategory");
                
                for (var i=0; i<2; i++) { //Two tile limit
                    //Replace tile image
                    this._featureTileInfo.tiles[i].tileNode.src = tiles[i].imageUrl;

                    //Store/update tile info so we know how to respond to future onTap events
                    this._featureTileInfo.tiles[i].tileType            = tiles[i].type || '';
                    this._featureTileInfo.tiles[i].imageUrl            = tiles[i].imageUrl || '';
                    this._featureTileInfo.tiles[i].queryFragment       = tiles[i].queryFragment || '';
                    this._featureTileInfo.tiles[i].appId               = tiles[i].appId || '';
                    this._featureTileInfo.tiles[i].publicApplicationId = tiles[i].publicApplicationId || '';
                    this._featureTileInfo.tiles[i].label               = tiles[i].label || '';
                }

                //Display fully expanded tiles
                this._featureTileInfo.containerDiv.style.height = this._featureTileInfo.maxDivHeight + 'px';
                this._featureTileInfo.containerDiv.show();
                this._featureTileInfo.active = true;
            } else {
                this._featureTileInfo.containerDiv.hide(); //This category has no tiles
                this._featureTileInfo.active = false;
            }
        },

        doFeatureTileScroll: function() {
                //Mojo.Log.info("doFeatureTileScroll");

                var featureTileInfo      = this._featureTileInfo, //localizing scope to cutdown the lookup time
                    scrollerInfo         = this._scrollerInfo, //localizing scope to cutdown the lookup time
                    crtTopScrollPos      = this._scroller.mojo.getScrollPosition().top,
                    crtFeatureTileHeight = parseInt(this._featureTileInfo.containerDiv.style.height, 10) || 0,
                    newHeight            = crtFeatureTileHeight,
                    featuredAppStyleProp = this._featureTileInfo.containerDiv.style;

                //Only modify the feature tiles section when user is scrolling near the top of the scroller (i.e.) POI
                if (crtTopScrollPos < scrollerInfo.minScrollPositionOfInterest) {
                        //Mojo.Log.info('Scrolling up');
                        if (crtTopScrollPos < scrollerInfo.position) {
                                if (crtFeatureTileHeight > featureTileInfo.minDivHeight) {
                                        newHeight = (crtFeatureTileHeight - 50);
                                }
                        }
                } else if (crtTopScrollPos > scrollerInfo.maxScrollPositionOfInterest) {
                        //Mojo.Log.info('Scrolling down');
                        if (crtTopScrollPos > scrollerInfo.position) {
                                if (crtFeatureTileHeight < featureTileInfo.maxDivHeight) {
                                        newHeight = (crtFeatureTileHeight + 50);
                                }
                        }
                } else {
                    return; //Not within a scroll area of interest
                }

                //Don't let new height violate FT divs min/max values
                if (newHeight > featureTileInfo.maxDivHeight) {
                        newHeight = featureTileInfo.maxDivHeight;
                } else if (newHeight < featureTileInfo.minDivHeight) {
                        newHeight = 0;
                }

                //Hide/show FT div as needed based on newHeight
                if (crtFeatureTileHeight === 0 && newHeight > 0) {
                        featuredAppStyleProp.display = 'block';
                        this._categorySelectorFadeStatus = 0;
                        this._categorySelectorFade.hide();
                } else if (newHeight <= 0) {
                        featuredAppStyleProp.display = 'none';
                        newHeight = 0;
                        this._categorySelectorFadeStatus = 1;
                        this._categorySelectorFade.show();
                }

                //Avoid touching the DOM if there is no real change
                if (newHeight !== crtFeatureTileHeight) {
                    featuredAppStyleProp.height = newHeight + 'px';
                }

                scrollerInfo.position = crtTopScrollPos;
        },

	_searchItemsCallback: function(widget, offset, count)
	{
		Mojo.Log.info('_searchItemsCallback');

                this._searchInProgress = true; //prevent scrim from being dismissed during search
                
		// do this only before we get the first batch of results back
		if (widget.mojo.getLength() === 0) {
			Mojo.Log.info("_searchItemsCallback & start spinner");
                        this._appsSearch.searchScrim.show();
			this._spinner.start();

                        if (this._commandMenuReady === true) {
                            this._setEnableQueryMenu(false);
                        }
		}

		var self = this;

		Mojo.Log.info("_searchItemsCallback requesting offset: %d count: %d", offset, count);
		Weave.Services.ApplicationServer.searchForApplications(this._query, this._queryFragment, this._qid, this._categoryInfo.categoryToSearch, offset, count, this._sort,
			Mojo.Locale.current, this._connectors, function(status, apps, total, country, tiles){
                                //Update feature tiles div as needed
                                if ((tiles !== undefined && tiles !== null) && tiles.length > 0) {
                                    self._setupFeatureTilesForCategory(tiles);
                                } else {
                                    self._setupFeatureTilesForCategory(null);
                                }

				Mojo.Log.info("CB offset %d, requestedCount %d, status %d, total %d", offset, count, status, total);

				// do this only when we get the first batch of results back
				if (widget.mojo.getLength() === 0) {
					Mojo.Log.info("CB listLen is 0 stop the spinner");

                                        if (self._commandMenuReady === true) {
                                            self._setEnableQueryMenu(true);
                                        }

					self._spinner.stop();
                                        self._searchInProgress = false;
                                        self._appsSearch.searchScrim.hide();
                                        self._setupExtraSearchOptions();
				}

				if (status)
				{
                                        Mojo.Log.info("CB listLen before the update %d", widget.mojo.getLength());
					myProfile.activationCountry = country;
					Mojo.Log.info("Main-Assistant: Activation country %s", myProfile.activationCountry);

                                        //The first time through we can setup the command menu once we know the activation country
                                        if (self._commandMenuReady === false) {
                                            self._updateQueryButton(1, QueryButtons.getCurrencyIconForActivationCountry(country));
                                            self._setVisibilityQueryMenu(true);
                                            self._commandMenuReady = true;
                                        }

                                        var oldLen = widget.mojo.getLength();
					widget.mojo.noticeUpdatedItems(offset, apps);

					// set list len to total results
					if (oldLen === 0) {
						widget.mojo.setLength(total);
					}

					Mojo.Log.info("CB listLen after update %d", widget.mojo.getLength());

                                        if (total === 0) {
                                            // No applictions found - display no app message
                                            self._scroller.hide();
                                            if ((tiles !== undefined && tiles !== null) && tiles.length > 0) {
                                                //Use the default message div if we have feature tiles to display
                                                //because we have less vertical space to work with
                                                self._appListDefaultMessage.show();
                                            } else {
                                                self._appListMessage.show();
                                            }
                                        } else {
                                            //Our custom scroller needs over 300px of content before it
                                            //will cause the scroll event to fire.
                                            var appsListWidgetComputedDimensions = self._appsListWidget.getDimensions();
                                            if (total > 2 && appsListWidgetComputedDimensions.height <= 300) {
                                                self._appsListWidget.style.height = '300px';
                                            } else if (self._appsListWidget.style.height !== '') {
                                                //Clear out any previously forced height and let auto-size as normal
                                                self._appsListWidget.style.height = '';
                                            }
                                            
                                            self._appListMessage.hide();
                                            self._appListDefaultMessage.hide();
                                            self._scroller.show();
                                        }
				}
				else
				{
					// Error
					Utilities.Errors.displayError(apps);
				}
		});
	},

	_formatAppSummary: function(dummy, model)
	{
		model.formattedPrice = (model.price === 'Free' || model.price == 0) ? $L("free") : Mojo.Format.formatCurrency(model.price, {fractionDigits: 2, countryCode: myProfile.activationCountry});
		model.formattedFree = ((model.price === 'Free' || model.price == 0) ? 'free' : '');
		model.formattedAverageRating = ('' + (Math.round(model.averageRating * 2) / 2)).replace(/\./, '');
		model.formattedUpdate = (this._getApplicationInstalledState(model) == 'update' ? 'has-update' : '');
		// HACK - author fixup
		model.author = (model.author ? model.author : '&nbsp;');

                //Limit title size displayed in app list view
                if (model.title && model.title.length > 30) {
                    model.title = model.title.substring(0, 27) + '...';
                }
	},

	_renderedAppSummary: function(widget, model, node)
	{
		new LazyLoadImage(model.appIcon, node.querySelector('.loadingicon'));
	},

	_gotoApp: function(event)
	{
		this.controller.stageController.pushScene("details", event.item.id, event.item.publicApplicationId,
				null,null, this.promoExpiredDate);
	},

	_searchApps: function()
	{
		this._appsListWidget.mojo.setLength(0);
		//this.controller.getSceneScroller().mojo.revealTop(0);
		this._appsListWidget.mojo.revealItem(0, true);

		// We fire the search by hand, rather than invalidating the list, to avoid the list putting
		// visual junk on the screen while it's updating.
		this._searchItemsCallback(this._appsListWidget, 0, this.listRerenderCount);
	},

	_searchAppsKey: function(event)
	{
		//Mojo.Log.info("_searchAppsKey", event.value, event.originalEvent.type, event.originalEvent.keyCode);
		this._query = event.value;
		if (event.originalEvent !== undefined && event.originalEvent.type === 'keyup' && event.originalEvent.keyCode == Mojo.Char.enter)
		{
			this._doCustomSearch();
		}
	},

        _setEnableQueryMenu: function(enable)
	{
		var items = this._queryMenu.items[1].items;
		if (items)
		{
			for (var i = 0; i < items.length; i++)
			{
				items[i].disabled = !enable;
			}
			this.controller.modelChanged(this._queryMenu);
		}
	},

        _setVisibilityQueryMenu: function(visible)
	{
		this._queryMenu.visible = visible;
                this.controller.modelChanged(this._queryMenu);
	},
	
	_markPromoInfo: function(promoInfo) {
		Mojo.Log.info("MainAssistant._markPromoInfo# promoInfo:%j", promoInfo);
		this.promoExpiredDate = promoInfo.validTo;
	}
});
/*
	Small controller class used to get password for the account
*/
var PasswordAssistant = Class.create(
{
	initialize: function(sceneAssistant, params)
	{
		this.sceneAssistant = sceneAssistant;
		this.controller = sceneAssistant.controller;	
		this._loginAttemptCount = 0;
		this._params = params;
		this._params.sceneAssistant = sceneAssistant;
		// Customer Service URL will be localized 
		this._custserviceurl = $L("http://www.palm.com/us/support/mobile/webos/contact.html");
	},
	
	setup : function(widget) 
	{
		Mojo.Log.info("--------setup");
		this.widget = widget;
		
		this.acctPasswordAttr = {
			hintText: $L("enter password"),
			modelProperty: 'original',
			autoFocus: true,
			maxLength: 20,
			changeOnKeyPress: true,
			requiresEnterKey: true,
			focusMode: Mojo.Widget.focusSelectMode,
			charsAllow: Utilities.Common.filterSpace.bind(this)
		};
		this.acctPasswordModel = {
			'original' : ''
		};

		this.controller.setupWidget('acctPassword', this.acctPasswordAttr, this.acctPasswordModel);
		this.controller.get('acctPassword').observe(Mojo.Event.propertyChange, this._passwordChanged.bind(this));
		
		this.buttonAttr = {
			disabledProperty: 'disabled'
		};
		
		this.buttonModel = {
			disabled: true,
			buttonLabel : $L('Continue'),
			buttonClass: 'palm-button'
		};
		
		this.controller.setupWidget('submitPassword', this.buttonAttr, this.buttonModel);
		Mojo.listen(this.controller.get('submitPassword'), Mojo.Event.tap, this._isUserValid.bindAsEventListener(this));
		
		this.forgotButtonAttr = {
			disabledProperty: 'disabled'
		};
		
		this.forgotButtonModel = {
			disabled: false,
			buttonLabel : $L('Forgot password'),
			buttonClass: 'palm-button'
		};
		
		this.controller.setupWidget('forgotPasswordButton', this.forgotButtonAttr, this.forgotButtonModel);
		this.controller.listen('forgotPasswordButton', Mojo.Event.tap, this._forgotPassword.bindAsEventListener(this));
				
		this._getAccountToken();
		this.passwordField = this.controller.get("acctPassword");
	},
	
	activate: function() 
	{
		this.passwordField.mojo.focus();
	},
	
	_passwordChanged: function(event) 
	{
		// Enable/disable based on length of password
		if(this.acctPasswordModel.original.length > 0 && this._enableSubmit) 
	   	{
		  	this.buttonModel.disabled = false;
	   	} 
	   	else 
	   	{
	   		this.buttonModel.disabled = true;
		}
		this.controller.modelChanged(this.buttonModel);

		// If the password field has focus and Enter is pressed then simulate tapping on "next"
		if (Mojo.Char.isEnterKey(event.originalEvent.keyCode)) 
		{
			// If the submit button is enabled then create the account
			if (this.buttonModel.disabled == false) 
			{
				this.passwordField.mojo.blur();
				this._isUserValid();
				Event.stop(event);
			} 
			else 
			{
				this.passwordField.mojo.focus();
			}
		}
	},
	
	_getAccountToken: function() 
	{
		Mojo.Log.info("------------------- Get account token ------------------");
		var self = this;
		Weave.Services.AccountServices.getAccountToken(function(status, accountToken, accountAlias, accountState) 
		{
			if (status) 
			{
				if (accountAlias != undefined) 
				{
					myProfile.email = accountAlias;
					myProfile.state = accountState;
					self.controller.get('acctEmail').innerHTML = myProfile.email;
					self._enableSubmit = true;
					// Enable/disable based on length of password
					if(self.acctPasswordModel.original.length > 0) 
				   	{
					  	self.buttonModel.disabled = false;
				   	} 
				   	else 
				   	{
				   		self.buttonModel.disabled = true;
					}
					self.controller.modelChanged(self.buttonModel)
				} 
				else 
				{
					//TODO Handle missing account token case
					Mojo.Log.error("PasswordAssistant._getAccountToken: accountAlias == undefined: No account token");	
				}
			} else {
				Mojo.Log.error("No account token");	
			}
		});
	},
	
	_displayErrors: function(badpwdlen, badpwd)
	{
		this.controller.get('passwordLengthError').style.display = (badpwdlen ? null : "none");
		this.controller.get('passwordError').style.display = (badpwd ? null : "none");
	},

	_isUserValid: function() 
	{
		Mojo.Log.info("------------------- _isUserValid------------------");

		this._loginAttemptCount++;
		myProfile.password = this.acctPasswordModel.original;
		
		if ((myProfile.password.length < 6) || (myProfile.password.length > 20)) 
		{
			this._displayErrors(true, false);
			this.passwordField.mojo.focus.defer();
		}
		else if (!Weave.Services.ConnectionManager.isOnline()) 
		{
			this._displayErrors(false, false);
			//Weave.Services.ConnectionManager.showConnectionError();
		}
		else 
		{
			this.buttonModel.disabled = true;
			this.controller.modelChanged(this.buttonModel);
			
			var self = this;
			Weave.Services.DeviceProfile.getDeviceId(function(status, devid)
			{
				if (status && devid) 
				{
					Weave.Services.AccountServices.isUserValid(myProfile.email, myProfile.password.replace(/ /g,""), devid, function(status, response)
					{
						if (status) 
						{
							Mojo.Log.info("Login attempt: " + self._loginAttemptCount);
							
							if (response.isValid == true) 
							{
								self._displayErrors(false, false);
								//This is the temp token used for preferences
								myProfile.idToken = response.idToken;
								self.widget.mojo.close();
								if (response.passwordResetFlag) 
								{
									self.controller.showDialog(
									{
										template: 'payment-setup/reset-password-dialog',
										assistant: new ResetPasswordAssistant(self, self._params)
									});
								}
								else 
								{
									Preferences.setLoginTime();
									self._params.onComplete(
									{
										passwordValid: true
									});
								}
							}
							else 
							{
								// If we have no security question, fetch it
								if (myProfile.questionId == -2) 
								{
									Weave.Services.AccountServices.getAccountSecurityQuestions(myProfile.email, Mojo.Locale.current, function(status, response)
									{
										if (status) 
										{
											if (response.id !== undefined) 
											{
												Mojo.Log.info("Got security question", response.id);
												myProfile.questionId = response.id;
												myProfile.questionText = response.question;
											}
											else 
											{
												myProfile.questionId = -1;
											}
										}
										else 
										{
											Mojo.Log.error("Error in getting account security question = %o", $H(response));
											myProfile.questionId = -1;
										}
										
										self._loginError();
									});
								}
								else 
								{
									self._loginError();
								}
							}
						}
						else 
						{
							if (response.errorCode && response.errorCode === "CONNECTION_ERROR") 
							{
								this.widget.mojo.close();
								//Weave.Services.ConnectionManager.showConnectionError();
							}
						}
					});
				}
				else 
				{
					Mojo.Log.error("Could not get device id %o", $H(response));
				}
			});
		}
	},
	
	/*
	 * Display login error and allow retries.
	 */
	_loginError: function () 
	{
		if (this._loginAttemptCount >= 3) 
		{
			if (myProfile.questionId >= 0) 
			{
				// Forgot password
				this._forgotPassword();
			}
			else 
			{
				Mojo.Log.info("sending password reset");
				var self = this;
				Weave.Services.AccountServices.requestPasswordResetEmail(myProfile.email, function(status, response)
				{
					if (status)
					{
						Mojo.Log.info("------------ resetEmailSuccess -----------------%o", $H(response));
						self.controller.showAlertDialog(
						{
						    onChoose: function(value) 
							{
								self.widget.mojo.close();
								self._params.onComplete({});
							},
						    title: $L("Password reset"),
						    message: $L('Follow the instructions we sent to <b>#{email}</b> to reset your password or <a href="#{url}">contact customer service.</a>').interpolate({email:myProfile.email, url:self._custserviceurl}),
							allowHTMLMessage: true,
						    choices:
							[
					        	{label: $L('Done'), value:'done', type:'color'}    
						    ]
					 	});	
					}
					else
					{
						Mojo.Log.error("could not send password reset email %o", $H(response));
					}
				});
			}
		}
		else 
		{
			Mojo.Log.info("Login attempt: ", this._loginAttemptCount);
			
			if (myProfile.questionId >= 0) 
			{
				this.controller.get('forgotPassword').show();
			}
			this._displayErrors(false, true);
			this.passwordField.mojo.focus();
		}
	},
	
	_forgotPassword: function()
	{
		this.widget.mojo.close();
		this.controller.showDialog(
		{
			template: 'payment-setup/security-question-dialog',
			assistant: new ForgotPasswordAssistant(this, this._params)
		});
	}
});
var ForgotPasswordAssistant = Class.create({
	
	initialize: function(sceneAssistant, params) {
		this.sceneAssistant = sceneAssistant;
		this.controller = sceneAssistant.controller;
		this.attemptCount = 1;
		this._params = params;
    this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;
	},
	
	setup : function(widget) 
	{
    // Google Analytics
    this.appMetrics.trackNewScene("forgot_password");
		this.widget = widget;
		this._clearErrorMessages();
		
		this.controller.get("questionText").update(myProfile.questionText);
						
		this.responseAttributes = {
			modelProperty: 'response',
			multiline: false,
			maxLength: 50, 
			textReplacement: false,
			focusMode: Mojo.Widget.focusInsertMode,
			changeOnKeyPress: true,
			requiresEnterKey: true
		};
		this.responseModel = {
			'response' : '',
			disabled: false
		};
		
		this.controller.setupWidget('response', this.responseAttributes, this.responseModel);
		this.controller.get('response').observe(Mojo.Event.propertyChange, this.responseTextChanged.bind(this));
		
		this.buttonAttr = {
			disabledProperty: 'disabled'
		};
		
		this.buttonModel = {
			disabled: true,
			buttonLabel : $L('Done'),
			buttonClass: 'palm-button'
		};
		
		this.controller.setupWidget('submitAnswer', this.buttonAttr, this.buttonModel);
		this.controller.listen('submitAnswer', Mojo.Event.tap, this.submitAnswer.bindAsEventListener(this));
	},
	
	activate: function() 
	{
		this.controller.get("response").mojo.focus();
	},
	
	toggleDisabled: function() 
	{
		
       if(this.responseModel.response.length > 0) {
		  	this.buttonModel.disabled = false;
			this.controller.modelChanged(this.buttonModel);
	   } else {
	   		this.buttonModel.disabled = true;
			this.controller.modelChanged(this.buttonModel);
	   }
    },
	
	responseTextChanged: function(event) 
	{
	 	this.responseModel.response = event.value;
		this.controller.modelChanged(this.responseModel, this);
		this.toggleDisabled();
		if (event && Mojo.Char.isEnterKey(event.originalEvent.keyCode)) {
			// If the submit button is enabled then submit answer
			if (this.buttonModel.disabled == false) {
				this.submitAnswer();
				Event.stop(event);
			} 
		}
	},
	
	_clearErrorMessages: function()
	{
		this.controller.get("noResponseMessage").hide();
		this.controller.get("wrongResponse").hide();
	},
	
	submitAnswer: function() 
	{
		this.response = this.responseModel.response;
		this._clearErrorMessages();
		if(this.response == "" || this.response == undefined) 
		{
			this.controller.get('noResponseMessage').show();
			return;
		}

		if (Weave.Services.ConnectionManager.isOnline() === false) {
			//Weave.Services.ConnectionManager.showConnectionError();
			return;
		}

		this.buttonModel.disabled = true;
		this.controller.modelChanged(this.buttonModel);
		this.attemptCount++;
		
		var self = this;
		Weave.Services.AccountServices.authenticateAccountFromSecurityQuestion(myProfile.email, myProfile.questionId, this.response, function(status, response)
		{
			if (status)
			{
				Mojo.Log.info("authenticate successful: %o", $H(response));
				if(response.returnValue == true) 
				{
					myProfile.idToken = response.idToken;
					self.widget.mojo.close();		
					self.controller.showDialog(
					{
						template: 'payment-setup/reset-password-dialog',
						assistant: new ResetPasswordAssistant(self, self._params)
					});	
				}
			}
			else
			{
				self._clearErrorMessages();
				Mojo.Log.error("changePassword error = %o", $H(response));
				if (self.attemptCount <= 3) 
				{
					self.controller.get('wrongResponse').show();
					self.controller.get('response').mojo.focus();
				} 
				else 
				{
					Weave.Services.AccountServices.requestPasswordResetEmail(myProfile.email, function(status, response)
					{
						if (status)
						{
							self.widget.mojo.close();		
							self.controller.showDialog(
							{
								template: 'payment-setup/reset-email-dialog',
								assistant: new ResetEmailAssistant(self)
							});	
						}
						else
						{
							self.widget.mojo.close();
							Mojo.Controller.errorDialog($L("We could not send an email to reset your password. Visit palm.com/support for more help."));
						}
					});
				}	
			}
		});
	}

});
var ResetPasswordAssistant = Class.create(
{
	initialize: function(sceneAssistant, params)
	{
		this.sceneAssistant = sceneAssistant;
		this.controller = sceneAssistant.controller;
		this._params = params;
    this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;
	},
	
	setup : function(widget) 
	{
    this.appMetrics.trackNewScene("reset_password");
		this.widget = widget;
		this.clearErrorMessages();
		
		this.acctPasswordAttr = {
			hintText: $L("enter password"),
			modelProperty: 'original',
			autoFocus: true,
			maxLength: 20,
			enterSubmits: true,
			focusMode:Mojo.Widget.focusSelectMode,
			charsAllow: Utilities.Common.filterSpace.bind(this)
		};
		this.acctPasswordModel = {
			'original' : ''
		};

		this.controller.setupWidget('newPassword', this.acctPasswordAttr, this.acctPasswordModel);
				
		this.verifyPasswordAttr = {
			hintText: $L("confirm password"),
			modelProperty: 'verify',
			autoFocus: false,
			maxLength: 20,
			className: ' ',
			changeOnKeyPress: true,
			requiresEnterKey: true,
			focusMode:Mojo.Widget.focusSelectMode,
			charsAllow: Utilities.Common.filterSpace.bind(this)
		};
		this.verifyPasswordModel = {
			'verify' : ''
		};
		
		this.controller.setupWidget('confirmPassword', this.verifyPasswordAttr, this.verifyPasswordModel);	
		
		this.controller.get('newPassword').observe(Mojo.Event.propertyChange, this.passwordChanged.bind(this));
		this.controller.get('confirmPassword').observe(Mojo.Event.propertyChange, this.verifyPasswordChanged.bind(this));
		
		this.buttonAttr = {
			disabledProperty: 'disabled'
		};
		
		this.buttonModel = {
			disabled: true,
			buttonLabel : $L('Done'),
			buttonClass: 'palm-button'
		};
		
		this.controller.setupWidget('submitResetPassword', this.buttonAttr, this.buttonModel);
		this.controller.listen('submitResetPassword', Mojo.Event.tap, this.resetPassword.bindAsEventListener(this));
	},
	
	clearErrorMessages: function() 
	{
		this.controller.get('mismatchMessage').hide();
		this.controller.get('noPasswordMessage').hide();
		this.controller.get('noConfirmMessage').hide();
		this.controller.get('systemErrorMessage').hide();
		this.controller.get('passwordLengthError').hide();
	},
	
	
	toggleDisabled: function() 
	{
       	if (this.acctPasswordModel.original.length > 0 && this.verifyPasswordModel.verify.length > 0) 
		{
		  	this.buttonModel.disabled = false;
			this.controller.modelChanged(this.buttonModel);
	   	} 
	   	else 
	   	{
	   		this.buttonModel.disabled = true;
			this.controller.modelChanged(this.buttonModel);
	   	}
    },
	
	passwordChanged: function (event) 
	{
		this.toggleDisabled();
	},
	
	verifyPasswordChanged: function (event) 
	{
		this.toggleDisabled();
		// If the password field has focus and Enter is pressed then simulate tapping on "next"
		if (event && Mojo.Char.isEnterKey(event.originalEvent.keyCode)) 
		{
			// If the submit button is enabled then change password
			if (this.buttonModel.disabled == false) 
			{
				if (this.resetPassword() === true)
				{
					this.controller.get('newPassword').mojo.focus.defer();
				}
				Event.stop(event);
			} 
		}
	},
	
	resetPassword: function()
	{
		this.newPassword = this.acctPasswordModel.original;
		this.confirmPassword = this.verifyPasswordModel.verify;
		this.clearErrorMessages();
		
		this.controller.get('newPassword').mojo.focus.defer();
		
		if (this.newPassword == "" || this.newPassword == undefined) 
		{
			this.controller.get('noPasswordMessage').show();
			return true;
		}
		else if ((this.newPassword.length < 6) || (this.newPassword.length > 20)) 
		{
			this.controller.get('passwordLengthError').show();
			return true;
		}
		else if (this.confirmPassword == "" || this.confirmPassword == undefined) 
		{
			this.controller.get('noConfirmMessage').show();
			return true;
		}
		else if (this.newPassword != this.confirmPassword) 
		{
			this.controller.get('mismatchMessage').show();
			return true;
		}
		else if (Weave.Services.ConnectionManager.isOnline() === false) 
		{
			//Weave.Services.ConnectionManager.showConnectionError();
		}
		else 
		{
			Mojo.Log.info("AUTHING ACCOUNT", myProfile.email, myProfile.password, this.newPassword);
			
			this.buttonModel.disabled = true;
			this.controller.modelChanged(this.buttonModel);
			
			var self = this;
			Weave.Services.AccountServices.changePassword(this.newPassword.replace(/ /g, ''), myProfile.questionId, undefined, myProfile.idToken, true, function(status, response)
			{
				if (status && response.returnValue) 
				{
					Mojo.Log.info("changePassword successful: %o", $H(response));
					myProfile.password = self.newPassword;
					Preferences.setLoginTime();
					self._params.onComplete(
					{
						passwordValid: true,
						passwordChanged: true
					});
				}
				else 
				{
					Mojo.Log.error("changePassword error = %o", $H(response));
					if (Weave.Services.ConnectionManager.isOnline() === false || response.errorText === "No response") 
					{
						Mojo.Log.info("show connection error ---------------");
						self.widget.mojo.close();
						//Weave.Services.ConnectionManager.showConnectionError();
					}
					else 
					{
						self.controller.get('systemErrorMessage').show();
					}
				}
			});
		}
	}
});
var ResetEmailAssistant = Class.create({
	
	initialize: function(sceneAssistant) {
		this.sceneAssistant = sceneAssistant;
		this.controller = sceneAssistant.controller;
    this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;
	},
	
	setup : function(widget) {
    this.appMetrics.trackNewScene("reset_email");
		this.widget = widget;
		this.controller.get("emailAddress").update(myProfile.email);
		this.controller.listen("doneResetEmail", Mojo.Event.tap, this.doneResetEmail.bindAsEventListener(this));
	},
		
	doneResetEmail: function(event) {
		this.widget.mojo.close();
	}
	
});
/*
	Small controller class used to input and display promo code
*/
var PromoCodeAssistant = Class.create(
{
	initialize: function(sceneAssistant, params)
	{
		this.sceneAssistant = sceneAssistant;
		this.controller = sceneAssistant.controller;	
		this._verifyAttemptCount = 0;
		this._params = params;
		this._params.sceneAssistant = sceneAssistant;
		// Customer Service URL will be localized 
		this._custserviceurl = $L("http://www.palm.com/us/support/mobile/webos/contact.html");
	},
	
	setup : function(widget) 
	{
		Mojo.Log.info("-------------------PromoCodeAssistant setup------------------");
		this.widget = widget;
		
		this.usePromoCodeButtonAttr = {
			disabledProperty: 'disabled'
		};
		
		this.usePromoCodeButtonModel = {
			disabled: false,
			buttonLabel : $L('Use Promo Code'),
			buttonClass: 'palm-button'
		};
		
		this.controller.setupWidget('usePromoCodeButton', this.usePromoCodeButtonAttr, this.usePromoCodeButtonModel);
		Mojo.listen(this.controller.get('usePromoCodeButton'), Mojo.Event.tap, this._isCodeValid.bindAsEventListener(this));
		
		this.cancelButtonAttr = {
			disabledProperty: 'disabled'
		};
		
		this.cancelButtonModel = {
			disabled: false,
			buttonLabel : $L('Cancel'),
			buttonClass: 'palm-button'
		};
		
		this.controller.setupWidget('cancelButton', this.cancelButtonAttr, this.cancelButtonModel);
		this.controller.listen('cancelButton', Mojo.Event.tap, this._cancelButton.bindAsEventListener(this));
		
		this.promoCodeAttr = {
				hintText: $L("Promo Code"),
				modelProperty: 'original',
				autoFocus: true,
				maxLength: 256,
				changeOnKeyPress: true,
				requiresEnterKey: true,
				focusMode: Mojo.Widget.focusSelectMode,
			};
	    this.promoCodeModel = {
				'original' : '',
				disabled: false
			};
			
		this.promoCodeModel.original = this._params.promoCode;
	        				
		this.controller.setupWidget('promoCode', this.promoCodeAttr, this.promoCodeModel);
		this.controller.get('promoCode').observe(Mojo.Event.propertyChange, this._promoCodeChanged.bind(this));
		
		this.promoCodeField = this.controller.get("promoCode");
	},
	
	activate: function() 
	{
		Mojo.Log.info("------------------- PromoCodeAssistant activate ------------------");
		
		this.controller.get('promoCodeDiscript').innerHTML = $L('Enter promo code to download #{title}.').interpolate({title: this._params.title});
		
		if ((this._params.errCode) && (this._params.errCode!="")) {
			this._displayErrors(true, this._params.errCode);
		}
		
		if(this.promoCodeModel.original.length > 0)			
	   	{
		  	this.usePromoCodeButtonModel.disabled = false;
	   	} 
	   	else 
	   	{
	   		this.usePromoCodeButtonModel.disabled = true;
		}
		this.controller.modelChanged(this.usePromoCodeButtonModel);
		
		this.promoCodeField.mojo.focus();
	},
	
	_promoCodeChanged: function(event) 
	{
		Mojo.Log.info("------------------- _promoCodeChanged ------------------");
		
		// Enable/disable based on length of promo code
		if(this.promoCodeModel.original.length > 0)			
	   	{
		  	this.usePromoCodeButtonModel.disabled = false;
	   	} 
	   	else 
	   	{
	   		this.usePromoCodeButtonModel.disabled = true;
		}
		this.controller.modelChanged(this.usePromoCodeButtonModel);
		// If the promoCode field has focus and Enter is pressed then simulate tapping on "Use Promo Code"
		if (Mojo.Char.isEnterKey(event.originalEvent.keyCode)) 
		{
			// If the submit button is enabled then create the account
			if (this.usePromoCodeButtonModel.disabled == false) 
			{
				this.promoCodeField.mojo.blur();
				this._isCodeValid();
				Event.stop(event);
			} 
			else 
			{
				this.promoCodeField.mojo.focus();
			}
		}
	},
	
	_displayErrors: function(show,errorCode)
	{		
		var errMessage;
		var errorMessages = {"INVALID": $L("This promo code is invalid."),
		"PMTPROMO70101": $L("This promo code has reached its limit and is no longer valid."),
		"PMTPROMO70102": $L("This promotion has been cancelled."),
		"PMTPROMO70103": $L("This promo code has expired."),
		"PMTPROMO70104": $L("This promotion has been cancelled."),
		"PMTPROMO70105": $L("This promotion has not started yet. Please try again later."),
		"PMTPROMO70106": $L("This promo code cannot be used in your country."),
		"PMTPROMO70107": $L("This promo code cannot be used with <CARRIER NAME>."),
		"PMTPROMO70108": $L("This app's price is higher than the value of the promo code."),
		"PMTPROMO70109": $L("This promo code is not valid for this app or version."),
		"PMTPROMO70110": $L("This promo code is not valid for this app or version."),
		"PMTPROMO70010": $L("This promo code is invalid.")};
				
		Mojo.Log.info("errorCode: %s" + errorCode);
		//errorCode = "PMTPROMO70107";// test
		//errorCode = "error";
		if (show) {
			if (errorCode == "PMTPROMO70107" ){
				// Get carrier id first for show
				var self = this;
				Weave.Services.Preferences.SystemProperties.getCarrier(function(status, carrier)
						{
							Mojo.Log.info("Carrier:", carrier);
							var _carrier = status ? carrier : 'ROW';
							errMessage = $L('This promo code cannot be used with #{carrierName}.').interpolate({carrierName: _carrier});
							self.controller.get('Error').style.display = "";
					        self.controller.get('ErrorMessage').innerHTML = errMessage;
						});
			}else {
			    errMessage = errorMessages[errorCode];
			    if (errMessage) {
					// Show inline message
			        this.controller.get('Error').style.display = "";
			        this.controller.get('ErrorMessage').innerHTML = errMessage;
			        
				}
			}
			
		}else {
			this.controller.get('Error').style.display = "none";
		}
		
	},

	_isCodeValid: function() 
	{
		Mojo.Log.info("------------------- _isCodeValid------------------");
		this._verifyAttemptCount++;
		promoCode = this.promoCodeModel.original;
		// Filter space
		promoCode = promoCode.replace(/ /g, '');
		appid = this._params.appid;
		version = this._params.version;
		
		Mojo.Log.info("promoCode: " + promoCode + " appid: " + appid + "version: " + version);
		
		if ((promoCode.length < 1) || (promoCode.length > 64)) 
		{
			this._displayErrors(true, "INVALID");
		}
		else if (!Weave.Services.ConnectionManager.isOnline()) 
		{
			this._displayErrors(false);
			
		}
		else 
		{
			this.usePromoCodeButtonModel.disabled = true;
			this.controller.modelChanged(this.usePromoCodeButtonModel);
			
			var self = this;
			Weave.Services.PaymentServer.checkPromoCodeStatus(promoCode, appid, version, function(status, response)
			{			
				if (status) 
				{
					Mojo.Log.info("Verify attempt: " + self._verifyAttemptCount);
					
					if (response.OutCheckPromoCodeStatus.valid == "true") 
					{
						self._displayErrors(false);
						
						self.widget.mojo.close();
						self._params.onComplete(
								{
									promoCodeValid: true,
									status: response.OutCheckPromoCodeStatus.status,
									promoCode: promoCode
								});
					}
					else if (response.OutCheckPromoCodeStatus.valid == "false")
					{
						// invalid code error
						self.usePromoCodeButtonModel.disabled = false;
					    self.controller.modelChanged(self.usePromoCodeButtonModel);
						self.promoCodeModel.disabled = false;
						self.controller.modelChanged(self.promoCodeModel);
						self.controller.get('promoCodeDiscript').innerHTML = $L('Enter promo code to download #{title}.').interpolate({title: self._params.title});
						
						if (response.OutCheckPromoCodeStatus.errorCode)
						{
							self._displayErrors(true,response.OutCheckPromoCodeStatus.errorCode);
						}else {
							self._displayErrors(true,"INVALID");
						}
						
						self.promoCodeField.mojo.focus();
						
					}
				}
				else 
				{				
					self.usePromoCodeButtonModel.disabled = false;
					self.controller.modelChanged(self.usePromoCodeButtonModel);
					if(response.errorCode && response.errorCode === "PMTPROMO70010"){ 
                        // invalid code error		
                        self.promoCodeModel.disabled = false;
						self.controller.modelChanged(self.promoCodeModel);
						self.controller.get('promoCodeDiscript').innerHTML = $L('Enter promo code to download #{title}.').interpolate({title: self._params.title});						
						self._displayErrors(true,response.errorCode);						
						self.promoCodeField.mojo.focus();

					}else if (response.errorCode) {
						var err = response.errorCode;
		                Utilities.Errors.displayError(err, {
		                    errCode: err
		                }, "PMT_catchAll");
					}
					
				}
			});
		}
	},
	
	_cancelButton: function()
	{
		this.widget.mojo.close();
	}
	
	
});
/* Copyright 2009 Palm, Inc.  All rights reserved. */

/*
 * Current user profile.
 */
var myProfile =
{
	email: "",
	password: "",
	firstName: "",
	lastName: "",
	questionId: -2,
	response: "",
	securityQuestions: []
};

var Preferences =
{
	_timeout: 4 * 60 * 60 * 1000, // 4 hours
	
	getPaymentLogin: function()
	{
		var cookie = (new Mojo.Model.Cookie("com.palm.app.findapps.paymentPref")).get() || {};
		Mojo.Log.info("getPaymentLogin %j", cookie);
		return cookie.paymentPref || "timeout"; 
	},
	
	setPaymentLogin: function(val)
	{
		var cookieJar = new Mojo.Model.Cookie("com.palm.app.findapps.paymentPref");
		var cookie = cookieJar.get() || {};
		Mojo.Log.info("setPaymentLogin %j %s", cookie, val);
		cookie.paymentPref = val;
		cookieJar.put(cookie);
	},
	
	setLoginTime: function()
	{
		var cookieJar = new Mojo.Model.Cookie("com.palm.app.findapps.paymentPref");
		var cookie = cookieJar.get() || {};
		Mojo.Log.info("setLoginTime %j", cookie);
		cookie.loginTime = new Date().getTime();
		cookieJar.put(cookie);
	},
	
	isLoginTimedOut: function()
	{
		var cookie = (new Mojo.Model.Cookie("com.palm.app.findapps.paymentPref")).get() || { loginTime: 0 };
		var now = new Date().getTime();
		Mojo.Log.info("now %d then %d timeout %d diff %d", now, cookie.loginTime, this._timeout, now - cookie.loginTime);
		if (now - cookie.loginTime > this._timeout || cookie.paymentPref == "every")
		{
			return true;
		}
		else
		{
			return false;
		}
	}
};
var TermsOfUse =
{
	_TOSDate: "7th Aug 2009",
	
	isAccepted: function()
	{
		var cookie = (new Mojo.Model.Cookie("com.palm.app.findapps.terms")).get() || {};
		return cookie.termsOfUseAccepted == this._TOSDate;
	},
	
	setAccepted: function()
	{
		var cookieJar = new Mojo.Model.Cookie("com.palm.app.findapps.terms");
		var cookie = cookieJar.get() || {};
		cookie.termsOfUseAccepted = this._TOSDate;
		cookieJar.put(cookie);
	}
};/* Copyright 2009 Palm, Inc.  All rights reserved. */

var Spinner = Class.create({
	
	initialize: function(sceneAssistant, id, start, size, scrim)
	{
		this._controller = sceneAssistant.controller;
		this._model =
		{
			spinning: false
		};
		this._controller.setupWidget(id,
			{
				spinnerSize: size ? size : 'small'
			},
			this._model
		);
		this._scrim = this._controller.get(scrim ? scrim : id + "Cont");
		this._state = 'stopped';
		if (start)
		{
			this.start();
		}
	},
	
	start: function()
	{
		if (this._scrim)
		{
			this._scrim.show();
		}
		this._fire('start');
	},
	
	stop: function()
	{
		this._fire('stop');
	},
	
	_fire: function(event)
	{
		Mojo.Log.info('Spinner event', event, 'state', this._state);
		var self = this;
		switch (this._state)
		{
			case 'stopped':
				switch (event)
				{
					case 'start':
						this._state = 'starting';
						this._timer = setTimeout(function() { self._fire('starting2sec'); }, 2000);
						break;
						
					case 'stop':
					case 'starting1sec':
					case 'running1sec':
						break;
				}
				break;
				
			case 'starting':
				switch (event)
				{
					case 'starting2sec':
						this._state = 'runningquick';
						this._model.spinning = true;
						this._controller.modelChanged(self._model);
						this._timer = setTimeout(function() { self._fire('running1sec'); }, 1000);
						break;
						
					case 'stop':
						clearTimeout(this._timer);
						this._state = 'stopped';
						if (this._scrim)
						{
							this._scrim.hide();
						}
						break;
						
					case 'start':
					case 'running1sec':
						break;
				}
				break;
				
			case 'runningquick':
				switch (event)
				{
					case 'running1sec':
						this._state = 'running';
						break;
						
					case 'stop':
						this._state = 'stopping';
						break;
						
					case 'start':
					case 'starting2sec':
						break;
				}
				break;
				
			case 'running':
				switch (event)
				{
					case 'stop':
						this._state = 'stopped';
						this._model.spinning = false;
						this._controller.modelChanged(this._model);
						if (this._scrim)
						{
							this._scrim.hide();
						}
						break;
						
					case 'start':
					case 'starting2sec':
					case 'running1sec':
						break;
				}
				break;
				
			case 'stopping':
				switch (event)
				{
					case 'running1sec':
						this._state = 'stopped';
						this._model.spinning = false;
						this._controller.modelChanged(this._model);
						if (this._scrim)
						{
							this._scrim.hide();
						}
						break;
						
					case 'start':
						this._state = 'running';
						break;
						
					case 'stop':
					case 'starting2sec':
						break;
				}
				break;
		}
	}
	
});
/* Copyright 2009 Palm, Inc.  All rights reserved. */

var Utilities = Utilities || {};

Utilities.ErrorChoices = {
	tryCCChoices: [{ label: $L("Use Credit Card"), value: "cc", type: 'default'}, { label: $L("Cancel"), value: true, type: 'dismiss'}],
	tryOBChoices: [{ label: $L("Use Carrier Account"), value: "ob", type: 'default'}, { label: $L("Cancel"), value: true, type: 'dismiss'}],
	simpleOKChoices: [{ label: $L("OK"), value: true, type: 'dismiss' }]
}

Utilities.CommonErrors = 
{
	_PMTGroupErrors:
	{
		PMT_0: { dialog: true, title: $L("Payment Type"), message: $L("You can only pay with a credit card. Update your account information in Preferences & Accounts and try again. #{errCode}") , choices: Utilities.ErrorChoices.simpleOKChoices},
		PMT_1: { dialog: true, title: $L("Payment Failed"), message: $L("We cannot process your payment. Contact your financial institution. #{errCode}"), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT_2: { dialog: true, title: $L("Payment Failed"), message: $L("Update the payment information in your account and try again. #{errCode}"), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT_3: { dialog: true, title: $L("Payment Failed"), message: $L("CyberSource refused your payment. #{errCode}") , choices: Utilities.ErrorChoices.simpleOKChoices},
		PMT_4: { dialog: true, title: $L("Payment Failed"), message: $L("You are not permitted to purchase items in the App Catalog. #{errCode}") , choices: Utilities.ErrorChoices.simpleOKChoices},
		PMT_5: { dialog: true, title: $L("Transaction Error"), message: $L("The credit card you are using may be fraudulent. Enter a different credit card in Preferences & Accounts and try again. #{errCode}") , choices: Utilities.ErrorChoices.simpleOKChoices},
		PMT_6: { dialog: true, title: $L("Can't Purchase"), message: $L("The United States Government prohibits HP from allowing you to purchase applications.") , choices: [{label: $L("OK"), value: "quit", type: 'primary'}, {label: $L("Help"), value: "help", type: 'secondary'}]},
		PMT_7: { dialog: true, title: $L("Invalid Address"), message: $L("The address you entered cannot be found. Verify that the address you entered is correct, and is in the Billing Country you have chosen.") , choices: [{label: $L("OK"), value: "ok", type: 'dismiss'}]}

	},
	OBCarrierNotSupported: {
		dialog: true, title: $L("Operator Billing is not supported for this carrier"), message: $L("#{carrierName} does not support payments. Please pay with a credit card."), choices: Utilities.ErrorChoices.simpleOKChoices
	}
}

Utilities.Errors = 
{
	// This is an entry point to showing error scene
	_displayErrorPage: function(error, errorCode)
	{
		var stageController = Weave.System.Activator.getActiveStageController(true);
		
		Mojo.Log.error("Errors._displayErrorPage", error);
		if (error == "invalidtoken")
		{
			// If we receive a bad authentication token we must inform the system and popup a dialog (not pop to an error screen)
			// Always felt the error screen was better.
			Weave.Services.AccountServices.notifyAuthenticationFailure(function()
			{
				if (!stageController) return;
				stageController.topScene().showAlertDialog(
				{
					onChoose: function() {},
					title: $L('No HP webOS Account'),
					message: $L('You need an active HP webOS Account to use App Catalog.'),
					choices: 
					[
						{label: $L("OK"), value: true, type: 'dismiss'},
					]
				});
			});
		}
		else
		{
			if (!stageController) return;
                        var eCode = errorCode || '';
			stageController.swapScene("error", error, eCode);
		}
	},
	
	_displayIncompatibleErrorPage: function(error)
	{
		Mojo.Log.error("Errors._displayNonFatalErrorPage", error);
		var stageController = Weave.System.Activator.getActiveStageController(true);
		if (!stageController) return;
		
		// This code assusmes that details scene is the one at the top of the stack
		// and that error came from requesting current app details. With current implementation
		// that is always true
		stageController.swapScene("incompatible", error);
	},
	
	_displayErrorDialog: function(error, callback)
	{
		var stageController = Weave.System.Activator.getActiveStageController();
		if (!stageController) {
			if(!error.promoTag) {
				return;
			}
			else {
				this._wrapPromoError(error, callback);
			}
		}
		else {
			stageController.topScene().showAlertDialog(
			{
				onChoose: callback,
				title: error.title,
				message: error.formattedMessage ? error.formattedMessage : error.message,
						choices: error.choices
			});
		}
	},

	_wrapPromoError: function(error, callback) {
		var stageController = Weave.System.Activator.getActiveStageController(true);
		if(!stageController) {
			Mojo.Log.info("Utilities.Error._displayErrorDialog# stageController is null(level2), error:<%j>",
					error);
			
			Mojo.Controller.appController.createStageWithCallback(
			{
				lightweight: true,
				name: "default",
				assistantName: "DefaultStageAssistant"
			}, 
			function(stageController)
			{
				Mojo.Log.info("Utilities.Error._displayErrorDialog# createStageWithCallback done, indexOf<PROMO>", 
						error.promoErrorCode.indexOf('PROMO'));	
				switch(true) {
					case error.promoErrorCode.indexOf('PROMO')>=0:
						Mojo.Log.info("Utilities.Errors.displayPromoPopUpDialog# errorCode:<%s>", 
								error.promoErrorCode);
						stageController.pushScene({name: "main", disableSceneScroller: true}, 
								{promoLaunchError: true});
						break;
					default:
						Mojo.Log.info("Utilities.Errors.displayPromoPopUpDialog# other errorCode than promo:<%s>",
								error.promoErrorCode);
						stageController.pushScene("error", error);
				}
			});
			return;
		}
		stageController.activate();
		stageController.topScene().showAlertDialog(
		{
			onChoose: callback,
			title: error.title,
			message: error.formattedMessage ? error.formattedMessage : error.message,
			choices: error.choices
		});
	},
	
	displayPromoErrorDialog: function(sceneController, errorTag, error) {
		var promoTitle = "Promo Code";
		var promoMessage = "Unknown error."
		if(sceneController) {
				switch(errorTag) {
				case "invalid":
					Mojo.Log.info("Utilities.Errors.displayPromoPopUpDialog# invalid promo code");
					promoMessage = "Invalid, unavailable or expired promo code, try to use previous saved code or manually input valid code.";
					break;
				case "fail":
					promoMessage = "Sorry, fail to get promo code information from server.";
					break;
				default:
					Mojo.Log.info("Utilities.Errors.displayPromoPopUpDialog# unexpected errorTag");
				}
			sceneController.showAlertDialog({
				title: promoTitle,
				message: $L(promoMessage),
				choices: [{label: "OK", value: "ok"}]
			});
		} 
		else {
			var stageController = Weave.System.Activator.getActiveStageController();
			if (!stageController) return;
			
			promoMessage = "Sorry, fail to get promo code information from server.";
			stageController.activeScene().showAlertDialog({
				title: promoTitle,
				message: $L(promoMessage),
				choices: [{label: "OK", value: "ok"}]
			});
			
//			if(stageController.activeScene() ) {
//				stageController.swapScene("error", error);
//			}
//			else {
//				stageController.pushScene("error", error);
//			}
		} 
	},
	
	// displayError: function(errorCode, defaultTitle, defaultMessage, callback)
	displayError: function(errorCode, args, defaultError, defaultTitle, defaultMessage, callback)
	{
		// for payment failures don't show full error pages
		// just go with default error dialog
		if ((errorCode == "failure" || errorCode == "badresponse") && defaultError && defaultError.indexOf('PMT_'))
		{
			errorCode = defaultError;
		}		
		
		Mojo.Log.error("Errors.displayError errorCode %s, args %j, defaultError %s, defaultMessage %s", errorCode, args, defaultError, defaultMessage);
		
		if (!this._dialogErrors[errorCode]) {
			Mojo.Log.error("## No error for _dialogErrors[errorCode], errorCode '%s'", errorCode);
		}
		
		var error = this._dialogErrors[errorCode] || this._dialogErrors[defaultError];
		
		if (!error)
		{
			// if PMT error default to catch_all message 
			if (errorCode.toString().indexOf("PMT") >= 0)
				error = this._dialogErrors[PMT_catchAll];
			else
				error = {dialog: true, title: defaultTitle || $L("Unknown Error"), message: defaultMessage || errorCode};
		}
		
		if (error.page) 
		{
			this._displayErrorPage(errorCode);
		}
		else if (error.incompatible_page)
		{
			this._displayIncompatibleErrorPage(errorCode);
		}
		else if (error.dialog)
		{
			if (!args) {
				args = {}
			}

			var self = this;

    		Weave.Services.DeviceProfile.getCarrierIdentification(function(status, carrier) {
    			args.carrierName = (carrier && carrier.qOperatorShortName) || "your carrier";

				var msg = error.message;
				error.formattedMessage = msg.interpolate(args);
			    
			    Mojo.Log.error("Errors.displayError, goto _displayErrorDialog");
			// promo line
			if(errorCode.indexOf('PROMO')) {
				error.promoTag = true;
				error.promoErrorCode = errorCode;
			}
			    
				if (!error.failoverNotAllowed) {
					if (args.failover == "cc") {
						error.choices = Utilities.ErrorChoices.tryCCChoices;
					} else if (args.failover == "ob") {
						error.choices = Utilities.ErrorChoices.tryOBChoices;
					}
				}
			
				self._displayErrorDialog(error, callback || function(){});
    		});
		}
	},
	
	_dialogErrors:
	{
		// terminal errors
		offline: {page: true},
		invalidtoken: {page: true},
		failure: {page: true},
		badformat: {page: true},
		timeout: {page: true},
		jsonexception: {page: true},
        downformaintenance: {page: true},
		appunavailable: {page: true},
		dplfailed: {page: true},
		PMT01002: {page: true},
		
		// incompatible app errors
		DISC0025: {incompatible_page: true},
		DISC0124: {incompatible_page: true},
		DISC0125: {incompatible_page: true},
		DISC0201: {incompatible_page: true},
		DISC0202: {incompatible_page: true},
		DISC0203: {incompatible_page: true},
		
		// payment errors
		PMT_catchAll: {dialog: true, title: $L("Unexpected problem"), message: $L("App Catalog could not complete the last action you performed. Try again later. #{errCode}"), choices: [{ label: $L("OK"), value: true, type: 'dismiss'}]},
		PMT_addCC_default: {dialog: true, title: $L("Couldn't Add Credit Card"), message: $L("A problem occurred when adding your credit card information. Try again later. #{errCode}"), choices: [{ label: $L("OK"), value: true, type: 'dismiss'}]},
		PMT_modifyCC_default: {dialog: true, title: $L("Couldn't Update"), message: $L("The credit card information could not be updated. Try again later. #{errCode}"), choices: [{ label: $L("OK"), value: true, type: 'dismiss'}]},
		PMT_removeCC_default: {dialog: true, title: $L("Couldn't Remove"), message: $L("The credit card was not removed from your account. Try again later. #{errCode}"), choices: [{ label: $L("OK"), value: true, type: 'dismiss'}]},
		PMT_purchase_default: {dialog: true, title: $L("Couldn't Purchase"), message: $L("The item could not be purchased. Try again later. #{errCode}"), choices: Utilities.CommonErrors.tryCCChoices},
		PMT_cant_download: Utilities.CommonErrors._PMTGroupErrors.PMT_6,
		PMT_cant_download_encrypted:  {dialog: true, title: $L("Can't Download"), message: $L("The United States Government prohibits HP from allowing you to download this application."), choices: [{ label: $L("OK"), value: true, type: 'dismiss'}]},
		PMT_cant_purchase: Utilities.CommonErrors._PMTGroupErrors.PMT_6,			
		PMT02000: { dialog: true, title: $L("Data Entry"), message: $L("A required field does not exist or is empty"), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT02002: { dialog: true, title: $L("Data Entry"), message: $L("This card type is not supported"), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT02003: { dialog: true, title: $L("Data Entry"), message: $L("This order type is not supported"), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT02005: { dialog: true, title: $L("Data Entry"), message: $L("The State code is incorrect. Try again."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT02006: { dialog: true, title: $L("Data Entry"), message: $L("The Country code is incorrect. Try again."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT02008: { dialog: true, title: $L("Data Entry"), message: $L("The Currency code is incorrect. Try again."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT02010: { dialog: true, title: $L("Data Entry"), message: $L("You must enter valid information in every field."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT02011: { dialog: true, title: $L("Data Entry"), message: $L("You must enter a number in the Credit Card field."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT02012: { dialog: true, title: $L("Data Entry"), message: $L("You must enter a number in the Payment Info ID field."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT02013: { dialog: true, title: $L("Data Entry"), message: $L("You must enter a number in the Quantity field."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT02014: { dialog: true, title: $L("Data Entry"), message: $L("The date in the Expiration Date field must be in the format mmyyyy"), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT02015: { dialog: true, title: $L("Data Entry"), message: $L("The value in the Item Unit Price field is not valid. Enter a number instead."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT02016: { dialog: true, title: $L("Data Entry"), message: $L("The date in the Order Date field must be in the format yyyyMMddHHmmss"), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT02017: { dialog: true, title: $L("Data Entry"), message: $L("Update the Expiration Date information in your account and try again."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT02018: { dialog: true, title: $L("Data Entry"), message: $L("The Zip code is incorrect. Try again."), choices: Utilities.ErrorChoices.simpleOKChoices },
		
		
		PMT03000: { dialog: true, title: $L("Transaction Error"), message: $L("Update your credit card information in Preferences & Accounts and try again."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT03001: Utilities.CommonErrors._PMTGroupErrors.PMT_0,
		PMT03002: { dialog: true, title: $L("Payment Failed"), message: $L("We cannot perform financial transactions in your country."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT03003: Utilities.CommonErrors._PMTGroupErrors.PMT_0,
		PMT03006: { dialog: true, title: $L("Payment Failed"), message: $L("The last transaction failed. Update the payment information in your account and try again."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT03007: { dialog: true, title: $L("Couldn't Update"), message: $L("Credit card information can only be updated after all pending purchases have cleared. Try again after you received receipts for all recent purchases."), choices: Utilities.ErrorChoices.simpleOKChoices },
		
		PMT04000: { dialog: true, title: $L("Payment Failed"), message: $L("Update the Expiration Date information in your account and try again."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT04001: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		PMT04002: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		PMT04004: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		PMT04005: Utilities.CommonErrors._PMTGroupErrors.PMT_2,
		PMT04006: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		PMT04007: { dialog: true, title: $L("Payment Failed"), message: $L("Update the security number and try again."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT04008: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		PMT04009: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		// Per Thieu, PMT04010 is only returned as "data entry" and is not associated with the payment
		PMT04010: { dialog: true, title: $L("Data Entry"), message: $L("Update the payment information in your account and try again. #{errCode}"), choices: Utilities.ErrorChoices.simpleOKChoices},
		PMT04011: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		PMT04012: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		PMT04013: Utilities.CommonErrors._PMTGroupErrors.PMT_3,
		PMT04014: Utilities.CommonErrors._PMTGroupErrors.PMT_3,
		PMT04015: Utilities.CommonErrors._PMTGroupErrors.PMT_4,
		PMT04016: Utilities.CommonErrors._PMTGroupErrors.PMT_2,
		PMT04017: { dialog: true, title: $L("Payment Failed"), message: $L("There is no payment information associated with your HP webOS Account. Tap Preferences in the App Menu to set it up.") , choices: Utilities.ErrorChoices.simpleOKChoices},
		
		PMT04018: Utilities.CommonErrors._PMTGroupErrors.PMT_5,
		PMT04019: Utilities.CommonErrors._PMTGroupErrors.PMT_5,
		PMT04020: Utilities.CommonErrors._PMTGroupErrors.PMT_5,
		PMT04021: { dialog: true, title: $L("Transaction Error"), message: $L("A transaction problem has occurred. Update your credit card information in Preferences & Accounts and try again.") , choices: Utilities.ErrorChoices.simpleOKChoices},
		
		PMT04200: { dialog: true, title: $L("Payment Failed"), message: $L("Update your credit card address information and try again."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT04400: Utilities.CommonErrors._PMTGroupErrors.PMT_3,
		PMT04401: Utilities.CommonErrors._PMTGroupErrors.PMT_3,
		PMT04402: Utilities.CommonErrors._PMTGroupErrors.PMT_4,
		PMT04403: Utilities.CommonErrors._PMTGroupErrors.PMT_2,
		PMT04404: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		PMT04405: Utilities.CommonErrors._PMTGroupErrors.PMT_2,
		PMT04406: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		PMT04407: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		PMT04408: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		PMT04409: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		PMT04410: Utilities.CommonErrors._PMTGroupErrors.PMT_2,
		PMT04411: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		PMT04412: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		PMT04413: Utilities.CommonErrors._PMTGroupErrors.PMT_2,
		PMT04414: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		PMT04415: { dialog: true, title: $L("Transaction Error"), message: $L("There is a problem with the credit card. Enter a different credit card in Preferences & Accounts and try again. PMT04415") , choices: Utilities.ErrorChoices.simpleOKChoices},
		PMT04416: { dialog: true, title: $L("Transaction Error"), message: $L("There may be a problem with the credit card. Enter a different credit card in Preferences & Accounts and try again. PMT04416") , choices: Utilities.ErrorChoices.simpleOKChoices},
		PMT04417: { dialog: true, title: $L("Transaction Error"), message: $L("There is a problem with the credit card. Enter a different credit card in Preferences & Accounts and try again. PMT04417") , choices: Utilities.ErrorChoices.simpleOKChoices},
		
		//DAV failures
	    PMT04600: Utilities.CommonErrors._PMTGroupErrors.PMT_7,
        PMT04601: Utilities.CommonErrors._PMTGroupErrors.PMT_7,
        PMT04602: Utilities.CommonErrors._PMTGroupErrors.PMT_7,
        PMT04603: Utilities.CommonErrors._PMTGroupErrors.PMT_7,
        PMT04604: Utilities.CommonErrors._PMTGroupErrors.PMT_7,
        PMT04605: Utilities.CommonErrors._PMTGroupErrors.PMT_7,
        PMT04606: Utilities.CommonErrors._PMTGroupErrors.PMT_7,
        PMT04607: Utilities.CommonErrors._PMTGroupErrors.PMT_7,
        PMT04608: Utilities.CommonErrors._PMTGroupErrors.PMT_7,
        PMT04609: Utilities.CommonErrors._PMTGroupErrors.PMT_7,
        PMT04610: Utilities.CommonErrors._PMTGroupErrors.PMT_7,
        PMT04611: Utilities.CommonErrors._PMTGroupErrors.PMT_7,
        PMT04612: Utilities.CommonErrors._PMTGroupErrors.PMT_7,
		
        // Payment Promo Code failure
        PMTPROMO70010: {dialog: true, title: $L("Promo Code"), message: $L("Invalid, unavailable or expired promo code, try to use previous saved code or manually input valid code."), choices: [{ label: $L("OK"), value: true, type: 'dismiss'}]},
        
		//DPL failure
		PMT04800: Utilities.CommonErrors._PMTGroupErrors.PMT_6,
		
		// Operator Billing
		
		PMT03027: { dialog: true, title: $L("Updating or removing account is not allowed because there are still pending orders using this account"), message: $L("Your account cannot be updated at this time. Please try again later."), choices: Utilities.ErrorChoices.simpleOKChoices, failoverNotAllowed: true },
		
		PMT03028: Utilities.CommonErrors.OBCarrierNotSupported,

		PMT03031: { dialog: true, title: $L("Order not accepted because there is a pending order for the same item"), message: $L("This item is already in the process of being purchased. Please wait for the transaction to complete."), choices: Utilities.ErrorChoices.simpleOKChoices, failoverNotAllowed: true },

		PMT03037: { dialog: true, title: $L("Item already purchased"), message: $L("This item has already been purchased. Your account won't be charged again."), choices: Utilities.ErrorChoices.simpleOKChoices, failoverNotAllowed: true },
	
		PMT05205: { dialog: true, title: $L("Transaction failed"), message: $L("This item's price exceeds your spending limit. Please pay with a credit card."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT05206: { dialog: true, title: $L("Transaction failed"), message: $L("Your #{carrierName} account's settings do not allow you to purchase items with your #{carrierName} account. Please pay with a credit card."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT05208: { dialog: true, title: $L("Transaction failed"), message: $L("You do not have an active account with #{carrierName}. Try paying with a credit card."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT05210: { dialog: true, title: $L("Wireless subscriber has run out of prepaid credits"), message: $L("This item's price exceeds your carrier account balance. Please pay with a credit card."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT05213: { dialog: true, title: $L("Carrier not supported"), message: $L("#{carrierName} does not support payments. Please pay with a credit card."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT05215: Utilities.CommonErrors.OBCarrierNotSupported,
		PMT05216: { dialog: true, title: $L("Transaction failed"), message: $L("You do not have an active account with #{carrierName}. Try paying with a credit card."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT05217: Utilities.CommonErrors.OBCarrierNotSupported,
		PMT05204: { dialog: true, title: $L("Transaction failed"), message: $L("You do not have an active account with #{carrierName}. Try paying with a credit card."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT05211: { dialog: true, title: $L("Wireless subscriber not eligible for premium billing"), message: $L("#{carrierName} does not allow you to purchase items using with your #{carrierName} account. Please pay with a credit card."), choices: Utilities.ErrorChoices.simpleOKChoices },
		PMT05212: { dialog: true, title: $L("Transaction failed"), message: $L("You do not have an active account with #{carrierName}. Try paying with a credit card."), choices: Utilities.ErrorChoices.simpleOKChoices },
		
		"inprogress": { dialog: true, title: $L("Transaction in Progress"), message: $L("The transaction is still being processed. Try to download the app in a few minutes. You will not be charged again."), choices: Utilities.ErrorChoices.simpleOKChoices, failoverNotAllowed: true },

		"nowan": { dialog: true, title: $L("No Carrier Data Connection"), message: $L("You must be connected to #{carrierName} to pay with your carrier account. Connect and try again. Or, pay with credit card."), choices: Utilities.ErrorChoices.simpleOKChoices},

		
		//Mod10 failure
		PMT02019: { dialog: true, title: $L("Card validation"), message: $L("Please verify that the credit card number and payment type are set correctly."), choices: Utilities.ErrorChoices.simpleOKChoices },
		
		PMT51004: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		PMT51005: Utilities.CommonErrors._PMTGroupErrors.PMT_1,
		
		LOCL0001: { dialog: true, title: $L("Data Entry"), message: $L("The address is incomplete. Verify that you’ve entered your complete address."), choices: Utilities.ErrorChoices.simpleOKChoices },
		LOCL0002: { dialog: true, title: $L("Data Entry"), message: $L("The payment information is incomplete. Verify that you’ve entered your payment information completely.") , choices: Utilities.ErrorChoices.simpleOKChoices},
		LOCL0003: { dialog: true, title: $L("Data Entry"), message: $L("Please only enter numbers (0-9) in the account number."), choices: Utilities.ErrorChoices.simpleOKChoices },
		LOCL0004: { dialog: true, title: $L("Data Entry"), message: $L("Choose a card type."), choices: Utilities.ErrorChoices.simpleOKChoices },
		LOCL0005: { dialog: true, title: $L("Data Entry"), message: $L("You must enter a phone number in the Phone Number field."), choices: Utilities.ErrorChoices.simpleOKChoices },
		LOCL0006: { dialog: true, title: $L("Data Entry"), message: $L("Verify your billing information. It is incomplete."), choices: Utilities.ErrorChoices.simpleOKChoices },
		LOCL0007: { dialog: true, title: $L("Data Entry"), message: $L("Verify your account information. It is incomplete or incorrect."), choices: Utilities.ErrorChoices.simpleOKChoices },
		LOC02020: { dialog: true, title: $L("Data Entry"), message: $L("The first name is too long (must be less than 60 characters). Try again."), choices: Utilities.ErrorChoices.simpleOKChoices },
		LOC02021: { dialog: true, title: $L("Data Entry"), message: $L("The last name is too long (must be less than 60 characters). Try again."), choices: Utilities.ErrorChoices.simpleOKChoices },
		LOC02018: { dialog: true, title: $L("Data Entry"), message: $L("The Zip code is incorrect. Try again."), choices: Utilities.ErrorChoices.simpleOKChoices },
		LOC02019: { dialog: true, title: $L("Data Entry"), message: $L("The Postal code is incorrect. Try again."), choices: Utilities.ErrorChoices.simpleOKChoices },
		// ValidateInstallSpace errors
		//
		// only one - "catch all" case for one and multiple apps case
		"validate_space_default_single": {dialog: true, title: $L("Can't Install"), message: $L("This app requires #{installSize}. You must delete some apps or files before you can install it. Click Help for more information.") , choices:[{label: $L("Help"), value: "help", type: 'primary'}, {label: $L("OK"), value: "ok", type: 'secondary'}]},
		"validate_space_default_mult": {dialog: true, title: $L("Can't Install"), message: $L("#{installSize} is required to install everything. You can install apps one at a time, or delete apps or files to make room. Click Help for more information.") , choices:[{label: $L("Help"), value: "help", type: 'primary'}, {label: $L("OK"), value: "ok", type: 'secondary'}]},
		
		
		// install errors
		//
		"install_revert_failed" : { dialog: true, title: $L("Can't Restore"), message: $L("The original version couldn't be installed because there is not enough space. Delete some apps or files and try again."), choices: [{ label: $L("OK"), value: true, type: 'dismiss' }] },
		"install_revert_default": {dialog: true, title: $L("Couldn't Install"), message: $L("The #{title} update can not be installed and current version is unusable. Please restore the original version."), choices:[{label: $L("Restore Now"), value: "revert", type: 'primary'}]},
		"install_default": {dialog: true, title: $L("Couldn't Install"), message: $L("There was a problem installing the application"), choices:[{label: $L("Try Again"), value: "retry", type: 'primary'}, {label: $L("Don't Install"), value: "cancel", type: 'secondary'}]},
		"FAILED_NOT_ENOUGH_TEMP_SPACE": {dialog: true, title: $L("Couldn't Install"), message: $L("This app requires #{installSize}. You must delete some apps or files before you can install it. Click Help for more information.") , choices:[{label: $L("Help"), value: "help", type: 'primary'}, {label: $L("OK"), value: "cancel", type: 'secondary'}]},
		"FAILED_NOT_ENOUGH_INSTALL_SPACE": {dialog: true, title: $L("Couldn't Install"), message: $L("This app requires #{installSize}. You must delete some apps or files before you can install it. Click Help for more information.") , choices:[{label: $L("Help"), value: "help", type: 'primary'}, {label: $L("OK"), value: "cancel", type: 'secondary'}]},
		
		// below errors fall into default case
		// FAILED_PACKAGEFILE_NOT_FOUND, FAILED_PACKAGEFILE_CORRUPT, FAILED_CREATE_TMP, FAILED_VERIFY, FAILED_IPKG_INSTALL
	
	
		// Download errors that can be returned when response.completed == false
		// contains a lot of HTTP errors as well like 404
		//
		"download_default": {dialog: true, title: $L("Download Error"), message: $L("There was a problem downloading the application."), choices:[{label: $L("Try Again"), value: "retry", type: 'primary'}, {label: $L("Don't Download"), value: "cancel", type: 'secondary'}]},
		"-3": {dialog: true, title: $L("Download Error"), message: $L("The download file is missing or damaged."), choices:[{label: $L("Try Again"), value: "retry", type: 'primary'}, {label: $L("Don't Download"), value: "cancel", type: 'secondary'}]},
		"-2": {dialog: true, title: $L("Download Error"), message: $L("The download file is missing or damaged."), choices:[{label: $L("Try Again"), value: "retry", type: 'primary'}, {label: $L("Don't Download"), value: "cancel", type: 'secondary'}]}
	}
};
/* Copyright 2009 Palm, Inc.  All rights reserved. */

var Utilities = Utilities || {};

Utilities.UTCDate = new (Class.create({
	
	parse: function(date)
	{
		var d = new Date();
		d.setUTCFullYear(date.substring(0, 4) - 0, date.substring(5, 7) - 1, date.substring(8, 10) - 0);
		d.setUTCHours(date.substring(11, 13));
		d.setUTCMinutes(date.substring(14, 16));
		return d;
	},
	
	shortDate: function(d)
	{
		return "" + d.getUTCFullYear() + (d.getUTCMonth() + 1).toPaddedString(2) + d.getUTCDate().toPaddedString(2) + d.getUTCHours().toPaddedString(2) + d.getUTCMinutes().toPaddedString(2) + d.getUTCSeconds().toPaddedString(2);
	}
	
}))();
/* Copyright 2009 Palm, Inc.  All rights reserved. */

var Utilities = Utilities || {};

Utilities.VersionCheck = 
{
	/*
	 * This matches the Java version on the server.
	 * Return 0 is equal, NEG if s1 < s2, POS if s1 > s2
	 */
	compare: function(s1, s2)
	{
		if (s1 == null && s2 == null)
		{
			return 0;
		}
		else if (s1 == null) 
		{
			return -1;
		}
		else if (s2 == null)
		{
			return 1;
		}
		
		var a1 = (''+s1).split(/[^a-zA-Z0-9]+/);
		var a2 = (''+s2).split(/[^a-zA-Z0-9]+/);
		var max = Math.min(a1.length, a2.length);
		
		for (var ii = 0; ii <= max; ii++) 
		{
			if (ii == a1.length)
			{
				return (ii == a2.length ? 0 : -1);
			}
			else if (ii == a2.length)
			{
				return 1;
			}
			var i1 = this._parseInt(a1[ii]);
			var i2 = this._parseInt(a2[ii]);
			if (i1 != i2)
			{
				var r = i1 - i2;
				return r < 0 ? -1 : r > 0 ? 1 : 0;
			}
			i1 = a1[ii].toLowerCase();
			i2 = a2[ii].toLowerCase();
			if (i1 < i2)
			{
				return -1;
			}
			else if (i1 > i2)
			{
				return 1;
			}
		}
		return 0;
	},
	
	_parseInt: function(str)
	{
		if (str.search(/[^\D]/))
		{
			return null;
		}
		else
		{
			return parseInt(str, 10);
		}
	}
};
/* Copyright 2009 Palm, Inc.  All rights reserved. */

var LazyLoadImage = Class.create(
{
	initialize: function(url, target)
	{
		var img = document.createElement('img');
		img.onload = function()
		{
			this.onload = undefined; // Remove the listener (in case of GC broken-ness)
			target.style.backgroundImage = 'url(' + this.src + ')';
		};
		img.src = url;
	}
});
var Utilities = Utilities || {};

Utilities.Common = {
	
	handleCommand: function(event, app)
	{
 		if (event.type == Mojo.Event.command && event.command == 'email') 
 		{
 			var url = this._generateAppURL(app);
			if (url)
			{
				var params = 
				{
					summary: $L("Check out this HP webOS app"),
					text: this._generateEmailMessageText(app, url)
				}
				Weave.Services.ApplicationManager.launchApplication("com.palm.app.email", params);
			}
 		}
 		else if(event.type == Mojo.Event.command && event.command == 'text')
 		{
 			var url = this._generateAppURL(app);
			if (url)
			{
				var params = {
					messageText: this._generateSMSMessageText(app, url)
				}
				Weave.Services.ApplicationManager.launchApplication("com.palm.app.messaging", params)
			}
 		}
 	},
	
	_generateAppURL: function(app) 
	{
		var details = app.getDetails();
 		if (details && details.publicApplicationId && details.id) 
		{
			return "http://developer.palm.com/appredirect/?packageid=" + details.publicApplicationId + "&applicationid=" + details.id;
 		}
 		else 
		{
 			return null;
 		}
 	},
	
	_generateEmailMessageText: function(app, url) 
	{
		var details = app.getDetails();
		var shareData = {appURL: url};
		if (details && details.title)
		{
 			shareData.title = details.title;
		} 
		else
		{
 			shareData.title = url;
 		}
		return Mojo.View.render({object:shareData, template:'comments/share-template'});
	},
	
	_generateSMSMessageText: function(app, url)
	{
		var appTitle = url;
		var details = app.getDetails();
		if (details && details.title)
		{
 			appTitle = details.title;
		}
		
		return $L("Check out #{title}: #{url}").interpolate({title: appTitle, url: url});
	},
	
	doEmbargoCheck:function(edit, callback)
	{
		Mojo.Log.info("_doEmbargoCheck, profile address%s , embargoed", myProfile.email, myProfile.isEmbargoed);
		if (myProfile.isEmbargoed !== undefined) {
			this._handleEmbargoAcc(edit, callback);
		}
		else {
			var ext = myProfile.email.substring(myProfile.email.lastIndexOf(".") + 1);
			
			if (AppAssistant.embargoedList) {
				myProfile.isEmbargoed = AppAssistant.embargoedList.indexOf(ext) != -1;
				Mojo.Log.info("_doEmbargoCheck, isEmbargoed%s", myProfile.isEmbargoed);
				this._handleEmbargoAcc(edit, callback);
			}
			else {
				
				var self = this;
				Weave.Services.PaymentServer.getEmbargoedEmailExtensions(function(status, response){
					Mojo.Log.info("getEmbargoedCountryList %j", response);
					if (status) {
						AppAssistant.embargoedList = response.OutGetEmbargoedEmailExtensions.embargoedEmailExtensions;
						myProfile.isEmbargoed = AppAssistant.embargoedList.indexOf(ext) != -1;
						self._handleEmbargoAcc(edit, callback);
					}
					else {
						var err = response.errorCode ? response.errorCode : response;
						Utilities.Errors.displayError(err, {
							errCode: err
						}, "PMT_catchAll");
					}
				});
			}
		}
	},
	
	_handleEmbargoAcc: function(edit, callback)
	{
		var self = this;
		if (!edit && myProfile.isEmbargoed) 
		{
			Mojo.Log.info("PrefsAssistant, Email address Embargoed %s**",myProfile.email);
			Utilities.Errors.displayError("PMT_cant_download", {}, "PMT_cant_download", null, null, function(value)
			{
				if (value == 'help') 
				{
					Weave.Services.ConnectionManager.getStatus(function(online)
					{
						Weave.Services.ApplicationManager.openApplication('com.palm.app.help', 
						{
							target: online ? 'http://help.palm.com/app_catalog/appcatalog_download_error.html' : 'no-network'
						});
					});
				
				}
			});
		}
		else 
		{
			Mojo.Log.info("not embargoed***");
			callback(edit);
		}	
	},
	
	capWords: function(word){
   		var words = word.split(" "); 
   		for (var i=0 ; i < words.length ; i++){ 
      		words[i] = words[i].capitalize(); 
   		} 
   		return words.join(" "); 
	},
	
	filterSpace: function(value) {
		if(value === Mojo.Char.spaceBar) {
			return false;
		}			
		return true;
	},
	
	//check whether JSON object is empty
	isEmpty: function(jsonObj){
		for(prop in jsonObj){
			return false;
		}
		return true;
	},
	
	// Date formatter and timezone localization, for example: "20101230122331" --> "Dec 30, 2010"
	formatDateStr: function(dateRawStr) {
		if(!dateRawStr || dateRawStr.length<8) {
			return "";
		}
		
		var year = dateRawStr.substr(0,4);
		var month = dateRawStr.substr(4,2);
		var day = dateRawStr.substr(6,2);
		var hour = dateRawStr.substr(8,2);
		var min = dateRawStr.substr(10,2);
		var sec = dateRawStr.substr(12,2)
		var dateObj = new Date(year, month-1, day, hour, min, sec);
		var dateObjTime = dateObj.getTime();
		
		// change to local timezone
		var clDate = new Date();
		localOffset = clDate.getTimezoneOffset() * 60000;
		var ld = new Date(dateObjTime - localOffset);
		
		return Mojo.Format.formatDate(ld, $L("MMM d, yyyy"));
	}
};
/* Copyright 2009 Palm, Inc.  All rights reserved. */

if (window == window.top) 
{
	var Weave = Weave || {};
	
	(function()
	{
		function load(config)
		{
			for (var prefix in config) 
			{
				if (prefix) 
				{
					Weave[prefix.charAt(0).toUpperCase() + prefix.substring(1)] = {};
				}
			}
		}
		
		load(
		{
			system:		['activator'],
			services:	['services', 'accountservices', 'applicationinstaller', 'applicationmanager', 'catalogserver', 'applicationserver', 'browser', 'connectionmanager', 
						 'deviceprofile', 'appinstallservice', 'systemmanager', 'systemproperties', 'paymentserver'],
			utilities:	['regexp', 'appmenu', 'appversions', 'appcategorieshelper'],
			download:	['downloadstates', 'appdetails', 'appdownload', 'appdownloadmanager']
		});
		
	})();
}/**
 * The Activator manage the dispatch of incoming launch commands.
 * 'Interfaces' (literals of functions) are attached to the Activator
 * together with the interface name and the target stage.  Then a command
 * is 'run', the format of the arguments is used to locate the relevant interface,
 * launch the stage if necessary, and dispatch the contains arguments to the
 * methods named in the parameters.  The command format is:
 *   { interfacename: { methodname: { ... arguments .... } }
 * If no parameters are present, then the 'main' interface is called.  If the
 * stage is created, it calls the 'start' method, if not it calls the 'restart'
 * method.
 
Copyright 2009 Palm, Inc.  All rights reserved.

*/
Weave.System.Activator = 
{	
	_inames: {},
	
	addInterface: function(name, iface)
	{
		this._inames[name] = iface;
	},
	
	run: function(params)
	{
		// there is only one param
		var self = this;
		var done = false;
		for (var k in params) 
		{
			// this runs only once
			iface = this._inames[k];
			if (iface)
			{
				iface.init(params[k]);
				done = true;
			}
		}
		if(!done){
			iface = this._inames["main"];
			if (iface)
			{
				iface.init("");
				done = true;
			}
		}
	},
	
	open: function(stageName, stageAssistantName, callback)
	{
		Mojo.Log.info("Activator.open stage ", stageName, stageAssistantName);
		if (stageName == null) 
		{
			callback && callback(null);
		}
		else 
		{
			var stage = Mojo.Controller.appController.getStageController(stageName);
			if (stage) 
			{
				callback && callback(stage.assistant);
				//bring stage to focus if existing stage
				stage.activate();
			}
			else 
			{
				var self = this;
				Mojo.Controller.appController.createStageWithCallback(
				{
					lightweight: true,
					name: stageName,
					assistantName: stageAssistantName
				}, 
				function(stage)
				{
					Mojo.Log.info("Activator.open stageAssistant: %s callback ", stage.assistant.stageName);	
					callback && callback(stage.assistant);
				});
			}
		}
	},
	
	close: function(name)
	{
		Mojo.Controller.appController.closeStage(name);
	},
	
	// returns active stage controller that is not dashboard
	getActiveStageController: function(tryDefault)
	{
		var stage = Mojo.Controller.appController.getActiveStageController();
		if (!stage && tryDefault)
		{
			stage = Mojo.Controller.appController.getStageController("default");
		}
		
		return stage;
	}
};
/**
 * Services provides a basic garbage-collector safe wrapper round the standard service 
 * requests.
 
Copyright 2009 Palm, Inc.  All rights reserved.

*/
Object.extend(Weave.Services,
{	
	_pending: {},
	_next: 1,
	
	request: function(target, args, success, failure)
	{
		var id = this._next++;
		var pending = this._pending;
		args.onSuccess = function(response)
		{
			delete pending[id];
			success && success(response);
		};
		args.onFailure = function(response)
		{
			delete pending[id];
			failure && failure(response);
		};
		pending[id] = new Mojo.Service.Request(target, args);
		return pending[id];
	},
	
	subscriptionRequest: function(target, args, success, failure)
	{
		var id = this._next++;
		var pending = this._pending;
		args.onSuccess = function(response)
		{
			success && success(response);
		};
		args.onFailure = function(response)
		{
			failure && failure(response);
		};
		args.parameters = Object.extend(args.parameters || {}, {subscribe: true});
		
		pending[id] = new Mojo.Service.Request(target, args);
		return pending[id];
	},
	
	
	// called on application cleanup to delete any
	// pending requests
	cleanup: function()
	{
		
	}
	
});
/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.AccountServices = 
{
	_target: 'palm://com.palm.accountservices',
	
	getServerUrl: function(callback)
	{
		Weave.Services.request(this._target,
		{
			method: 'getServerUrl',
			parameters: {}
		},
		function(response)
		{
			callback(true, response.serverUrl);
		},
		function()
		{
			callback(false);
		});
	},
	
	getPaymentServerUrl: function(callback)
	{
		/*
		 * e.g. http://148.92.248.80:8080/palmcsext/services/deviceJ/getPreferences
		 * Request : {"InPreferences":{"preferenceKey":"APPLICATIONS,PAYMENT"}}
		 * Response: {"OutParameterInfo":{"parameterInfos":{"category":"SETTINGS","key":"PAYMENT_URL","value":"http:\/\/148.192.248.80:8080\/palmcspmtext\/services\/paymentJ\/"},"size":1}}
		 */
		Weave.Services.request(this._target,
		{
			method: 'getPreferences',
			parameters: 
			{
				appName: "PAYMENT"
			}
		},
		function(response)
		{
			callback(true, response.parameterInfos.value);
		},
		function()
		{
			callback(false);
		});
	},

  getGoogleAnalyticsWebPropertyID: function(callback)
  {
		Weave.Services.request(this._target,
		{
			method: 'getPreferences',
			parameters: 
			{
				appName: ["APP_DISCO"]
			}
		},
    function(response)
    {
      // we default to appInfo.gaAccount
      var propertyID = Mojo.appInfo.gaAccount;

      // looking for the right setting
      for(var i = 0 ; i < response.size ; i++) 
      {
        if(response.parameterInfos[i]["key"] == "GOOGLE_ANALYTICS_WPID")
          propertyID = response.parameterInfos[i]["value"];
      }
      callback(true, propertyID);
    },
    function()
    {
      callback(false);
    });
  },
	
	getAccountToken: function(callback)
	{
		Mojo.Log.info("**** Trying to get Account Token");
		Weave.Services.request(this._target,
		{
			method: 'getAccountToken',
			parameters: {}
		},
		function(response)
		{
			Mojo.Log.info("**** Got account token %j", response);
			callback(true, response.token, response.accountAlias, response.accountState);
		},
		function(response)
		{
			Mojo.Log.error("**** error in obtaining token %j", response);
			callback(false);
		});
	},
	
	notifyAuthenticationFailure: function(callback)
	{
		// This request gets no rely - so send it and invoke the callback immediately
		Weave.Services.request(this._target,
		{
			method: 'notifyAuthenticationFailure',
			parameters: {
				trustedApp: true
			}
		});
		callback(true);
	},
	
	notifyUninstalledApplication: function(name, version, callback)
	{
		Weave.Services.request(this._target,
		{
			method: 'notifyUninstalledApplication',
			parameters: {
				name: name,
				version: version
			}
		},
		function()
		{
			callback(true);
		},
		function()
		{
			callback(false);
		});
	},
	
	getAccountInfo: function(callback) 
	{
		// Possible to use the Weave.Services.request instead of a serviceRequest?
		Mojo.Log.info("** Getting account info");
		Weave.Services.request(this._target, 	
		{
			method: 'getAccountInfo',
			parameters:{}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	updateAccountInfo: function(myProfile, callback) 
	{
		Weave.Services.request(this._target, 
		{
			method: 'updateAccountInfo',
			parameters: 
			{
				'firstName': myProfile.firstName, 
				'lastName':myProfile.lastName,
				'password':myProfile.password, 
				'email':myProfile.email,
				'languageCode':myProfile.languageCode,
				'countryCode': myProfile.countryCode 
			}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	isUserValid: function(email, password, deviceId, callback) 
	{
		Weave.Services.request(this._target,
		{
			method:"isUserValid",
			parameters: 
			{
				'email':email, 
				'password':password, 
				"deviceId":deviceId
			}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	getLocale: function(callback) 
	{
		Weave.Services.request('palm://com.palm.systemservice', 
		{
			method: 'getPreferences',
			parameters: 
			{
				"keys":["locale"]
			}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	getAllSecurityQuestions: function(userLocale, callback) 
	{
		Weave.Services.request(this._target,
		{
			method:"getAllSecurityQuestions",
			parameters: {subscribe: false, locale:userLocale}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	getAccountSecurityQuestions: function(email, locale, callback) 
	{
		Weave.Services.request(this._target,
		{
			method:"getAccountSecurityQuestion",
			parameters: {"email": email, "locale":locale}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});		
	},
	
	resendVerificationEmail: function(callback) 
	{
		Weave.Services.request(this._target,
		{
			method:"requestResendVerificationEmail",
			parameters: {}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	requestPasswordResetEmail: function(emailAddress, callback)
	{
		Weave.Services.request(this._target,
		{
			method:"requestPasswordResetEmail",
			parameters: 
			{
				"email": emailAddress, "subscribe": false
			}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	authenticateAccountFromSecurityQuestion: function(email, questionId, response, callback) 
	{
		Weave.Services.request(this._target,
		{
			method:"authenticateAccountFromSecurityQuestion",
			parameters: {'email':email, 'questionId':questionId, 'response':response}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	changeEmail: function(email, callback) 
	{
		Weave.Services.request(this._target, 
		{
			method: 'changeEmail',
			parameters: {"email": email}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	changePassword: function(newPassword, questionId, answer, idToken, isResetPassword, callback) 
	{
		Weave.Services.request(this._target,
		{
			method:"changePassword",
  			parameters: {"newPassword": newPassword, "questionId":questionId, "answer":answer, "idToken":idToken, "isResetPassword":isResetPassword}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	authenticateAccount: function(email, password, callback) 
	{
		Weave.Services.request(this._target,
		{
			method:"authenticateAccount",
 			parameters: {'email':email, 'password':password, 'application':'ASClient'}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});			
	},
	isEmailAvailable: function(email, callback) 
	{		
		Weave.Services.request(this._target,
		{
			method:"isEmailAvailable",
 			parameters: {'email':email}
		},
		function(response)
		{
			Mojo.Log.info("response:" + Object.toJSON(response));
			callback(true, response);
		}
		);			
	}
};

/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.ApplicationInstaller = 
{
	_target: 'palm://com.palm.appinstaller',
	
	validateInstall: function(appid, size, uncomprSize, callback)
	{
		uncomprSize = (uncomprSize && uncomprSize != 0) ? Math.ceil(uncomprSize/1024): undefined;
		size = Math.ceil(size/1024);
		Mojo.Log.info("Weave.Services.ApplicationInstaller.validateInstall appid %s, size %s, uncomprSize %d", appid,size,uncomprSize );
		var self = this;
		this._pendingreq = Weave.Services.request(self._target, 
		{
			method: 'queryInstallCapacity',
			parameters: 
			{
				appId: appid,
				size: size,
				uncompressedSize: uncomprSize
			}
		},
		function(response)
		{
			if (response.result == 0 || response.result == 4  || PalmSystem.version.match("desktop")) 
			{
				callback(true);
			}
			else
			{
				Mojo.Log.error("Weave.Services.ApplicationInstaller.validateInstall failed %j", response);
				callback(false, response);
			}
		},
		function(response)
		{
			Mojo.Log.error("Weave.Services.ApplicationInstaller.validateInstall failed %j", response);
			callback(false);
		});
	}
	
	/*installNoVerify: function(app, callback)
	{
		var state;
		Mojo.Log.info("Weave.Services.AppInstaller.installNoVerify payload %s, %s", app.id, app.ipkgUrl);
		var request = Weave.Services.subscriptionRequest(this._target, 
		{
			method: 'installNoVerify',
			parameters: {"target": app.ipkgUrl}
		},
		function(response)
		{
			Mojo.Log.info("Weave.Services.AppInstallService.install response %s,  %j", app.id, response);
			if(response.status){
				if (response.status === "STARTING") {
					state = "installing"
				}
				else 
					if (response.status === "SUCCESS") {
						state = "installed"
						request.cancel();
					}
					else if (response.status.indexOf("FAILED") >= 0) {
						state = "install failed"
						request.cancel();
					}
				
				callback(true, {"state": state});
			}
		},
		function(response)
		{
			Mojo.Log.error("Weave.Services.AppInstallService.install failed %s, %j", app.id, response);
			request.cancel();
			callback(false, response);
			
		});
			
	}*/
	
};
/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.ApplicationManager =
{	
	_target: 'palm://com.palm.applicationManager',
	
	getInstalledApplications: function(callback)
	{
		Weave.Services.request(this._target, 
		{
			method: 'listApps',
			parameters: {}
		},
		function(response)
		{
			//Mojo.Log.info("GET INSTALLED APPLICATIONS %j", response);
			var apps = response.apps;
			callback(true, !apps ? [] : Object.isArray(apps) ? apps : [ apps ]);
		},
		function()
		{
			callback(false);
		});
	},
	getInstalledApplications_V2: function(callback)
	{
		Weave.Services.request(this._target, 
		{
			method: 'listPackages',
			parameters: {}
		},
		function(response)
		{
			Mojo.Log.info("GET INSTALLED APPLICATIONS %j", response);
			var packages = response.packages;
			callback(true, !packages ? [] : Object.isArray(packages) ? packages : [ packages ]);
		},
		function()
		{
			callback(false);
		});
	},
	
	openApplication: function(name, passedParams, launchinnewgroup)
	{
		var appParams  = passedParams
		if(!appParams)
			appParams = {};
		appParams.launchinnewgroup = launchinnewgroup
		
		var params = {
				id: name,
				params: appParams
			};
		Mojo.Log.info("Open App params %j", params);
		Weave.Services.request(this._target, 
		{
			method: 'open',
			parameters: params
			
		});
	},

	launchApplication: function(name, params)
	{
		Weave.Services.request(this._target, 
		{
			method: 'launch',
			parameters: 
			{
				id: name,
				params: params
			}
		});
	},
	
	launchPointChanges: function(callback)
	{
		Weave.Services.subscriptionRequest(this._target, 
		{
			method: 'launchPointChanges'
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	}
	
	/*
	getSizeOfApps: function(apps, callback)
	{
		Weave.Services.request(this._target, 
		{
			method: 'getSizeOfApps',
			parameters: 
			{
				appIds : apps
			}
		},
		function(response)
		{
			var total = 0;
			for (var x in response)
			{
				if (x != "subscribed" && x != "returnValue")
				{
					Mojo.Log.error("response X: ", response[x]);
					total += response[x];
				}
			}
			callback(total);
		},
		function()
		{
			Mojo.Log.info("getSizeOfApps failed");
		});
	},
	*/
};
/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.CatalogServer = Class.create(
{
	_defaultRetries: 3,
	_defaultCallTimeout: 20.0,
	
	$whenReadyServerUrl: function(callback)
	{
		if (this._serverUrl) 
		{
			callback();
		}
		else 
		{
			// We need the server url and the carrier info
			var self = this;
			Weave.Services.AccountServices.getServerUrl(function(status, url)
			{
				self._serverUrl = status ? url : 'error:///';
				callback();
			});
		}
	},
	
	$whenReadyServerUrlCarrier: function(callback)
	{
		if (this._serverUrl && this._carrier) 
		{
			callback();
		}
		else 
		{
			// We need the server url and the carrier info
			var self = this;
			this.$whenReadyServerUrl(function()
			{
				self._carrier && callback();
			});
			this._carrier || Weave.Services.Preferences.SystemProperties.getCarrier(function(status, carrier)
			{
				self._carrier = status ? carrier : 'ROW';
				self._serverUrl && callback();
			});
		}
	},
	
	_whenReadySecurityToken: function(callback)
	{
		var self = this;
		var calledCallback = undefined;
		function ready()
		{		
			return (self._token != undefined && self._deviceid != undefined && self._email != undefined && self._carrier != undefined) ;
		};
		if (ready())
		{
			calledCallback = true;
			callback();
		}
		else 
		{
			this._token || Weave.Services.AccountServices.getAccountToken(function(status, token, email)
			{
				Mojo.Log.info("Token:", status, token);
				self._token = status ? token : 'ERROR';
				self._email = status ? email : 'ERROR';
				if (ready() && !calledCallback) 
				{
					calledCallback = true;
					callback();
				}
			});
			this._deviceid || Weave.Services.DeviceProfile.getDeviceId(function(status, id)
			{
				Mojo.Log.info("DeviceId:", id);
				self._deviceid = status ? id : 'ERROR';
				if (ready() && !calledCallback) 
				{
					calledCallback = true;
					callback();
				}
			});
			this._carrier || Weave.Services.Preferences.SystemProperties.getCarrier(function(status, carrier)
			{
				Mojo.Log.info("Carrier:", carrier);
				self._carrier = status ? carrier : 'ROW';
				if (ready() && !calledCallback) 
				{
					calledCallback = true;
					callback();
				}
			});
		}
	},
	
	getSecurityToken: function(callback)
	{
		var self = this;
		this._whenReadySecurityToken(function()
		{
			callback(
				{
					token: self._token,
					deviceId: self._deviceid,
					email: self._email,
					carrier: self._carrier
				}
			);
		});
	},
	
	invalidateSecurityToken: function()
	{
		delete this._token;
	},
        _isDownForMaintenance: function(response) {
            var maintenanceMode = response.getHeader("X-Palm-AppCat-Maintenance-Mode"),
                maintenanceCode = response.getHeader("X-Palm-AppCat-Maintenance-Code");

            if (maintenanceMode !== null && parseInt(maintenanceMode, 10) === 1) {
                if (maintenanceCode === null || maintenanceCode === '') {
                    //In maint mode but no code given.  Default to generic error.
                    maintenanceCode = 'DISC9999';
                }
                return maintenanceCode;
            } else {
                return false;
            }
        },
	
	_callServer: function(path, body, callback, retries)
	{
		//Mojo.Log.info("_callServer %s %s %j", this._serverUrl, path, body);
		retries = (retries == undefined ? this._defaultRetries : retries);
		var self = this;
		this.$whenReadyServerUrl(function()
		{
			Mojo.Log.info("ServerURL ready");
			var timeout = 0;
			var id = Weave.Services.ConnectionManager.waitForOffline(function()
			{
				if (!timeout++) 
				{
					Mojo.Log.info("Offline");
					callback(false, 'offline'); // do not localize
				}
			});
			if (id) 
			{
				Mojo.Log.info("Ajax.Request");
				new Ajax.Request(self._serverUrl + path, 
				{
					method: 'POST',
					contentType: 'application/json',
					postBody: Object.toJSON(body),
					evalJSON: 'force',
					onSuccess: function(response)
					{
						if (!timeout++) 
						{
							//Mojo.Log.info("onSuccess %j", response);
							response = response.responseJSON;
							if (!response) 
							{
								callback(true); // Empty replies are okay
							}
							else 
							{
								var exception = response.JSONException;
								if (exception) 
								{
									Mojo.Log.error("CatalogServer._callServer %j", exception);
									callback(false, 'jsonexception', exception);
								}
								else 
								{
									callback(true, response);
								}
							}
						}
					},
					onFailure: function(response)
					{
						if (!timeout++) 
						{
							Mojo.Log.info("onFailure %j", response);
							if (retries < 1) 
							{
								if (response.responseJSON && response.responseJSON.JSONException) 
								{
									callback(false, 'jsonexception', response.responseJSON.JSONException);
								}
								else 
								{
									callback(false, 'failure', response.status); // do not localize
								}
							}
							else 
							{
								self._callServer(path, body, callback, retries - 1);
							}
						}
					},
					on0: function(response)
					{
						// If we fail to connect to the network for some reason, then we get a status == 0 which would normally
						// go into onSuccess.  We define a specific error handler here to avoid this.
						// When we fail and can no longer retry, we either report offline or failure depending on the current
						// connection manager status.
						if (!timeout++) 
						{
							Mojo.Log.info("on0 %j", response);
							if (retries < 1) 
							{
								Weave.Services.ConnectionManager.getStatus(function(online)
								{
									callback(false, online ? 'failure' : 'offline', response.status); // do not localize
								});
							}
							else 
							{
								self._callServer(path, body, callback, retries - 1);
							}
						}
					}
				});
				(function()
				{
					if (!timeout++) 
					{
						Mojo.Log.info("Timeout");
						if (retries < 1) 
						{
							callback(false, 'timeout'); // do not localize
						}
						else 
						{
							self._callServer(path, body, callback, retries - 1);
						}
					}
					Weave.Services.ConnectionManager.cancelWait(id);
				}).delay(self._defaultCallTimeout);
			}
		});	
	}
});
/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.ApplicationServer = new (Class.create(Weave.Services.CatalogServer,
{
	$whenReadyServerUrl: function(callback)
	{
		if (this._serverUrl)
		{
			callback();
		}
		else
		{
			// We need the server url and the carrier info
			var self = this;
			Weave.Services.AccountServices.getServerUrl(function(status, url)
			{
				self._serverUrl = status ? url : 'error:///';
				callback();
			});
		}
	},

	getFeaturedApplications: function(callback)
	{
		var self = this;
		this.getSecurityToken(function(token)
		{
			self.$whenReadyServerUrlCarrier(function()
			{
				var features =
				{
					InGetFeaturedAppsV2:
					{
						accountTokenInfo: token,
						carrier: self._carrier
					}
				};
				self._callServer('featuredApps_ext2', features, function(status, response)
				{
					if (status)
					{
						if (response.FeaturedApps)
						{
							callback(true, response.FeaturedApps.palmFeaturedAppList.appSummary, response.FeaturedApps.carrierFeaturedAppList.appSummary, response.FeaturedApps.releaseStatus, response.FeaturedApps.country);
						}
						else
						{
							callback(false, 'badformat'); // do not localize
						}
					}
					else
					{
						callback.apply(null, arguments);
					}
				});
			});
		});
	},

	getAppCatUserFlags: function(callback)
	{
		var self = this;
		this.getSecurityToken(function(token)
		{
			self.$whenReadyServerUrl(function()
			{
				var inGetAppCatUserFlags =
				{
					InGetAppCatUserFlags:
					{
						accountTokenInfo: token
					}
				};
				self._callServer('getAppCatUserFlags', inGetAppCatUserFlags, function(status, response)
				{
					if (status)
					{
						if (response.OutGetAppCatUserFlags)
						{
							callback(true, response.OutGetAppCatUserFlags, token);
						}
						else
						{
							callback(false, 'badformat', token); // do not localize
						}
					}
					else
					{
						callback(false, response, token);
					}
				});
			});
		});
	},

	getCategories: function(category, callback, localeOverride)
	{
		var self = this,
                    locale = (localeOverride === undefined) ? Mojo.Locale.current : localeOverride;

                this.$whenReadyServerUrlCarrier(function()
		{
			var params =
			{
				InGetCategoryList:
				{
					locale: locale,
                                        categoryId: category || ""
				}
			};
			self._callServer('categoryList', params, function(status, response, extra)
			{
				Mojo.Log.info("getCategories", status, response);
				if (status)
				{
					if (response.OutGetCategoryList == '' || response.OutGetCategoryList.categoryList == '')
					{
						callback(true, [], 0);
					}
					else if (response.OutGetCategoryList && response.OutGetCategoryList.categoryList && response.OutGetCategoryList.categoryList.categoryItems)
					{
						var items = response.OutGetCategoryList.categoryList.categoryItems;

                                                //We return the locale param so that we know to override the first "default" element
                                                //in the applicationcategorieshelper if we recovered from the invalidlocale error.
						callback(true, !items ? [] : Object.isArray(items) ? items : [ items ], locale);
					}
					else
					{
						callback(false, 'badformat'); // do not localize
					}
				}
				else
				{
					if (response == 'jsonexception' && extra.errorCodes == 'DISC0123')
					{
						//We default to the english category list when invalidlocale is returned
                                                //from the server.  There is an outstanding category cleanup effort remaining
                                                //on the server.
                                                self.getCategories(category, callback, 'en_US');
					}
					else
					{
						callback(false, response);
					}
				}
			});
		});
	},

	getApplicationDetails: function(appId, packageId, locale, callback)
	{
		var self = this;
		this.getSecurityToken(function(token)
		{
			var details =
			{
				InGetAppDetailV2:
				{
					accountTokenInfo: token,
					"packageId": packageId,
					"locale": locale
				}
			};
			
			if (appId)
			  details.InGetAppDetailV2.appId = appId;
			self._callServer('appDetail_ext2', details, function(status, response, extra)
			{
				if (status)
				{
					if (response && response.OutGetAppDetailV2)
					{
						callback(true, response.OutGetAppDetailV2.appDetail, response.OutGetAppDetailV2.userRating, response.OutGetAppDetailV2.country);
					}
					else
					{
						callback(false, 'badformat'); // do not localize
					}
				}
				else
				{
					if (response == 'jsonexception' && extra.errorCodes == 'DISC0120')
					{
						callback(false, 'appunavailable', extra.message); // do not localize
					}
					else if (response == 'jsonexception' && self._isAppIncompatibleError(extra.errorCodes))
					{
						// app is not compatible with the device
						callback(false, extra.errorCodes);
					}
					else if (response == 'jsonexception' && self._isInvalidTokenError(extra.errorCodes))
					{
						callback(false, 'invalidtoken', extra.message); // do not localize
					}
					else
					{
						callback.apply(null, arguments);
					}
				}
			});
		});
	},

	getTags: function(limit, order, callback)
	{
		var get =
		{
			InGetTags:
			{
				criterion: (order == 'popularity' ? 'APP_COUNT' : 'TAG_NAME'),
				limit: limit
			}
		}
		this._callServer('getTags', get, function(status, response)
		{
			if (status)
			{
				if (response.OutGetTagList)
				{
					callback(true, response.OutGetTagList.tagList.tagItems);
				}
				else
				{
					callback(false, 'badformat'); // do not localize
				}
			}
			else
			{
				callback.apply(null, arguments);
			}
		});
	},

	searchForApplications: function(query, queryFragment, qid, categoryid, start, count, sort, locale, connectors, callback)
	{
		Mojo.Log.info("*********************************Entered seach for applications***********************");
		var self = this;
		this.getSecurityToken(function(token)
			{
				var q  = [];
				if (query)
				{
					var words = query.toLowerCase().split(' ');
					for (var i = 0; i < words.length; i++)
					{
						q.push(words[i] + '*');
					}
				}
				q = q.join(' && ');

				Mojo.Log.info("********* token *****" + token);
				var search =
				{
					InGetAppListV2:
					{
						tagName: '',
						queryStr: q,
                                                qid: qid,
						categoryid: categoryid,
                                                provides: connectors,
						startPosition: start,
						count: count,
						sort: sort,
						locale: locale,
						accountTokenInfo: token
					}
				};

                                //Query fragments get added as additional payload properties
                                if (queryFragment) {
                                    var fragParts,
                                        frags = queryFragment.split("&");

                                    for (var i=0; i<frags.length; i++) {
                                        fragParts = frags[i].split("=");

                                        if (fragParts.length === 2) {
                                            search.InGetAppListV2[fragParts[0]] = fragParts[1];
                                        }
                                    }
                                }

                                Mojo.Log.info("InGetAppListV2 payload: %j", search.InGetAppListV2);
				Mojo.Log.info('****************************** app List called with token***' + token);
				self._callServer('appList_ext2', search, function(status, response)
				{
					if (status)
					{
						if (response.OutGetAppList)
						{
							var apps = response.OutGetAppList.appList.appSummary;
							callback(true, !apps ? [] : apps.constructor != Array ? [ apps ] : apps, response.OutGetAppList.appList.totalCount, response.OutGetAppList.country, response.OutGetAppList.tiles);
						}
						else
						{
							callback(false, 'badformat'); // do not localize
						}
					}
					else
					{
						callback.apply(null, arguments);
					}
				});
			});
	},

	getUserComments: function(appid, offset, count, callback)
	{
		var get =
		{
			InGetUserRatings:
			{
				appId: appid,
				startPosition: offset,
				count: count
			}
		};
		this._callServer('getUserRatings', get, function(status, response)
		{
			if (status)
			{
				if (response.UserRatingList)
				{
					var ratings = response.UserRatingList.ratings;
					ratings = (!ratings ? [] : ratings.constructor != Array ? [ ratings ] : ratings);
					callback(true, ratings, ratings.length);
				}
				else if (response.UserRatingList == '')
				{
					callback(true, [], 0);
				}
				else
				{
					callback(false, 'badformat'); // do not localize
				}
			}
			else
			{
				callback.apply(null, arguments);
			}
		});
	},

	addUserComment: function(appid, packageid, comment, score, locale, name, anonymous, inappropriate, problemType, callback)
	{
		var self = this;
		this.getSecurityToken(function(token)
		{
			var rating =
			{
				InAddUserRating:
				{
					userRatingItem:
					{
						score: Math.round(score), // Server requires score to be an interger
						comment: comment,
						accountId: name || "",
						locale: locale,
						isAnonymous: anonymous,
						isInappropriate: inappropriate,
						appId: appid,
						publicApplicationId: packageid,
						complaintType: problemType
					},
					accountTokenInfo: token
				}
			};

			Mojo.Log.info("asdd User comment %j", rating);
			self._callServer('addUserRating', rating, function(status, response, extra)
			{
				callback.apply(null, arguments);
			});
		});
	},

	getMyComment: function(appid, packageid, callback)
	{
		var self = this;
		this.getSecurityToken(function(token)
		{
			var comment =
			{
				InGetMyRating:
				{
					accountTokenInfo: token,
					appEntryId: appid,
					publicApplicationId: packageid
				}
			};
			Mojo.Log.info("getMyComment %j", comment);
			self._callServer('getMyRating', comment, function(status, response, extra)
			{
				if (status)
				{
					if (response && response.UserRating)
					{
						callback(true, response.UserRating);
					}
					else
					{
						callback(true, null);
					}
				}
				else
				{
					if (response == 'jsonexception' && self._isInvalidTokenError(extra.errorCodes))
					{
						callback(false, 'invalidtoken', extra.message); // do not localize
					}
					else
					{
						callback.apply(null, arguments);
					}
				}
			});
		});
	},

	getAppListForUpdates: function(packageNames, callback)
	{
            var self = this;
            this.getSecurityToken(function(token)
            {
                    Mojo.Log.info("Weave.Services.ApplicationServer.getAppListForUpdates sending %s", packageNames);
                    var updates =
                    {
                            InGetUpdatableApps:
                            {
                                    accountTokenInfo: token,
                                    packageIds: packageNames
                            }
                    };
                    self._callServer('getListOfUpdatableApps', updates, function(status, response, extra)
                    {
                            if (status)
                            {
                                    Mojo.Log.info("%j", response);
                                    if (response && response.OutUpdateInfoList == "")
                                    {
                                            callback(true, []);
                                    }
                                    else if(response && response.OutUpdateInfoList)
                                    {
                                            var updates = response.OutUpdateInfoList.appSummaryForUpdates;
                                            callback(true, !updates ? [] : Object.isArray(updates) ? updates : [ updates ]);
                                    }
                                    else
                                    {
                                            callback(false, 'badformat');
                                    }
                            }
                            else
                            {
                                    if (response == 'jsonexception' && self._isInvalidTokenError(extra.errorCodes))
                                    {
                                            callback(false, 'invalidtoken', extra.message); // do not localize
                                    }
                                    else
                                    {
                                            callback.apply(null, arguments);
                                    }
                            }
                    });
            });
	},

	_isInvalidTokenError: function(err)
	{
		if (err == 'DISC0049' || err == 'DISC0050' || err == 'DISC0051')
		{
			Mojo.Log.error("ApplicationServer._isInvalidTokenError TRUE, error:%s", err);
			return true;
		}
		return false;
	},

	_isAppIncompatibleError: function(err)
	{
		if (err == 'DISC0025' || err == 'DISC0124' || err == 'DISC0125'
			|| err == 'DISC0201' || err == 'DISC0202' || err == 'DISC0203')
		{
			Mojo.Log.error("ApplicationServer.isAppIncompatibleError TRUE, error:%s", err);
			return true;
		}
		return false;
	}
}));
/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.ApplicationManager.Browser =
{
	openPage: function(url)
	{
		Weave.Services.ApplicationManager.openApplication('com.palm.app.browser', { target: url });
	}
	
};/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.ConnectionManager = {
    _target: 'palm://com.palm.connectionmanager',
    _online: undefined,
    _1x: undefined,
    _waiting: [],
    _started: false,
    
    _startup: function(callback){
        this._started = true;
        if (PalmSystem.version.match("desktop")) {
            // Simulator is always online
            this._stateChanged(true);
            callback && callback(this._online);
            callback = null;
        }
        else {
            var self = this;
            
            // register for entering msm notifications
            this._MSMrequest = Weave.Services.request('palm://com.palm.bus/signal', {
                method: 'addmatch',
                parameters: {
                    "category": "/storaged",
                    "method": "MSMProgress",
                    "subscribe": true
                }
            }, function(response){
                self._MSMnotification(response);
            }, function(response){
                Mojo.Log.error("ConnectionManager._startup MSM subscription request failed %j", response);
                self._MSMnotification(response);
            });
            
            this._getstatusreq = this.getConnectionStatus(function(response){
                Mojo.Log.info("ConnectionManager.connectionStatusNotification %j", response);
                self._1x = response.wan.network == "1x" && response.wifi.state != "connected";
				self.wanInterface = response && response.wan && response.wan.interfaceName;
                self._stateChanged((response.isInternetConnectionAvailable == true ? true : false));
                callback && callback(self._online);
                // callback = null;
            }, function(){
                self._stateChanged(false);
                callback && callback(self._online);
                // callback = null;
            }, true);
        }
    },
    
    getConnectionStatus: function(success, failure, subscribe){
        if (this.statusInc == undefined) {
            this.statusInc = 0;
        }
        this.statusInc += 1;
        var calltime = this.statusInc;
        return Weave.Services.request(this._target, {
            method: 'getstatus',
            parameters: {
                subscribe: subscribe
            }
        }, success, failure);
    },
    getDataService: function(){
        var self = this;
		Weave.Services.DeviceProfile.getCarrierIdentification(function(status, carrier){
			if (carrier.mcc == 310 && carrier.mnc == 410) {
				this.cellSvcConnectRequest = Weave.Services.request(self._target, {
					method: 'connectCellularDataService',
					parameters: {
						subscribe: true,
						service: "proxy"
					}
				}, function(results){
					if (results) {
						Mojo.Log.info("getDataService success2 response", Object.toJSON(results));
						if (undefined != results.returnValue) { //first response will have returnValue the rest don't unless wand goes away
							if (!results.returnValue) {
								self.isWanSvcConnected = false;
								self.ipAddress = null;
							// failure(); //only reason we would get false is if service originaly failed to connect or wand crashed
							}
						}
						else {
							if (results.status) {
								if ("connected" === results.status && results.ipAddress) {
									self.isWanSvcConnected = true;
									self.ipAddress = results.ipAddress;
								//  success();
								
								}
								else 
									if ("retrying" === results.status) {
										self.isWanSvcConnected = false;
										self.ipAddress = null;
									//   failure();
									}
									else 
										if ("disconnected" === results.status) {
											self.isWanSvcConnected = false;
											self.ipAddress = null;
										//  failure();
										}
							}
						}
					}
				}, function(results){
					self.isWanSvcConnected = false;
					self.ipAddress = null;
				// failure();
				});
			}
		});
    },
    
    disconnectDataService: function(){
        if (null !== this.cellSvcConnectRequest) {
            this.cellSvcConnectRequest.cancel();
            this.cellSvcConnectRequest = null;
        }
        else {
            Mojo.Log.info("wanDisconnectServiceRequest already disconnected");
        }
    },
    _MSMnotification: function(response){
        if (!response) 
            return;
        
        Mojo.Log.info("ConnectionManager._MSMnotification %j", response);
        if (response.stage == 'attempting') {
            Mojo.Log.info("ConnectionManager._MSMnotification: in MSM");
            this._MSMmodeActive = true;
            ConnectionWidget.cancel();
        }
    },
    
    _stateChanged: function(online){
        if (this._online != online) {
            this._online = online;
            var waiting = this._waiting;
            this._waiting = [];
            for (var i = 0; i < waiting.length; i++) {
                var wait = waiting[i];
                if (wait.online === undefined || wait.online === online) {
                    waiting[i].callback(online);
                }
                else {
                    this._waiting.push(wait);
                }
            }
        }
        
        if (online == false) {
            this.showConnectionError();
        }
        else {
            // if internet is available we are certainly not in MSM mode
            this._MSMmodeActive = false;
            ConnectionWidget.cancel();
        }
    },
    
    /*
     * Enable monitoring of network status.
     */
    monitor: function(){
        if (!this._started) {
            this._startup();
        }
    },
    
    getStatus: function(callback){
        if (this._online === undefined) {
            if (!this._started) {
                this._startup(callback);
            }
            else {
                this._waiting.push({
                    online: undefined,
                    callback: callback
                });
            }
        }
        else {
            callback(this._online);
        }
    },
    
    isOnline: function(){
        if (this._online === undefined) {
            throw new Error("ConnectionManager is not monitoring status");
        }
        else {
            return this._online;
        }
    },
    
    isOn1x: function(){
        return this._1x;
    },
    
    waitForOnline: function(callback){
        if (this._online === true) {
            callback();
            return undefined;
        }
        else {
            var wait = {
                online: true,
                callback: callback
            };
            this._waiting.push(wait);
            return wait;
        }
    },
    
    waitForOffline: function(callback){
        if (this._online === false) {
            callback();
            return undefined;
        }
        else {
            var wait = {
                online: false,
                callback: callback
            };
            this._waiting.push(wait);
            return wait;
        }
    },
    
    cancelWait: function(wait){
        var waiting = this._waiting;
        for (var i = 0; i < waiting.length; i++) {
            if (waiting[i] == wait) {
                waiting.splice(i, 1);
                break;
            }
        }
    },
    
    showConnectionError: function(){
        // don't show connection widget if we are in MSM mode
        if (this._MSMmodeActive) 
            return;
        
        var stage = Weave.System.Activator.getActiveStageController();
        if (!stage) 
            return;
        
        if (!stage.isActiveAndHasScenes()) 
            return;
        
        Mojo.Log.info("ConnectionManager.showConnectionError");
        var params = {
            type: "data",
            onSuccess: function(response){
            }
        };
        ConnectionWidget.connect(params, stage);
    },
    
    cleanup: function(){
        // close connection's widget stage if active
        ConnectionWidget.cancel();
		this.disconnectDataService();
        delete this._MSMrequest;
        delete this._getstatusreq;
    }
    
};
/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.DeviceProfile = 
{
	_target: 'palm://com.palm.deviceprofile',
	
	getDeviceId: function(callback)
	{
		Weave.Services.request(this._target,
		{
			method: 'getDeviceId',
			parameters: {}
		},
		function(response)
		{
			Mojo.Log.info("**** Got deviceId %j", response);
			callback(true, response.deviceId);
		},
		function(response)
		{
			Mojo.Log.error("**** Error in obtaining deviceId %j", response);
			callback(false);
		});
	},
	
	getCarrierIdentification: function(callback)
	{
		Weave.Services.request('palm://com.palm.db',
		{
			method: 'find',
			parameters: {"query":{"from":"com.palm.carrierdb.settings.current:1"}}
		},
		function(response)
		{
			callback(true, response.results[0]);
		},
		function()
		{
			callback(false);
		});
	}
};
/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.AppInstallService = 
{
	_target: 'palm://com.palm.appInstallService',
	
	install: function(app, callback)
	{
		Weave.Services.AccountServices.getAccountToken(function(status, token, accountAlias)
		{
			Weave.Services.DeviceProfile.getDeviceId(function(status, id)
			{
				var transactionId = new Date().getTime();
				var params = 
				{
					catalogId: app.id,
					id: app.publicApplicationId,
					title: app.title,
					version: app.serverVersion,
					vendor: app.vendor,
					vendorUrl: app.vendorUrl,
					iconUrl: app.iconUrl,
					ipkUrl: app.packageUrl,
					authToken: token || 0,
					deviceId: id || 0,
					email: accountAlias || "",
					noApp: app.appType === "app"? false:true,
					services: app.services,
					accounts: app.accounts,
					dockMode: app.dockMode,
					universalSearch : app.universalSearch,
					loc_name: app.title,
					transactionId: '' + transactionId
				}
				Mojo.Log.info("Weave.Services.AppInstallService.install payload %j", params);
				var request = Weave.Services.request(Weave.Services.AppInstallService._target, 
				{
					method: 'install',
					parameters: params
				},
				function(response)
				{
					callback(true);
				},
				function(response)
				{
					Mojo.Log.error("Weave.Services.AppInstallService.install failed %s, %j", app.publicApplicationId, response);
					callback(false, response);
				});
			});
		});
	},
	
	status: function(callback)
	{
		Mojo.Log.info("Weave.Services.AppInstallService.status");
		var self = this;
		var request = Weave.Services.subscriptionRequest(this._target, 
		{
			method: 'status',
			parameters: {}
		},
		function(response)
		{
			Mojo.Log.info("Weave.Services.AppInstallService.status response %j", response);
			if (response.status && response.status.apps)
			{
				callback(true, false, response.status.apps);
			}
			else if (response.id)
			{
				callback(true, true, [response]);
			}
		},
		function(response)
		{
			Mojo.Log.error("Weave.Services.AppInstallService.status failed %j", response);
		});
	},
	
	/*
	retryInstall: function(publicApplicationId)
	{
		var self = this;
		var request = Weave.Services.request(this._target, 
		{
			method: 'retryInstall',
			parameters: {"id": publicApplicationId},
		},
		function(response){},
		function(response)
		{
			Mojo.Log.error("Weave.Services.AppInstallService.retryInstall failed %s, %j", publicApplicationId, response);
		});
	},
	*/
	
	pause: function(publicApplicationId, callback)
	{
		var self = this;
		var request = Weave.Services.request(this._target, 
		{
			method: 'pause',
			parameters: {"id": publicApplicationId}
		},
		function(response)
		{
			callback(true);
		},
		function(response)
		{
			Mojo.Log.error("Weave.Services.AppInstallService.pause failed %s, %j", publicApplicationId, response);
			callback(false, response);
		});
	},
	
	resume: function(publicApplicationId, callback)
	{
		var self = this;
		var request = Weave.Services.request(this._target, 
		{
			method: 'resume',
			parameters: {"id": publicApplicationId}
		},
		function(response)
		{
			callback(true);
		},
		function(response)
		{
			Mojo.Log.error("Weave.Services.AppInstallService.resume failed %s, %j", publicApplicationId, response);
			callback(false, response);
		});
	},
	
	installLocal: function(app, callback)
	{
		var self = this;
		var params = 
		{
					id: app.id,
					version: app.version,
					title: app.loc_name,
					ipkUrl: app.ipkgUrl,
					iconUrl:app.iconUrl,
					vendor:app.vendor
		}
		Mojo.Log.info("Weave.Services.AppInstallService.install payload %j", params);
		var request = Weave.Services.request(this._target, 
		{
			method: 'installLocal',
			parameters: params
		},
		function(response)
		{
			Mojo.Log.info("Weave.Services.AppInstallService.install response %j", response);
			callback(true);
		},
		function(response)
		{
			Mojo.Log.error("Weave.Services.AppInstallService.installLocal failed %s, %j", params.id, response);
			callback(false, response);
		});
	},
	
	cancel: function(publicApplicationId, callback)
	{
		var self = this;
		var request = Weave.Services.request(this._target, 
		{
			method: 'cancel',
			parameters: {"id": publicApplicationId}
		},
		function(response)
		{ 
			callback(true); 
		},
		function(response)
		{
			Mojo.Log.error("Weave.Services.AppInstallService.cancel failed %s, %j", publicApplicationId, response);
			callback(false, response); 
		});
	},
	
	remove: function(publicApplicationId, callback)
	{
		var self = this;
		var request = Weave.Services.request(this._target, 
		{
			method: 'remove',
			parameters: {"id": publicApplicationId}
		},
		function(response)
		{
			callback(true);
		},
		function(response)
		{
			callback(false, response); 
			Mojo.Log.error("Weave.Services.AppInstallService.remove failed %s, %j", publicApplicationId, response);
		});
	}
};
/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.SystemManager =
{
	_target: 'palm://com.palm.systemmanager',
	_unlockcount: 0,
	
	_startup: function()
	{
		if (PalmSystem.version.match("desktop")) 
		{
			// Simulator is always unlocked
		}
		else 
		{
			var self = this;
			var first = true;
			this._getstatusreq = Weave.Services.request(this._target, 
			{
				method: 'getLockStatus',
				parameters: 
				{
					subscribe: true
				}
			},
			function(response)
			{
				if (!first) 
				{
					self._unlockcount++;
				}
				first = false;
			});
		}
	},
	
	hasScreenLocked: function(state, callback)
	{
		if (!this._getstatusreq)
		{
			this._startup(undefined, false);
		}
		if (state._count == undefined || state._count == this._unlockcount)
		{
			state.locked = false;
		}
		else
		{
			state.locked = true;
		}
		state._count = this._unlockcount;
		callback(true, state);
	}
	
};/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.Preferences = Weave.Services.Preferences || {};
Weave.Services.Preferences.SystemProperties = 
{
	_target: 'palm://com.palm.preferences/systemProperties',
	
	getCarrier: function(callback)
	{
		Weave.Services.request(this._target,
		{
			method: 'Get',
			parameters: { key: 'com.palm.properties.DMCARRIER' }
		},
		function(response)
		{
			callback(true, response['com.palm.properties.DMCARRIER']);
		},
		function()
		{
			callback(false);
		});
	}
};/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.PaymentServer = new (Class.create(Weave.Services.CatalogServer, {
    $whenReadyServerUrl: function(callback){
        if (this._serverUrl) {
            callback();
        }
        else {
            // We need the payment server url and the carrier info
            var self = this;
            Weave.Services.AccountServices.getPaymentServerUrl(function(status, url){
                self._serverUrl = status ? url : 'error:///';
                callback();
            });
        }
    },
    
    resetServerUrl: function(callback){
        this._serverUrl = undefined;
    },
    
    getCCTypes: function(binCountry, callback){
        var self = this;
        this.getSecurityToken(function(token){
            var ingetCCTypes = {
                InGetCCTypes: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    billToCountry: binCountry
                }
            };
            self._callServer('getCCTypes', ingetCCTypes, function(status, response, extra){
                if (status) {
                    callback(true, response);
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
        
    },
    
    setDefaultPaymentInfo: function(infoId, callback){
        var self = this;
        this.getSecurityToken(function(token){
            var inSetDefault = {
                InSetDefaultPaymentInfo: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    paymentInfoId: infoId
                }
            };
            self._callServer('setDefaultPaymentInfo', inSetDefault, function(status, response, extra){
                if (status) {
                    callback(true, response);
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
    },
    
    setInvoiceEmail: function(emailAdd, callback){
        var self = this;
        this.getSecurityToken(function(token){
            var insetUserInfo = {
                InSetUserInfo: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    invoiceEmail: emailAdd
                }
            };
            self._callServer('setUserInfo', insetUserInfo, function(status, response, extra){
                if (status) {
                    callback(true, response);
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
        
    },
    
    getPaymentTypes: function(callback){
        var self = this;
        this.getSecurityToken(function(token){
            // Get carrier details
            
            Weave.Services.DeviceProfile.getCarrierIdentification(function(status, carrier){
            
                // Cache for later use
                myProfile.mcc = carrier.mcc;
                myProfile.mnc = carrier.mnc;
                
                var inGetPaymentTypes = {
                    InGetPaymentTypes: {
                        authToken: token.token,
                        accountAlias: token.email,
                        deviceId: token.deviceId,
                        mcc: carrier.mcc, // 310 works
                        mnc: carrier.mnc, // 0 works
                        carrier: carrier.qOperatorShortName // "sprint" works
                    }
                };
                
                Mojo.Log.info("## paymentTypes queried with: %s", Object.toJSON(inGetPaymentTypes));
                
                self._callServer('getPaymentTypes', inGetPaymentTypes, function(status, response, extra){
                    Mojo.Log.info("## paymentTypes returned with: %s - %s - %j", status, Object.toJSON(response), extra);
                    
                    if (status) {
                        callback(true, response, token);
                    }
                    else 
                        if (response == "jsonexception") {
                            callback(false, extra);
                        }
                        else {
                            callback(false, {
                                errorCode: response
                            });
                        }
                });
            });
        });
        
    },
    getBillToCountries: function(callback){
        var self = this;
        this.getSecurityToken(function(token){
            var ingetBillToCountries = {
                InGetBillToCountries: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId
                }
            };
            
            self._callServer('getBillToCountries', ingetBillToCountries, function(status, response, extra){
                if (status) {
                    callback(true, response);
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
        
    },
    
    verifyPaymentSetup: function(callback){
        var self = this;
        this.getSecurityToken(function(token){
            var inGetPaymentInfos = {
                InGetPaymentInfos: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId
                }
            };
            
            self._callServer('getPaymentInfos', inGetPaymentInfos, function(status, response, extra){
                Mojo.Log.info("#### getPaymentInfos call returned %j", response);
                
                if (status) {
                    if (!response.OutGetPaymentInfos.invoiceEmail) 
                        response.OutGetPaymentInfos.invoiceEmail = token.email;
                    callback(true, response);
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
    },
    
    addAccount: function(address, ccInfo, callback){
        // Adds a Credit Card account
        
        var self = this;
        
        this.getSecurityToken(function(token){
            var accountInfo = {
                InAddCCPaymentInfo: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    billTo: address,
                    creditCard: ccInfo
                }
            };
            
            
            self._callServer('addCCPaymentInfo', accountInfo, function(status, response, extra){
                if (status) {
                    if (response.OutAddCCPaymentInfo) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
        
    },
    
    addOBAccount: function(address, callback){
        // Adds an Operator Billing account
        var self = this;
        
        this.getSecurityToken(function(token){
            Weave.Services.DeviceProfile.getCarrierIdentification(function(status, carrier){
                var accountInfo = {
                    InAddOBPaymentInfo: {
                        authToken: token.token,
                        accountAlias: token.email,
                        deviceId: token.deviceId,
                        address: address,
                        mcc: carrier.mcc,
                        mnc: carrier.mnc,
                        carrier: carrier.qOperatorShortName
                    }
                };
                
                Mojo.Log.info("### Adding carrier info with: %j", accountInfo);
                
                self._callServer('addOBPaymentInfo', accountInfo, function(status, response, extra){
                    Mojo.Log.info("### Added carrier info with: %j", response);
                    
                    if (status) {
                        if (response.OutAddOBPaymentInfo) {
                            callback(true, response);
                        }
                        else {
                            callback(false, 'badresponse');
                        }
                    }
                    else 
                        if (response == "jsonexception") {
                            callback(false, extra);
                        }
                        else {
                            callback(false, {
                                errorCode: response
                            });
                        }
                });
            });
        });
        
    },
    
    getOBCountries: function(callback){
        // Gets which countries support operator billing for this phone
        var self = this;
        
        this.getSecurityToken(function(token){
            var accountInfo = {
                InGetOBCountries: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId
                }
            };
            
            self._callServer('getOBCountries', accountInfo, function(status, response, extra){
                Mojo.Log.info("### Got OB Countries with: %j - %j", response, extra);
                
                if (status) {
                    if (response.OutGetOBCountries) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
        
    },
    
    updateAccount: function(address, ccInfo, callback){
        var self = this;
        
        this.getSecurityToken(function(token){
            ccInfo.email = token.email;
            var accountInfo = {
                InUpdateCCPaymentInfo: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    paymentInfoId: ccInfo.paymentInfoId,
                    billTo: address,
                    creditCard: ccInfo
                }
            };
            
            self._callServer('updateCCPaymentInfo', accountInfo, function(status, response, extra){
                if (status) {
                    if (response.OutUpdateCCPaymentInfo) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
            
        });
    },
    
    updateOBAccount: function(address, paymentInfoId, callback){
        var self = this;
        
        this.getSecurityToken(function(token){
            var accountInfo = {
                InUpdateOBPaymentInfo: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    paymentInfoId: paymentInfoId,
                    address: address
                }
            };
            
            Mojo.Log.info("### updating OB info using %j", accountInfo);
            
            self._callServer('updateOBPaymentInfo', accountInfo, function(status, response, extra){
                if (status) {
                    if (response.OutUpdateOBPaymentInfo) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
    },
    
    getOBInfos: function(callback){
        // Gets the URL to call for Operator Billing
        
        var self = this;
        
        this.getSecurityToken(function(token){
            Weave.Services.DeviceProfile.getCarrierIdentification(function(status, carrier){
                var accountInfo = {
                    InGetOBInfos: {
                        authToken: token.token,
                        accountAlias: token.email,
                        deviceId: token.deviceId,
                        mcc: carrier.mcc,
                        mnc: carrier.mnc,
                        carrier: carrier.qOperatorShortName
                    }
                };
                
                self._callServer('getOBInfos', accountInfo, function(status, response, extra){
                    if (status) {
                        if (response.OutGetOBInfos) {
                            callback(true, response);
                        }
                        else {
                            callback(false, 'badresponse');
                        }
                    }
                    else 
                        if (response == "jsonexception") {
                            callback(false, extra);
                        }
                        else {
                            callback(false, {
                                errorCode: response
                            });
                        }
                });
            });
        });
    },
    
    removeAccount: function(paymentInfoId, isCC, callback){
        var self = this;
        this.getSecurityToken(function(token){
            var inputMethod = isCC ? "InRemoveCCPaymentInfo" : "InRemoveOBPaymentInfo";
            var outputMethod = isCC ? "OutRemoveCCPaymentInfo" : "OutRemoveOBPaymentInfo";
            var inputCall = isCC ? "removeCCPaymentInfo" : "removeOBPaymentInfo";
            var inputPayload = {
                authToken: token.token,
                accountAlias: token.email,
                deviceId: token.deviceId,
                paymentInfoId: paymentInfoId
            }
            
            var accountInfo = {};
            accountInfo[inputMethod] = inputPayload;
            
            Mojo.Log.info("### Calling %s with %j", inputCall, accountInfo);
            
            self._callServer(inputCall, accountInfo, function(status, response, extra){
                Mojo.Log.info("### Called %s and got %j", inputCall, response);
                
                if (status) {
                    if (response[outputMethod]) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
            
        });
    },
    
    capturePayment: function(orderObj, callback){
        var self = this;
        this.getSecurityToken(function(token){
            var orderInfo = {
                InCapturePayment: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    order: orderObj
                }
            };
            Mojo.Log.info("## Calling capturePayment with %j", orderInfo);
            
            self._callServer('capturePayment', orderInfo, function(status, response, extra){
                if (status) {
                    if (response.OutCapturePayment) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
    },
    
    getOrderStatus: function(orderNo, callback){
        var self = this;
        this.getSecurityToken(function(token){
            var orderInfo = {
                InGetOrderStatus: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    orderNo: orderNo
                }
            };
            
            Mojo.Log.info("## Calling getOrderStatus with %j", orderInfo);
            
            self._callServer('getOrderStatus', orderInfo, function(status, response, extra){
                if (status) {
                    if (response.OutGetOrderStatus) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
    },
    
    initOBSession: function(obInfos, callback, retries){
        // This hits an XML API on the aggregator's servers
        // Since we can't use weave, we need to do our own call and management.
        
        if (typeof retries == "undefined") {
            retries = 3;
        }
        
        Mojo.Log.info("## Will initialize OB Session with %j retrynumber%s", obInfos, retries);
                if (obInfos.wapProxy) {
                    // Use proxy for WAP
					this._getproxy(obInfos, retries, callback);
                }
                else {
					
                    this._getWanInterface(obInfos, retries, callback);
                }
    },
    
	_getWanInterface: function(obInfos, retries, callback){
		var self = this;
		if (Weave.Services.ConnectionManager.wanInterface) {
			var customRequestHeaders = {
				"X-webOS-NetworkInterface": Weave.Services.ConnectionManager.wanInterface
			};
			self._callInitSession(obInfos, retries, callback, customRequestHeaders);
		}
		else {
                if (retries == 0) {
                    callback(false, 'nowan');
                }
                else {
                    Mojo.Log.info("## Retrying");
                    // Try again in 100ms
                    setTimeout(self.initOBSession.bind(self, obInfos, callback, (retries - 1)), 500);
                }
            }
	},
    _getproxy: function(obInfos, retries, callback){
        var self = this;
        Mojo.Log.info("isWanSvcConnected %s, ipAddress %s", Weave.Services.ConnectionManager.isWanSvcConnected, Weave.Services.ConnectionManager.isAddress);
        if (Weave.Services.ConnectionManager.isWanSvcConnected && Weave.Services.ConnectionManager.ipAddress) {
        
            customRequestHeaders = {
                "X-webOS-NetworkInterface": Weave.Services.ConnectionManager.ipAddress
            };
            var proxyAddr = obInfos.wapProxy;
            var reg = /^http:\/\/([A-Za-z0-9\.-]+):([0-9]+)$/; // look for domain and port
            var matches = reg.exec(proxyAddr);
            customRequestHeaders["X-webOS-proxyaddr"] = matches[1];
            customRequestHeaders["X-webOS-proxyport"] = matches[2];
            Mojo.Log.info("## Making request with headers: %j", customRequestHeaders);
            self._callInitSession(obInfos, retries, callback, customRequestHeaders);
        }
        else {
            if (retries == 0) {
                callback(false, 'nowan');
            }
            else {
                Mojo.Log.info("## Retrying");
                // Try again in 100ms
                setTimeout(self.initOBSession.bind(self, obInfos, callback, (retries - 1)), 500);
            }
        }
    },
    _callInitSession: function(obInfos, retries, callback, customRequestHeaders){
        var self = this;
        var request = new Ajax.Request(obInfos.initSession.URL, {
            method: obInfos.initSession.submitMethod,
            contentType: 'application/xml',
            evanJSON: false,
            requestHeaders: customRequestHeaders,
            onSuccess: function(response){
                Mojo.Log.info("## Initializing OB Session: onSuccess");
                var text = response.responseText;
                response = response.responseXML;
                if (!response) {
                    Mojo.Log.info("## Initializing OB Session: empty reply");
                    callback(true); // Empty replies are okay
                }
                else {
                    var exception = response.XMLException;
                    if (exception) {
                        Mojo.Log.error("## Initializing OB Session: %s", exception);
                        callback(false, 'xmlexception', exception);
                    }
                    else {
                        Mojo.Log.info("## Initializing OB Session: success %s", text);
                        callback(true, response);
                    }
                }				
            },
            onFailure: function(response){
                Mojo.Log.info("## Initializing OB Session: onFailure");
                if (response.responseXML && response.responseXML.XMLException) {
                    Mojo.Log.error("## Initializing OB Session: exception %s", exception);
                    callback(false, 'xmlexception', response.responseXML.XMLException);
                }
                else 
                    if (response.responseXML) {
                        var x = response.responseText;
                        Mojo.Log.error("## Initializing OB Session Failure: status %s xml %s", response.status, x);
                        
                        callback(false, response.responseXML, response.status); // do not localize
                    }
                    else {
                        Mojo.Log.error("## Initializing OB Session Failure: status %s response %s", response.status, response.responseText);
                        callback(false, "failure", response.status); // do not localize
                    }
            },
            on0: function(response){
                Mojo.Log.error("## Initializing OB Session over WAN: on0/offline");
                
                if (retries == 0) {
                    callback(false, 'nowan', response.status);
                }
                else {
                    Mojo.Log.info("## Retrying");
                    // Try again in 100ms
                    setTimeout(self.initOBSession.bind(self, obInfos, callback, (retries - 1)), 500);
                }
                
            }
        });
    },
    getEmbargoedEmailExtensions: function(callback){
        var self = this;
        this.getSecurityToken(function(token){
            var inGetEmbargoedEmailExtensions = {
                InGetEmbargoedEmailExtensions: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId
                }
            };
            
            self._callServer('getEmbargoedEmailExtensions', inGetEmbargoedEmailExtensions, function(status, response, extra){
                if (status) {
                    if (response.OutGetEmbargoedEmailExtensions) {
                        //callback(true,{"OutGetEmbargoedEmailExtensions":{"embargoedEmailExtensions":["cu", "ir", "kp", "sd", "sy"]}});
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
    },
    
    // promo code: getCodeType from server
    getCodeInfos: function(promocode, callback){
        Mojo.Log.info("paymentserver.getCodeInfos# promocode:[%s]", promocode);
        
        var self = this;
        this.getSecurityToken(function(token){
            var inGetPromoCodeInfos = {
                InGetPromoCodeInfos: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    code: promocode
                }
            };
            
            Mojo.Log.info("paymentserver.getSecurityToken, inGetPromoCodeInfos.promoCode:[%s]", inGetPromoCodeInfos.InGetPromoCodeInfos.code);
            
            // response stub
            //			var response = 
            //			{
            //				"OutGetPromoCodeInfos":
            //				{
            //					"campaignType": "GP",
            //					"validFrom": "20101115122133", 
            //					"validTo": "20101230122133",
            //					"amount": "100.87",
            //					"status": "A",
            //					"campaignStatus": "A",
            //					"items": [{"id":"com.engineequalscar.games.mines","version":"0.9.5"}]
            //				}
            //			}
            //			Mojo.Log.info("paymentserver getCodeInfos, outGetCodeInfos.promoType:%s, outGetCodeInfos.paid:%s", 
            //					response.OutGetPromoCodeInfos.campaignType, response.OutGetPromoCodeInfos.items[0].id);
            //			callback(true, response);
            
            self._callServer('getPromoCodeInfos', inGetPromoCodeInfos, function(status, response, extra){
                if (status) {
                    if (response.OutGetPromoCodeInfos) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
    },
    
    checkPromoCodeStatus: function(code, appid, version, callback){
        var self = this;
        this.getSecurityToken(function(token){
            var inCheckPromoCodeStatus = {
                InCheckPromoCodeStatus: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    code: code,
                    id: appid,
                    version: version
                }
            };
            
            //test begin            
            //            var resp =
            //            {"OutCheckPromoCodeStatus":
            //                {"valid":"true", "campaignStatus":"E", "status":"R"}
            //            };
            //            callback(true, resp);
            //            return;
            //test end
            
            self._callServer('checkPromoCodeStatus ', inCheckPromoCodeStatus, function(status, response, extra){
                if (status) {
                    if (response.OutCheckPromoCodeStatus) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
        
    },
	
	_releaseHandle: function(request){
		if (request) {
				Mojo.Log.info("## releasing data servcie handle");
				request.cancel();
			}
	}
}));
/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Utilities.RegExp = 
{
	escape: function(str)
	{
		return str.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, "\\$&");
	}
};
/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Utilities.AppMenu = Class.create(
{
	initialize: function(scene, inherit)
	{
		this._scene = scene;
		this._items = inherit ? inherit._items : [];
		if (scene) 
		{
			this._oldHandleCommand = scene.handleCommand;
			scene.handleCommand = this._handleCommand.bind(this);
			if (scene.controller.setupWidget) 
			{
				scene.controller.setupWidget(Mojo.Menu.appMenu, 
				{
					omitDefaultItems: true
				}, 
				{
					items: this._items
				});
			}
		}
	},
	
	addItem: function(label, callback, enabled)
	{
		this._items.push({ label: label, command: 'cmd' + this._items.length + 1, checkEnabled: (enabled ? true : false), _callback: callback, _enabled: enabled });
		return this;
	},
	
	addEdit: function()
	{
		this._items.push(Mojo.Menu.editItem);
		return this;
	},
	
	addHelp: function(url, enabled)
	{
		if (url) 
		{
			this._items.push(Object.extend(
			{
				_callback: function()
				{
					Weave.Services.ConnectionManager.getStatus(function(online)
					{
						Weave.Services.ApplicationManager.openApplication('com.palm.app.help', 
						{
							target: online ? url : 'no-network'
						});
					});
				},
				_enabled: enabled ? enabled : function(event)
				{
					event.stopPropagation();
					return true;
				}
			}, Mojo.Menu.helpItem));
		}
		else
		{
			this._items.push(Mojo.Menu.helpItem);
		}
		return this;
	},
	
	addPreferences: function(callback, enabled)
	{
		if (callback) 
		{
			this._items.push(Object.extend(
			{
				_callback: callback,
				_enabled: enabled ? enabled : function(event)
				{
					event.stopPropagation();
					return true;
				}
			}, Mojo.Menu.prefsItem));
		}
		else
		{
			this._items.push(Mojo.menu.prefsItem);
		}
		return this;
	},
	
	addPreferencesAndAcc: function(sceneController)
	{
		this.addItem($L('Preferences & Accounts'), 
				function()
				{
					sceneController.pushScene("prefs");
				},
				function()
				{
					return myProfile.enableAcc;
				})
		return this;
	},

        addSoftwareManager: function()
	{
		this.addItem(
                                $L('Software Manager'),
                                function() {
                                    Weave.Services.ApplicationManager.launchApplication('com.palm.app.swmanager', '');
                                },
                                function() {
                                    return true;
                                }
                            );
		return this;
	},
	
	_handleCommand: function(event)
	{
		if (event.type == Mojo.Event.commandEnable)
		{
			for (var i = 0; i < this._items.length; i++)
			{
				if (this._items[i].command == event.command)
				{
					if (this._items[i]._enabled && !this._items[i]._enabled(event)) 
					{
						event.stopPropagation();
						event.preventDefault();
					}
					break;
				}
			}
		}
		else if (event.type == Mojo.Event.command)
		{
			for (var i = 0; i < this._items.length; i++)
			{
				if (this._items[i].command == event.command)
				{
					this._items[i]._callback && this._items[i]._callback(event);
					break;
				}
			}
		}
		this._oldHandleCommand && this._oldHandleCommand.call(this._scene, event);
	}
	
});

Object.extend(Weave.Utilities.AppMenu,
{
	setDefault: function(menu)
	{
		Weave.Utilities.AppMenu.defaultMenu = menu;
	},
	
	useDefault: function(scene)
	{
		new Weave.Utilities.AppMenu(scene, Weave.Utilities.AppMenu.defaultMenu);
	},
	
	enablePref: function(menu){
		Mojo.Log.info("## Startup: enablePref");
	
		// Check what billing type is supported is supported

		Weave.Services.PaymentServer.getPaymentTypes(function(status, response, token) {			
      myProfile.carrier = token.carrier.toLowerCase();
			myProfile.email = token.email;

			var billingEnabled = false;
			var anyBillingEnabled = false;

			if (status) {
				response.OutGetPaymentTypes.paymentTypes.each(function(t) {
					billingEnabled = true;

					if (t.code == "OB") {
						operatorBillingEnabled = true;
					}
				});
			} else {
				Mojo.Log.error("## Initial getPaymentTypes failed with %j", response);
				var err = response.errorCode ? response.errorCode : response;
				Utilities.Errors.displayError(err, {errCode: err}, "PMT_catchAll");
			}

			myProfile.enableAcc = billingEnabled;
			myProfile.enableOB = operatorBillingEnabled;
		});
	}
});
/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Utilities.AppCategoriesHelper = Class.create(
{
        initialize: function(categoryInfoOverrideParams) {
            this._dbMaxCacheTimeAllowed = 86400000; //24 hrs
            this._db = this._dbSetup();

            this.categoryInfo = {
                category: null,
                categoryToSearch: null,
                prevParentCategory: null,
                name: null,
                prevParentCategoryName: null,
                toplevelSelectorLabel: $L('Browse Categories'),
                actualLocaleUsed: null,
                items: [{label: '', command: ''}],
                parentCategoryList: []
            }

            var prop = null;
            for (prop in categoryInfoOverrideParams) {
                if (this.categoryInfo[prop] !== undefined) {
                    this.categoryInfo[prop] = categoryInfoOverrideParams[prop];
                }
            }
        },

        setup: function(){},

        _fetchCategoriesFromServer: function(categoryCacheKey, categoryFilter, isParentCategory) {
            Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._fetchCategoriesFromServer %j", this.categoryInfo);

            var self = this;

            Weave.Services.ApplicationServer.getCategories(categoryFilter, function(status, categories, actualLocaleUsed)
            {
                Mojo.Log.info("callback %d %j", status, categories);

                if (status) {
                    //If there is no localized version of the categories (invalidlocale) we default to English.
                    self.categoryInfo.actualLocaleUsed = actualLocaleUsed;

                    self._dbCacheCategories(categoryCacheKey, categories);
                    self._setupCategoryMenuItems(categoryFilter, isParentCategory, categories);
                } else {
                    // Error
                    Mojo.Log.error("Weave.Utilities.AppCategoriesHelper._fetchCategoriesFromServer failed!");
                    Utilities.Errors.displayError(categories);
                }
            });
        },

        _setupCategoryMenuItems: function(categoryFilter, isParentCategory, categories) {
            Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._setupCategoryMenuItems %j", categories);

            var categoryItems    = null,
                parentCatChoices = [],
                catChoices       = [];

                for (var i=catChoices.length; i<categories.length; i++) {
                    //Only top level categories have icons
                    var categoryIcon = (categoryFilter === undefined && categories[i].iconLocation !== undefined) ? 'images/' + categories[i].iconLocation + 'category-selector.png' : '';

                    catChoices[catChoices.length] = {
                        label: categories[i].name,
                        secondaryIconPath: categoryIcon,
                        command: categories[i].name + '__' + categories[i].id,
                        chosen: (this.categoryInfo.category == categories[i].id) ? true : false
                    };

                    //The first time through we save these off as the parent category list
                    if (this.categoryInfo.parentCategoryList.length === 0) {
                        parentCatChoices[parentCatChoices.length] = {
                            "id": categories[i].id,
                            "name": categories[i].name,
                            "iconLocation": categoryIcon
                        }
                    }
                }
				catChoices.sort(function(a,b){return a.label.localeCompare(b.label);});
                //The first time through we save these off as the parent category list
                if (this.categoryInfo.parentCategoryList.length === 0) {
                    this.categoryInfo.parentCategoryList = parentCatChoices;
                }

                //Update first entry placeholder
                //We must use the English placeholder for the default first entry in case of invalidlocale, not the localized version.
                var firstEntryPlaceholder,
                    additionalCatChoices = [];

                if (isParentCategory === true) {
                    //firstEntryPlaceholder = (this.categoryInfo.actualLocaleUsed.toLowerCase() === 'en_us') ? 'All Categories' : $L('All Categories');
                    //additionalCatChoices[additionalCatChoices.length] = {label: firstEntryPlaceholder, command: '__home'};

                    additionalCatChoices[additionalCatChoices.length] = {label: $L('All #{category}').interpolate({category: this.categoryInfo.name}), command: this.categoryInfo.name + "__" + this.categoryInfo.category, chosen: true};
                } else if (categoryFilter === undefined) {
                    //If there is no localized version of the categories (invalidlocale) we default to English.
                    //In this case we must use the English placeholder for the default first entry, not the localized version.
                    if ((this.categoryInfo.actualLocaleUsed !== undefined && this.categoryInfo.actualLocaleUsed !== null) && this.categoryInfo.actualLocaleUsed.toLowerCase() === 'en_us') {
                        firstEntryPlaceholder = 'Home'; //Do not localize
                    } else {
                        firstEntryPlaceholder = $L('Home');
                    }

                    additionalCatChoices[additionalCatChoices.length] = {label: firstEntryPlaceholder, command: '__all', secondaryIconPath: "images/category-icons/home/category-selector.png", chosen: true};
                } else {
                    additionalCatChoices[additionalCatChoices.length] = {label: $L('All #{category}').interpolate({category: this.categoryInfo.prevParentCategoryName}), command: this.categoryInfo.prevParentCategoryName + "__" + this.categoryInfo.prevParentCategory};
                }

                //Override values for popup display when a subcat was selected
                if (isParentCategory === false) {
                    this.categoryInfo.category = this.categoryInfo.prevParentCategory;
                    this.categoryInfo.name = this.categoryInfo.prevParentCategoryName;
                }

                categoryItems = additionalCatChoices.concat(catChoices);
                this.categoryInfo.items = categoryItems;
        },

        updateCategorySelector: function()
	{
            Mojo.Log.info("Weave.Utilities.AppCategoriesHelper.updateCategorySelector");

            var categoryCacheKey = this.categoryInfo.category,
                categoryFilter,
                isParentCategory = this.isParentCategory(this.categoryInfo.category);

            if (categoryCacheKey === undefined) {
                categoryCacheKey = 'home_' + Mojo.Locale.current; //Forced cache key for undefined since "home" isn't real
            } else {
                categoryCacheKey += "_" + Mojo.Locale.current;
            }

            //If the prev parent is set then a subcat was selected.  We rebuilt based on the parent not the subcat.
            if (isParentCategory) {
                categoryFilter = this.categoryInfo.category;
            } else if (this.categoryInfo.prevParentCategory !== null) {
                categoryFilter = this.categoryInfo.prevParentCategory;
                categoryCacheKey = categoryFilter + "_" + Mojo.Locale.current; //there is no 3rd level.  subcats are stored by parent cat.
            }

            this._dbFetchCategories(categoryCacheKey, categoryFilter, isParentCategory);
	},

        //Determine of the selected category is a toplevel or sublevel category
        isParentCategory: function(selectedCategoryId) {
            var i,
                isParentCategory = false;

            for (i=0; i<this.categoryInfo.parentCategoryList.length; i++) {
                var id = this.categoryInfo.parentCategoryList[i].id;
                if (selectedCategoryId == id) {
                    isParentCategory = true;
                    break;
                }
            }

            return isParentCategory;
        },

        /**
         * Returns path to the category icon
         * @param categoryId
         * */
        getCategoryIconForSearchBar: function(categoryId) {
            var i,
                iconFilename = '';

            if (categoryId === null || categoryId === 'home') {
                iconFilename = 'images/category-icons/home/search-bar.png';
            } else {
                for (i=0; i<this.categoryInfo.parentCategoryList.length; i++) {
                    var id = this.categoryInfo.parentCategoryList[i].id;
                    if (categoryId == id) {
                        iconFilename = this.categoryInfo.parentCategoryList[i].iconLocation;
                        break;
                    }
                }

                if (iconFilename !== '') {
                    iconFilename = iconFilename.replace('category-selector.png', 'search-bar.png');
                }
            }

            return iconFilename;
        },

        /**
         * Mojo.Depot related methods
         */
        _dbSetup: function() {
            var md = new Mojo.Depot(
                                    {
                                        name: "categoryDB",
                                        version: 1,
                                        estimatedSize: 10000,
                                        replace: false
                                    },
                                    this._dbOpenSuccess.bind(this),
                                    this._dbOpenFailure.bind(this)
                                );
            return md;
        },

        _dbOpenSuccess: function() {
            Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._dbOpenSuccess");
        },

        _dbOpenFailure: function() {
            Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._dbOpenFailure");
        },

        _isCacheValid: function(categoryCacheKey, dateCached) {
            var millisecondsSinceEpoch = new Date().getTime(),
                timeSinceCached        = millisecondsSinceEpoch - dateCached;

            if (timeSinceCached > this._dbMaxCacheTimeAllowed) {
                this._dbExpireCachedCategories(categoryCacheKey); //Expire the cache
                return false;
            } else {
                Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._isCacheValid: Yes it is.  Milliseconds since cache %i", timeSinceCached);
                return true;
            }
        },

        _dbExpireCachedCategories: function(categoryCacheKey) {
            this._db.discard(categoryCacheKey, function() {
                Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._isCacheValid: Expired old cache for cacheKey: %s", categoryCacheKey);
            }, function() {
               Mojo.Log.error("Weave.Utilities.AppCategoriesHelper._isCacheValid: Failed to expire old cache for cacheKey: %s", categoryCacheKey);
            });
        },

        _dbCacheCategories: function(categoryId, categories) {
            if (categoryId === undefined) {
                categoryId = 'home';
            }

            var cacheBlock = {
                    data: categories,
                    dateCached: new Date().getTime()
                };

            this._db.simpleAdd(categoryId,
                cacheBlock,
                function() {
                    Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._dbCacheCategories: Cached categories for id %s", categoryId);
                },
                function() {
                    Mojo.Log.error("Weave.Utilities.AppCategoriesHelper._dbCacheCategories: Unable to cache categories");
                }
            );
        },

        _dbFetchCategories: function(categoryCacheKey, categoryFilter, isParentCategory) {
            var self = this;

            //Attempt to pull categories from cache.  If missing, fetch and cache.
            this._db.simpleGet(categoryCacheKey,
                function(cachedCategoryObject) {
                    if (cachedCategoryObject === null || Object.toJSON(cachedCategoryObject) == "{}") {
                        Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._dbFetchCachedCategories: Retrieved empty or null list from depot for categoryCacheKey %s", categoryCacheKey);

                        self._fetchCategoriesFromServer(categoryCacheKey, categoryFilter, isParentCategory);
                    } else {
                        Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._dbFetchCachedCategories: categories pulled from cache %j", cachedCategoryObject);

                        //We have categories in the cache, but must verify they are recent enough to use
                        var validCache = self._isCacheValid(categoryCacheKey, cachedCategoryObject.dateCached);

                        if (validCache === true) {
                            //Construct menu items from existing cache
                            self._setupCategoryMenuItems(categoryFilter, isParentCategory, cachedCategoryObject.data);
                        } else {
                            Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._dbFetchCachedCategories: Stale category cache found.  Refreshing...");

                            //Stale data.  Refetch.
                            self._fetchCategoriesFromServer(categoryCacheKey, categoryFilter, isParentCategory);
                        }
                    }
                },
                function() {
                    Mojo.Log.error("Weave.Utilities.AppCategoriesHelper._dbFetchCachedCategories: Unable to fetch categories from depot");
                    return false;
                }
            );
        }
});
/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Utilities.AppVersions =
{
	isNewAppVersionAvailable: function(installedVersion, latestVersion)
        {
            Mojo.Log.info("Weave.Utilities.AppVersions::isNewAppVersionAvailable - %s : %s", installedVersion, latestVersion);

            //Save the parse overhead by first just comparing the strings for exact match
            if (installedVersion !== latestVersion) {
                var i,
                    testVal,
                    parsedInstalledVersion = this.parseAppVersionNumber(installedVersion),
                    parsedLatestVersion    = this.parseAppVersionNumber(latestVersion),
                    plvLength;

                if (parsedInstalledVersion === false || parsedLatestVersion === false) {
                    Mojo.Log.error("Unable to parse one of these versions numbers: %s, %s", parsedInstalledVersion, parsedLatestVersion);
                    return false; //something is wrong with the version number format, bail out and assume no update.
                }

                plvLength = parsedLatestVersion.length;
                for(i=0; i<plvLength; i++) {
                    testVal =  (parsedInstalledVersion[i] === undefined) ? 0 : parsedInstalledVersion[i];
                    if (testVal > parsedLatestVersion[i]) {
                        //A newer version is installed locally
                        return false;
                    } else if (testVal < parsedLatestVersion[i]) {
                        //A newer verion is available
                        return true;
                    } else {
                        //This part of the version matches, keep checking...
                    }
                }

                //If here then no new version available
                return false;
            } else {
                return false;
            }
        },

        /**
         * Assumes the following rules are enforced upstream:
         * 1) No non-numeric characters outside of "." are in use
         * 2) "." is the version delimiter
         **/
        parseAppVersionNumber: function(version){
            Mojo.Log.info("Weave.Utilities.AppVersions::parseAppVersionNumber %s", version);

            var i,
                versionParts = [],
                versionSplit,
                vsLength,
                acceptablePattern = /^\d[.|\d]*$/;

            if (version === undefined || typeof(version) !== 'string' || acceptablePattern.test(version) === false) {
                return false;
            } else {
                versionSplit = version.split('.');
            }

            vsLength = versionSplit.length;
            for (i=0; i<vsLength; i++) {
                versionParts[versionParts.length] = parseInt(versionSplit[i], 10);
            }

            return versionParts;
        },

        checkForUpdates: function(installedAppList, callback)
        {
            Mojo.Log.info("Weave.Utilities.AppVersions::checkForUpdates");

            try {
                Weave.Services.AppCatalogServer.getUserSession(function(status) {
                    if (!status) {
                        Mojo.Log.error("Weave.Utilities.AppVersions::checkForUpdates - Error trying to get user session");
                    } else {
                        var appsToCheck = [],
                            appVersionLookupList = [];

                        //Build an array of apps to have the server check and an optimized lookup table
                        for (var i=0; i<installedAppList.length; i++) {
                            appsToCheck[appsToCheck.length] = installedAppList[i].publicApplicationId;
                            appVersionLookupList[installedAppList[i].publicApplicationId] = installedAppList[i].installedVersion;
                        }

                        Mojo.Log.info("getApplicationsLatestVersion: Checking for updates on %d install apps", appsToCheck.length);
                        Weave.Services.AppCatalogServer.getApplicationsLatestVersion(appsToCheck, function(status, appResult) {
                            var listOfAvailableUpdates = [];

                            if (status) {
                                Mojo.Log.info("DEVELOPER ENV:Got getApplicationsLatestVersion: apps: [%j]", appResult);

                                //Determine the number of available updates
                                if (appResult) {
                                    for (var a=0; a<appResult.length; a++) {
                                        var installedVersion = appVersionLookupList[appResult[a].publicApplicationId],
                                            serverVersion    = appResult[a].appVersion,
                                            updateAvailable  = Weave.Utilities.AppVersions.isNewAppVersionAvailable(installedVersion, serverVersion);

                                        if (updateAvailable === true) {
                                            Mojo.Log.info("@@@@@App update is available: %s. Update from %s to %s.", appResult[a].publicApplicationId, installedVersion, serverVersion);
                                            listOfAvailableUpdates[listOfAvailableUpdates.length] = appResult[a];
                                        }
                                    }
                                }


                                return callback(listOfAvailableUpdates);
                            } else {
                                Mojo.Log.error("DEVELOPER ENV:Fail to getApplicationsLatestVersion");
                            }
                        });
                    }
                });
            } catch (exception) {
                Mojo.Log.error("Weave.Utilities.AppVersions::checkForUpdates - Exception calling getUserSession: " + exception);
            }
        }
};
/* Catalog.appStates
 * 
 * Global objects that represent all possible states for
 * a catalog application's download process.
 * 
 * State and Flyweight patterns combined.
 * That is, State objects are flyweight.
 * 
 * All per-download information like application id, price, location etc
 * is saved in an instance of appdownload object. State objects are shared
 * between all appdownload instances. They contain no extrinsic state.
 * 
 * Client (e.g. details scene) obtains an instance of appdownload object 
 * from the appdownloadmanager. This will be either an existing download or 
 * new download object. Client then makes calls on this download object for example:
 * 
 * appdownload->install
 * 
 * appdownload object delegates the call to it's current state passing 
 * itself as an argument:
 * 
 * appdownload::install 
 * {
 * 		this->_currentState->install(this);
 * }
 * 
 * 
 * Client subscribes as a listener on appdownload object.
 * When state of the download changes, appdownload object notifies 
 * all its current listeners which can then update their UI from the 
 * download object model.
 * 
 * 
 * State interface:
 * 
 * 
 * 
	// initializes app's internal data based on the current state
	// for example, progress pill model and css classes used in MyApps scene 
	// are changed with every state change 
	init(app)
	
	// updates internal data from app details
	// returned from the server. For example: if app is currently in
	// installed state, refreshing data from the server might cause it
	// to switch to "installed update available" state if server's version is 
	// higher 
	updateFromServer(app)
	
	// updates internal state from app details
	// returned from palm://com.palm.applicationManager/listApps. 
	// For example: if app was in "dummy" state this will cause it
	// to switch to "installed" state 
	updateFromInstalledAppsList(app)
	
	// called by details scene when user taps the progress pill.
	// Each state defines this method and depending on the current state 
	// of the object different thing will happen. If app is installed, 
	// it will be launched, if it's downloading it will be paused etc 
	defaultAction(app)
	
	// called by myapps scene when user taps the list item icon.
	// Each state defines this method and depending on the current state 
	// of the object different thing will happen. if app is downloading 
	// it will be paused etc 
	myAppsDefaultAction(app)
	
	// canceles download
	// only some states define this method (e.g "download progress")
	cancelDownload: function(app)
	
	// uninstalls the application
	// only some states define this method, (e.g "installed" state)
	uninstall: function(app)
	
	// resets the state of the object usually on error
	// it will forget about the current error and return the object back to
	// "download", "purchased" or "installed" state
	_reset: function(app)
	
	// resets the state of the object upon uninstalled notification
	_remove: function(app)
	
	// installs the application
	install: function(app)
	
	// returns true if download object in the current state should
	// be saved to myapps list maintained by appdownloadmanager.
	// appdownloadmanager listens for state changes on all existing
	// download objects and decides which ones should be saved to myApps list.
	// The general rule is: any downloads in progress + installed applications
	saveToMyApps: function()
	
	// returns true if download object in the current state should
	// be removed from myapps list maintained by appdownloadmanager.
	// appdownloadmanager listens for state changes on all existing
	// download objects and decides which ones should be saved/removed to/from myApps list.
	// The general rule is: any downloads in progress + installed applications
	// if user decides to give up on a download (due to an error for example)
	// app will be reset back to "download" state and removed from myApps list
	removeFromMyApps: function()
	
	// returns current state's string identifier
	toString: function()
	
	
*/


var Catalog 		= Catalog || {}; 
Catalog.appStates 	= Catalog.appStates || new Array();


// common functions, can be called from multiple states
Catalog.appStatesCommon = {
						
	_1xCarrierDialog: 
	{
		"sprint": {title: $L("No 3G Data Network"), message: $L("You will be unable to receive phone calls while the application is downloading."), choices: [{label: $L("Cancel"), value: "cancel", type: 'secondary'}, { label: $L("Download"), value: "download", type: 'primary'}]},
		"default": {title: $L("No 3G Data Network"), message: $L("The app will download slowly because a high-speed network is not available. You can download later when you have a 3G or wifi data connection. If you paid for the app, you will not be charged again."), choices: [{label: $L("Download Later"), value: "cancel", type: 'secondary'}, { label: $L("Download Now"), value: "download", type: 'primary'}]}
	},
		
	_verifyPaymentSetup: function(callback)
	{
		if (myProfile.validPayment !== undefined)
		{
			callback(true, myProfile.validPayment);
		}
		else
		{
			// another state while checking payment setup?
			// but that step is not very critical, so what if we check it twice
			Weave.Services.PaymentServer.verifyPaymentSetup(function(status, response)
			{
				if (status) 
				{
					myProfile.validPayment = response;
				}
				callback(status, response);
			});
		}
	},
	
	// Get promo code from on-device database: 'promoDB'
	// callback: function(promocode)
	_getPromoFromDBExt: function(callback) {
		var self = this;
		
		if(!self._promoDB) {
			self._promoDB = new Mojo.Depot({
				name:"promoDB", version:1, estimatedSize: 500, replace: false},
				function() {
					Mojo.Log.info("PromoDB load/create done!");
				},
				function(result) {
					Mojo.Log.error("PromoDB load/create failed: ", result);
				}
			);
		}
		
		self._promoDB.get("promoCode", 
				function(pc) { 
					callback(true,pc);
					Mojo.Log.info("promoDB code get done, pc:%s", pc);
				},
				function(result) { 
					callback(false);
					Mojo.Log.error("promoDB code get fail: ", result); 
				}
		);
	},
	
	// Get promo code from on-device database: 'promoDB'
	// callback: function(promocode)
	_savePromoFromDBExt: function(promoCode, callback) {
		var self = this;
		
		if(!self._promoDB) {
			self._promoDB = new Mojo.Depot({
				name:"promoDB", version:1, estimatedSize: 500, replace: false},
				function() {
					Mojo.Log.info("PromoDB load/create done!");
				},
				function(result) {
					Mojo.Log.error("PromoDB load/create failed: ", result);
				}
			);
		}
		
		self._promoDB.add("promoCode", promoCode,
				function() { 
			        callback(true);
					Mojo.Log.info("promoDB code save done, promocode:%s", promoCode);
				},
				function(result) { 
					callback(false);
					Mojo.Log.error("promoDB code save fail: ", result); 
				}
		);
	},
	
	// To purchase the application with promo code then start download
	_purchaseWithPromoCode: function(app, code, response, callback)
	{
		Mojo.Log.info("Catalog.appStatesCommon._purchaseWithPromoCode: purchasing %s, %s", app.title, app.id)
		// User has validate the purchase - we make it now.
		var d = app;
		var now = new Date();
		var ms = '' + now.getMilliseconds() ;
		while (ms.length < 3) { // pad out to 3 places
		    ms = '0' + ms;
	    }

		var timestamp = Mojo.Format.formatDate(now, {format: 'yyyyMMddHHmmss'}) + ms; // Format yyyyMMddHHmmssSSS

		var orderObj =
		{
			timestamp: timestamp, 
			currency: d.currency,
			items:
			[{
				type: d.priceType,
				promoCode: code,
				quantity: "1",
				sku: d.sku,
				unitPrice: d.price
			}]
		};
		
		app.setState("purchasing");
		Mojo.Log.info("Order Object: %j", orderObj.items[0]);
		Weave.Services.PaymentServer.capturePayment( orderObj, function(status, response)
		{
			if (status)
			{
				// Payment successful - download
				Mojo.Log.info("Catalog.appStatesCommon._purchaseWithPromoCode: purchased");
				app.setState("purchased", {version: app.serverVersion, transitional: true});
				callback(true);
				
				if(response.OutCapturePayment.promoCodeStatus=="R") {
					// If promo code status is "Redeemed", to delete promo code from database.
					Catalog.appStatesCommon._savePromoFromDBExt("",function(status){});
					// Use cookie to replace deposit for synchronization
					var cookiePC = new Mojo.Model.Cookie("PromoCode");
					cookiePC.put("");
					Mojo.Log.info("DownloadState, promocode cookie store for redeemed code:[empty]");
				}
			}
			else
			{
				Mojo.Log.error("Catalog.appStatesCommon._purchaseWithPromoCode: purchase failed %j", response);
				var err = (response && response.errorCode) ? response.errorCode : response;
				app.setState("purchase_failed", {errorCode: err});
			}
		});
	},
	
	// To go to promo code dialog to let user edit the promo code
	_gotoPromoCodeDialog: function(app, pcode, eCode, response, callback)
	{
		var stage = Weave.System.Activator.getActiveStageController();
		if (stage && stage.topScene()) 
		{
			stage.topScene().showDialog(
			{
				template: 'payment-setup/promocode-dialog',
				assistant: new PromoCodeAssistant(stage.topScene().assistant, 
				{
					appid: app.publicApplicationId, 
					version: app.serverVersion,
					title: app.title,
					promoCode: pcode,
					errCode: eCode,
					onComplete: function(info)
					{
						Mojo.Log.info("Catalog.appStatesCommon._gotoPromoCodeDialog promo code valid: %s ,promo code is:%s", info.promoCodeValid,info.promoCode);
						
						if (info.promoCodeValid)
						{
							Catalog.appStatesCommon._purchaseWithPromoCode(app, info.promoCode, response, callback);
						}
						else
						{
							Catalog.appStatesCommon._makePurchase(app, response, callback);
						}
					}
				})
			});
		
	    }
	},
	
	// To verify the promo code then start download
	_verifyPromoCode: function(app, response, callback)
	{
		var gotoPromoCodeEditor = false;
		var delPromoCode = false;
		var errorCode = "";
		var promoCode = "";
		// Get promo code from database
		Catalog.appStatesCommon._getPromoFromDBExt(function(status,code){
        	Mojo.Log.info("promoDB code get done, pc:%s", code);
        	promoCode = code;
        	//test
        	//promoCode = "";
        	//promoCode = undefined;
        	
        	if (status && (promoCode != undefined) && (promoCode != "")) {
        	
        		// Check promo code status
        		Weave.Services.PaymentServer.checkPromoCodeStatus(promoCode, app.publicApplicationId, app.serverVersion, function(status, response)
        		{			
        			if (status) 
        			{		
        				if (response.OutCheckPromoCodeStatus.valid == "true") 
        				{
        					// Promo code is valid, start to purchase 
        					Catalog.appStatesCommon._purchaseWithPromoCode(app, promoCode, response, callback);
        				}
        				else if (response.OutCheckPromoCodeStatus.valid == "false")
        				{
        					// Promo code is invalid, go to editor
        					gotoPromoCodeEditor = true;
        					errorCode = response.OutCheckPromoCodeStatus.errorCode;
        					if ((errorCode == "PMTPROMO70101")||(errorCode == "PMTPROMO70102")||(errorCode == "PMTPROMO70103")||(errorCode == "PMTPROMO70104")) 
        					{
        						// If error is redeemed, revoked, expired,suspended,to delete the promo code from database.
        						delPromoCode = true;
        					}
        				}
        			}
        			else 
        			{				
        				// Promo code is invalid, go to editor
        				gotoPromoCodeEditor = true;
        				errorCode = response.errorCode;
        				// If error is invalid, to delete the promo code from database.
        				delPromoCode = true;
        			}
        			
        			Mojo.Log.info("Catalog.appStatesCommon._verifyPromoCode promoCode:%s, errorCode:%s", promoCode,errorCode);
        			if (gotoPromoCodeEditor) 
        			{        				
        				// Promo code is invalid, go to editor
        				Catalog.appStatesCommon._gotoPromoCodeDialog(app, promoCode, errorCode, response, callback);
        			}
        			
        			if (delPromoCode) 
        			{
        				Catalog.appStatesCommon._savePromoFromDBExt("",function(status){});
        			}
        		});
        	}else {
        		// Promo code is empty, go to editor
        		promoCode = "";
        		errorCode = "";
				Catalog.appStatesCommon._gotoPromoCodeDialog(app, promoCode, errorCode, response, callback);
        	}
		});

	},
	_makePurchase: function(app, response, force, callback) 
	{
		var self = this;
		
		Mojo.Log.info("## _makePurchase with callback %s", callback);

		// response is from getPaymentInfos
	
		var cc = response.OutGetPaymentInfos.ccPaymentInfos.length ? response.OutGetPaymentInfos.ccPaymentInfos[0] : null;
		var ob = response.OutGetPaymentInfos.obPaymentInfos.length ? response.OutGetPaymentInfos.obPaymentInfos[0] : null;

		if (force) {
			// Forcing a payment type
	
			// Null out the other
			if (force == "cc") {
				ob = null;
			} else {
				cc = null;
			}
		}
	
		if (cc && ob) {
			// Both types of payment are set up: choose the default by nulling the other
			if (cc["default"]) {
				ob = null;
			} else {
				cc = null;
			}
		}
	
		if (cc) {
			app.paymentType = "cc";
		} else if (ob) {
			app.paymentType = "ob";
		} else {
			Mojo.Log.error("## Making purchase with no valid payment method.")

			app.setState("download");
			callback(false);
			return;	
		}
	
		Mojo.Log.info("## _makePurchase using %s", app.paymentType);

		if (!Weave.Services.ConnectionManager.isOnline()) 
		{
			app.setState("download");
			callback(false);
			return;	
		}
	
		var stage = Weave.System.Activator.getActiveStageController();
		if (stage && stage.topScene()) 
		{
			var accountName = (cc ? $L("credit card") : $L("carrier account"));

			stage.topScene().showAlertDialog(
			{
				allowHTMLMessage: true,
				message: $L('Purchase #{title}?<br/><br/>Your #{account} will be charged.').interpolate({title: app.title, account: accountName}),
				choices:
				[
					{ label: $L("Purchase"), value: "ok", type: 'affirmative' }, 
					{ label: $L("Use Promo Code"), value: "promo"},
					{ label: $L("Cancel"), value: "cancel", type: 'dismiss'}
				],
				onChoose: function(value)
				{
					if (value == "ok") 
					{
						Mojo.Log.info("Catalog.appStatesCommon._makePurchase: purchasing %s, %s", app.title, app.id)

						// User has validate the purchase - we make it now.
						// Set the state as "purchasing"
					    app.setState("purchasing");

						if (ob) {
							self._startOBPayment(app, ob, callback);
						} else {
							self._capturePayment(app, cc, callback);
						}
					}
					else if (value == "promo") 
					{
						Catalog.appStatesCommon._verifyPromoCode(app, response, callback);
					}
					else 
					{
						app.setState("download");
						callback(false);
					}
				}
			});
		}
		else
		{
			app.setState("download");
			callback(false);	
		}
	},
	
	_startOBPayment: function(app, ob, callback) {
		Mojo.Log.info("## _startOBPayment called");
		var self = this;
		// getOBInfos gets a URL
		// initSession hits that URL and gets a sessionID
		// Capturepayment sends the sessionID

		Weave.Services.PaymentServer.getOBInfos(function(status, response) {
			Mojo.Log.info("## getOBInfos returned %j", response);
			
			/* Sample: 
			{"OutGetOBInfos": {"devicePoll": {"period": 1, "timeout": 5}, "initSession": {"submitMethod": "POST", "URL": "http://payment-cie.openmarket.com/appbilling/v1/session"}}}
			*/

			if (status) {
				var obInfos = response.OutGetOBInfos;
				
				Weave.Services.PaymentServer.initOBSession(obInfos, function(status, response) {
					if (status) {

						Mojo.Log.info("## Handling initOBSession success with %s", response);
						/* Sample:
						<?xml version="1.0" encoding="UTF-8" standalone="yes"?><session xmlns="http://payment.openmarket.com/appbilling/v1" state="ACTIVE" phoneNumber="14084314136" id="YEp10McY27uY4038ar08"><carrier id="383">ATT</carrier></session>
						*/
					
						// Get ID from XML and add to paymentInfo
						ob.obSessionId = response.getElementsByTagName("session")[0].getAttribute("id");
					
						// Add polling info to ob info
						ob.devicePoll = obInfos.devicePoll;

						self._capturePayment(app, ob, callback);
					} else {
						Mojo.Log.info("## Handling initOBSession failure with %s", response);
						
						var errorCode;
						var err;

						if (response && response.getElementsByTagName && response.getElementsByTagName("error")) {
							Mojo.Log.info("## Setting initOBSession error code from Open Market");
							errorCode = response.getElementsByTagName("error")[0].getAttribute("code");
						}
						
						if (errorCode == 2045 || errorCode == 2126) {
							// Use PMT05213, carrier not supported for these OpenMarket errors
							err = "PMT05213";
						} else {
							err = errorCode ? ("PMTINIT" + errorCode) : response;
						}
						
						app.setState("purchase_failed", {errorCode: err});
					}
				});
			} else {
				Mojo.Log.info("## getOBInfos failed with %s", response);

				var err = (response && response.errorCode) ? response.errorCode : response;
				app.setState("purchase_failed", {errorCode: err});
			}
		});	
	},
	
	_capturePayment: function(app, paymentInfo, callback) {
		var self = this;
		
		var d = app;
		var now = new Date();
		var ms = '' + now.getMilliseconds() ;
		while (ms.length < 3) { // pad out to 3 places
		    ms = '0' + ms;
	    }

		var timestamp = Mojo.Format.formatDate(now, {format: 'yyyyMMddHHmmss'}) + ms; // Format yyyyMMddHHmmssSSS

		var orderObj =
		{
			paymentInfoId: paymentInfo.paymentInfoId,
			obSessionId: paymentInfo.obSessionId,
			timestamp: timestamp, 
			currency: d.currency,
			items:
			[{
				type: d.priceType,
				quantity: "1",
				sku: d.sku,
				unitPrice: d.price
			}]
		};
		
		Mojo.Log.info("## Order Object: %j", orderObj.items[0]);
		
		Weave.Services.PaymentServer.capturePayment(orderObj, function(status, response)
		{
			// testing
			// status = false; 
			// response.errorCode = "PMT04004";
			
			if (status)
			{
				// Payment successful - download
				if (paymentInfo.devicePoll)
				{
					// We need to poll for order completion
					Mojo.Log.info("## Catalog.appStatesCommon._makePurchase: purchase pending %j", response);
					/* Sample: {"OutCapturePayment": {"orderNo": 427}} */
					var orderNo = response.OutCapturePayment.orderNo;
					var pollingEnds = new Date().getTime() + (paymentInfo.devicePoll.timeout * 1000);
					var pollingInterval = (paymentInfo.devicePoll.period * 1000);
					
					self._pollForOrderStatus(app, orderNo, pollingEnds, pollingInterval, callback);
				}
				else
				{
					// Order successful
					Mojo.Log.info("## Catalog.appStatesCommon._makePurchase: purchase succeeded %j", response);
					app.setState("purchased", {version: app.serverVersion, transitional: true});
					callback(true);
				}
			}
			else
			{
				Mojo.Log.error("## Catalog.appStatesCommon._makePurchase: purchase failed %j", response);
				var err = (response && response.errorCode) ? response.errorCode : response;
				if (err == "PMT03037") { // You have already purchased this app
					Mojo.Log.info("## Item already purchased. Downloading now.");
					app.setState("purchased", {version: app.serverVersion, transitional: true});
					app.install();
					Utilities.Errors.displayError(err);
				} else {
					app.setState("purchase_failed", {errorCode: err});
				}
			}
		});	
	},
	
	_pollForOrderStatus: function(app, orderNo, pollingEnds, pollingInterval, callback) {
		Mojo.Log.info("## _pollForOrderStatus with interval %s", pollingInterval);
		var self = this;
		
		Weave.Services.PaymentServer.getOrderStatus(orderNo, function(status, response)
		{
			Mojo.Log.info("## Catalog.appStatesCommon._makePurchase: purchase polled %j", response);
			if (status)
			{
				if (response.OutGetOrderStatus.status == "NEW" 
					|| response.OutGetOrderStatus.status == "RENEWED") {
					// More polling	
					if (new Date().getTime() < pollingEnds) {
						setTimeout(self._pollForOrderStatus.bind(self, app, orderNo, pollingEnds, pollingInterval, callback), pollingInterval);
					} else {
						// Timed out
						Mojo.Log.info("## makePurchase: OB purchase timed out.")
						app.setState("purchase_pending", {errorCode: "inprogress"});
					}
				} else if (response.OutGetOrderStatus.status == "CLOSED") {
					// Success
					app.setState("purchased", {version: app.serverVersion, transitional: true});
					callback(true);
				} else if (response.OutGetOrderStatus.status == "DECLINED") {
					// Declined
					Mojo.Log.error("## Catalog.appStatesCommon._makePurchase: OB purchase declined %j", response);
					var err = (response.OutGetOrderStatus.code || response);
					app.setState("purchase_failed", {errorCode: err});
				} else {
					// Undefined behaviour
					Mojo.Log.error("## Catalog.appStatesCommon._makePurchase: OB purchase failed %j", response);
					app.setState("purchase_pending", {errorCode: "inprogress"});
				}
			}
			else
			{
				// Failure
				Mojo.Log.error("## Catalog.appStatesCommon._makePurchase: OB purchase failed with status %j", response);
				app.setState("purchase_pending", {errorCode: "inprogress"});
			}
		});
	},
	
	// set only the current state of this function, "validating_cc"
	// in case of error it's up to the caller to restore previous state
	_handleVerifyPayment: function(app, valid, force, callback)
	{	
		Catalog.appStatesCommon._verifyPaymentSetup(function(status, response) 
		{
			if (status) 
			{
				Mojo.Log.info("## Called verifyPaymentSetup and got response %j", response);
				
				if (response.OutGetPaymentInfos.ccPaymentInfos.length > 0
					|| response.OutGetPaymentInfos.obPaymentInfos.length > 0) 
				{	
					// check if user needs to enter password
					if (!valid) 
					{	
						var stage = Weave.System.Activator.getActiveStageController();
						if (stage && stage.topScene()) 
						{
							stage.topScene().showDialog(
							{
								template: 'payment-setup/password-dialog',
								assistant: new PasswordAssistant(stage.topScene().assistant, 
								{
									appid: app.id, 
									onComplete: function(info)
									{
										Mojo.Log.info("Catalog.appStatesCommon._handleVerifyPayment password valid: ", info.passwordValid);
										if (info.passwordValid)
										{
											Catalog.appStatesCommon._makePurchase(app, response, force, callback);
										}
										else
										{
											callback(false);
										}
									}
								})
							});
						}
						else
						{
							callback(false);
						}
					}
					else 
					{
						Catalog.appStatesCommon._makePurchase(app, response, null, callback);
					}
				} 
				else 
				{
					// forward to set up account
					Mojo.Log.info("## Catalog.appStatesCommon._handleVerifyPayment no payment set up");
					var stage = Weave.System.Activator.getActiveStageController();
					if (stage) 
					{
						Mojo.Log.info("Catalog.appStatesCommon._handleVerifyPayment app.promoLink:%s",app.promoLink);
						if (app.promoLink) {
							if (stage.topScene())
							{
								stage.topScene().showAlertDialog(
										{
											allowHTMLMessage: true,
											title: $L("Promo Code"),
											message: $L('Before you can use a promo code, you must first set up payment information.'),
											choices:
											[
												{ label: $L("OK"), value: "ok" }
											],
											onChoose: function(value)
											{
												if (value == "ok") 
												{
													stage.pushScene("payment-setup", app.id, function(ret)
															{
																Mojo.Log.info("## Catalog.appStatesCommon._handleVerifyPayment payment setup callback ret %j", ret);
																if (ret.accountValid) 
																{
																	Catalog.appStatesCommon._handleVerifyPayment(app, true, null, callback);
																}
																else 
																{
																	callback(false);
																}
															});
												}
											}
											
										});		
							}
						}else {
						
						stage.pushScene("payment-setup", app.id, function(ret)
						{
							Mojo.Log.info("## Catalog.appStatesCommon._handleVerifyPayment payment setup callback ret %j", ret);
							if (ret.accountValid) 
							{
								Catalog.appStatesCommon._handleVerifyPayment(app, true, null, callback);
							}
							else 
							{
								callback(false);
							}
						});
						}
					}
					else 
					{
						callback(false);
					}
				}
			} 
			else 
			{
				callback(false);
				Mojo.Log.error("Error retrieving payment setup");
				Utilities.Errors.displayError(response.errorCode, {errCode: response.errorCode}, "PMT_catchAll");
			}
		});				
    },
	
	_validateRegion: function(app) 
	{
		Mojo.Log.info("Catalog.appStatesCommon._validateRegion uscarrier: ", myProfile.uscarrier)
		if (app.price > 0 && !myProfile.uscarrier)
		{
			var stage = Weave.System.Activator.getActiveStageController();
			if (stage && stage.topScene()) 
			{
				stage.topScene().showAlertDialog({
					title: $L('Sorry, Application Unavailable'),
					message: $L('This application is not available in your region.'),
					choices: [{
						label: $L("OK"),
						value: true,
						type: 'primary'
					}, ]
				});
			}
			return false;
		}
		return true;
	},
	
	_handleEmbargoAcc: function(app ,callback){
		if(myProfile.isEmbargoed)
		{
			if (app.price > 0)
			{
				Utilities.Errors.displayError("PMT_cant_purchase", {}, null, null, null, function(value)
				{
	                if (value == 'help') {
	                    Weave.Services.ConnectionManager.getStatus(function(online){
	                        Weave.Services.ApplicationManager.openApplication('com.palm.app.help', {
	                            target: online ? 'http://help.palm.com/app_catalog/appcatalog_download_error.html' : 'no-network'
	                        });
	                    });
	                    
	                }
	            });
			}
			else
				Utilities.Errors.displayError("PMT_cant_download_encrypted");
			callback(false);
		}
		else
			callback(true);
	},
	
	_checkNotEmbargoed: function(app, callback)
	{
		if (app.price > 0 || app.isEncrypted) {
			if (myProfile.isEmbargoed !== undefined) {
				this._handleEmbargoAcc(app, callback);
			}
			else {
				var ext = myProfile.email.substring(myProfile.email.lastIndexOf(".") + 1);
				
				if (AppAssistant.embargoedList) {
					myProfile.isEmbargoed = AppAssistant.embargoedList.indexOf(ext) != -1;
					this._handleEmbargoAcc(app, callback);
				}
				else {
					var self = this;
					Weave.Services.PaymentServer.getEmbargoedEmailExtensions(function(status, response){
						Mojo.Log.info("getEmbargoedCountryList %j", response);
						if (status) {
							AppAssistant.embargoedList = response.OutGetEmbargoedEmailExtensions.embargoedEmailExtensions;
							myProfile.isEmbargoed = AppAssistant.embargoedList.indexOf(ext) != -1;
							self._handleEmbargoAcc(app, callback);
						}
						else {
							var err = (response && response.errorCode) ? response.errorCode : response;
							Mojo.Log.error("Error retrieving embargoed ext");
							Utilities.Errors.displayError(err, {
								errCode: err
							}, "PMT_catchAll");
						}
					});
				}
			}
		}
		else
			callback(true);
	},
	
	_forcePaymentType: function(app, type, callback) {
		var self = this;
		
		var callback = function(status) {
			if (status) 
			{
				Catalog.appStatesCommon._install(app);
			}
			else 
			{
				// reset back in case of error
				app.setState("download");
			}
		};

		app.setState("download");
		
		if (type == "cc") {
			if (myProfile.validPayment.OutGetPaymentInfos.ccPaymentInfos.length) {
				// Have a valid CC
				self._makePurchase(app, myProfile.validPayment, "cc", callback) 
			} else {
				// Set up CC			
				var stage = Weave.System.Activator.getActiveStageController();
				stage.pushScene('create-account', { appid: app.id, onComplete: function() {
					self._handleVerifyPayment(app, true, "cc", callback);					
				}});						
			}
		} else { // type == "ob"
			if (myProfile.validPayment.OutGetPaymentInfos.obPaymentInfos.length) {
				// Have a valid OB
				self._makePurchase(app, myProfile.validPayment, "ob", callback) 
			} else {
				// Set up OB
				var stage = Weave.System.Activator.getActiveStageController();

				stage.pushScene('create-carrier', { appid: app.id, email: myProfile.email, onComplete: function() {
					self._handleVerifyPayment(app, true, "ob", callback);					
				}});						
			}
		}
	},
	
	_handleLocationServices: function(app, callback)
	{
		Mojo.Log.info("Catalog.appStatesCommon._handleLocationServices app.islocationbased", app.islocationbased);
		if (app.islocationbased)
		{
			var stage = Weave.System.Activator.getActiveStageController();
			if (stage && stage.topScene()) 
			{
				stage.topScene().showAlertDialog({
					onChoose: function(value) {
						if (value == "continue") {
							callback(true);
						}
						else {
							callback(false);
						}
					},
					title: $L('Location Services'),
					message: $L('This application will request your current location for some functions.'),
					choices: [{
						label: $L("Don't Download"),
						value: "cancel",
						type: 'dismiss'
					}, {
						label: $L("Continue"),
						value: "continue",
						type: 'affirmative'
					}]
				});
			}
			else
			{
				callback(false);
			}
		}
		else
		{
			callback(true);
		}
	},
	
	validateInstallSpace: function(app, showError, callback)
	{
		Mojo.Log.info("Catalog.appStatesCommon.validateInstallSpace");
		
		Weave.Services.ApplicationInstaller.validateInstall(app.publicApplicationId, app.packageSize, app.installSize, function(status, response)
		{
			if (status == true)
			{
				callback(true);
			}
			else
			{
				Mojo.assert(response && response.spaceNeededInKB, "Catalog.appStatesCommon.validateInstallSpace validateInstall failed but spaceNeededInKB is not defined");

				var totalInstallSize;
				if (response && response.spaceNeededInKB) 
				{
					totalInstallSize = parseInt(response.spaceNeededInKB);
					totalInstallSize = totalInstallSize >= 1024 ? Mojo.Format.formatNumber(totalInstallSize/1024, {fractionDigits: 2}) + $L("M") : totalInstallSize + $L("K");
				}
				else 
				{
					totalInstallSize = $L("unknown MB");
				}
			
				Utilities.Errors.displayError("dummy", {installSize: totalInstallSize}, showError, null, null, function(value)
				{
                	if (value == 'help')
                    {
                        Weave.Services.ConnectionManager.getStatus(function(online)
                        {
                            Weave.Services.ApplicationManager.openApplication('com.palm.app.help',
                            {
                                target: online ? 'http://help.palm.com/basics/manage_applications/basics_delete_app_from_launcher.html' : 'no-network'
                            });
                        });
                    }
	        	});
				
				callback(false);
			}
		});
	},
	
	validateDownloadConnection: function(callback)
	{
		if (Weave.Services.ConnectionManager.isOn1x()) 
		{
			Mojo.Log.info("Catalog.appStatesCommon.validateDownloadConnection connection is 1x");
			if (Catalog.AppDownloadMngr.canAllow1xDownload())
			{
				// user already decided to allow 1x download
				Mojo.Log.info("Catalog.appStatesCommon.validateDownloadConnection canAllow1xDownload == true")
				callback(true);
			}
			else 
			{
				Mojo.Log.info("Catalog.appStatesCommon.validateDownloadConnection prompt user for 1x permission")
				var stage = Weave.System.Activator.getActiveStageController();
				if (stage && stage.topScene()) 
				{
					// get correct dialog based on carrier
					var dialog = Catalog.appStatesCommon._1xCarrierDialog[myProfile.carrier];
					if (!dialog) 
						dialog = Catalog.appStatesCommon._1xCarrierDialog["default"];
						
					stage.topScene().showAlertDialog(
					{
						onChoose: function(value) 
						{
							if (value == "cancel") 
							{
								callback(false);
							}
							else if (value == "download") 
							{
								Catalog.AppDownloadMngr.allow1xDownload(true, function(status)
								{
									Mojo.Log.info("Catalog.appStatesCommon.validateDownloadConnection allow1xDownload returned status %s", status)
									callback(status);	
								});
							}
						},
						title: dialog.title,
						message: dialog.message,
						choices: dialog.choices
					});
				}
				else 
				{
					callback(false);
				}
			}
		}
		else if (Weave.Services.ConnectionManager.isOnline())
		{
			callback(true);
		}
		else 
		{
			callback(false);
		}
	},
	
	_install: function(app)
	{
		Catalog.appStatesCommon.validateDownloadConnection(function(status)
		{ 
			var oldState = app.stateToString();
			if (status)
			{
				app.setState("fake progress");
				
				Mojo.Log.info("Catalog.appStatesCommon._install: ", app.publicApplicationId);
				Weave.Services.AppInstallService.install(app, function(status, response)
				{
					if (!status)
					{
						Mojo.Log.error("Catalog.appStatesCommon._install failed %s: %j, returing to state %s", app.publicApplicationId, response, oldState);
						// if we are still waiting revert to old state
						if (app.stateToString() == "fake progress")
							app.setState(oldState);
					}
				});
			}
			/*
			else 
			{
				// force refresh
				if (app.stateToString() == oldState)
					app.setState(oldState);
			}
			*/
		});
	},
	
	_revert: function(app, revertableApp)
	{
		Mojo.Log.info("Catalog.appStatesCommon._revert: ", revertableApp.id);
		Weave.Services.AppInstallService.installLocal(revertableApp, function(status, response)
		{
			if (!status)
			{
				Mojo.Log.error("Catalog.appStatesCommon._install failed %s: %j", revertableApp.id, response);
				
			}
		});
	},
	
	_pause: function(app)
	{
		var oldState = app.stateToString();
		app.setState("pausing");
				
		Mojo.Log.info("Catalog.appStatesCommon._pause: ", app.publicApplicationId);
		Weave.Services.AppInstallService.pause(app.publicApplicationId, function(status, response)
		{
			if (!status)
			{
				Mojo.Log.error("Catalog.appStatesCommon._pause failed %s, %j, returing to state %s", app.publicApplicationId, response, oldState);
				// if we are still waiting revert to old state
				if (app.stateToString() == "pausing")
					app.setState(oldState);
			}
		});
	},
	
	_resume: function(app)
	{
		Catalog.appStatesCommon.validateDownloadConnection(function(status)
		{
			if (status)
			{
				var oldState = app.stateToString();
				app.setState("resuming");
				
				Mojo.Log.info("Catalog.appStatesCommon._resume: ", app.publicApplicationId);
				Weave.Services.AppInstallService.resume(app.publicApplicationId, function(status, response)
				{
					if (!status)
					{
						Mojo.Log.error("Catalog.appStatesCommon._resume failed %s, %j, returing to state %s", app.publicApplicationId, response, oldState);
						// if we are still waiting revert to old state
						if (app.stateToString() == "resuming")
							app.setState(oldState);
					}
				});
			}
		});
	},
	
	_cancel: function(app)
	{
		var oldState = app.stateToString();
		app.setState("canceling");
		
		Mojo.Log.info("Catalog.appStatesCommon._cancel: ", app.publicApplicationId);
		Weave.Services.AppInstallService.cancel(app.publicApplicationId, function(status, response)
		{
			if (!status)
			{
				Mojo.Log.error("Catalog.appStatesCommon._cancel failed %s, %j, returing to state %s", app.publicApplicationId, response, oldState);
				// if we are still waiting revert to old state
				if (app.stateToString() == "canceling")
					app.setState(oldState);
			}
		});	
	},
	
	_uninstall: function(app)
	{
		var oldState = app.stateToString();
		app.setState("removing");
		
		Mojo.Log.info("Catalog.appStatesCommon._uninstall: ", app.publicApplicationId);
		Weave.Services.AppInstallService.remove(app.publicApplicationId, function(status, response)
		{
			if (!status)
			{
				Mojo.Log.error("Catalog.appStatesCommon._uninstall failed %s, %j, returing to state %s", app.publicApplicationId, response, oldState);
				// if we are still waiting revert to old state
				if (app.stateToString() == "removing")
					app.setState(oldState);
			}
		});
	},
	_restore: function(app)
	{
		if (app.errorCode == "FAILED_IPKG_INSTALL") {
			var oldState = app.stateToString();
			Mojo.Log.info("Catalog.appStatesCommon._restore: ", app.publicApplicationId);
			Weave.Services.AppInstallService.remove(app.publicApplicationId, function(status, response){
				if (!status) {
					Mojo.Log.error("Catalog.appStatesCommon._restore (removing) failed %s, %j, returing to state %s", app.publicApplicationId, response, oldState);
					// if we are still waiting revert to old state
					if (app.stateToString() == "install failed") 
						app.setState(oldState);
				}
			});
		}
		else{
			Catalog.appStatesCommon._cancel(app);
		}
	},
	
	_reset: function(app)
	{	 if (app.installedVersion)
		{
			// we were installing an update
			if (app.serverVersion && Utilities.VersionCheck.compare(app.installedVersion, app.serverVersion) == -1) 
			{
				app.setState("installed update available");
			}
			else 
			{
				app.setState("installed");
			}
		}
		else if (app.price && app.price > 0) 
		{
			app.setState("purchased");
		}
		else
		{
			app.setState("download");
		}
	},
	
	_remove: function(app)
	{
		app.installedVersion = null;
		if (app.pendingRevert) {
			Mojo.Log.info("starting Revert");
			app.pendingRevert = false;
			app.setState("download");
			// var newapp = null; //Catalog.AppDownloadMngr.getAppDownload(app.publicApplicationId);
			Catalog.appStatesCommon._revert(null, Catalog.AppDownloadMngr.getDetailsRevertableApp(app.publicApplicationId));
		}
		else {
			//app.icon = null;
			if (app.price && app.price > 0) {
				app.setState("purchased");
			}
			else {
				app.setState("download");
			}
		}
	}
};

// use dummy until we find out the correct state
Catalog.appStates["dummy"] = {
	
	init: function(app, args) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'none';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = undefined;
		app._progressPillModel.title = $L('Getting data...');
		
		app.disabledClass = null;
		app.updateClass = null;
		app.activeClass = null; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = null;
	},
	
	updateFromServer: function(app) 
	{	
		this._update(app);
	},
	
	updateFromInstalledAppsList: function(app)
	{
		this._update(app);
	},
	
	_update: function(app)
	{
		var state = "download";
		
		if (app.purchasedVersion)
		{
			state = 'purchased';
		}
		
		if (app.installedVersion) 
		{
			state = 'installed';
			if (app.serverVersion && Utilities.VersionCheck.compare(app.installedVersion, app.serverVersion) == -1) 
			{
				state = "installed update available";
			}
		}
		
		app.setState(state);
	},
	
	toString: function()
	{
		return "dummy";
	}
};

/*
 * Transitional states
 * 
 * object is in a transitional state while we
 * are waiting for a response from appInstallService. While object is in
 * these states user can't perform almost any action (except deleting an app)
 * transitional states: pausing, deleting, resuming, canceling, fake progress
 *  
 */
Catalog.appStates["fake progress"] = {
	
	init: function(app) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'action-icon';
		app._progressPillModel.image = 'images/download-icon.png';
		app._progressPillModel.title = $L('Downloading...');
		app._progressPillModel.value = 0;
		
		app.disabledClass = "disabled";
		app.updateClass = null;
		app.activeClass = "active"; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = null;
	},

	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	saveToMyApps: function()
	{
		return true;
	},

	toString: function()
	{
		return "fake progress";
	}
};

Catalog.appStates["pausing"] = {
	
	init: function(app) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'none';
		app._progressPillModel.image = undefined;
		app._progressPillModel.title = $L('Pausing...');
		
		app.disabledClass = "disabled";
	},
	
	// after we send pause request we are in 
	// "pausing..." state, at that point we ignore additional 
	// progress updates that come before the final "paused" state
	_allowTransition: function(newState)
	{
		if (newState == "download progress")
			return false;
		
		return true;
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	saveToMyApps: function()
	{
		return true;
	},

	toString: function()
	{
		return "pausing";
	}
};

Catalog.appStates["resuming"] = {
	
	init: function(app) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'none';
		app._progressPillModel.image = undefined;
		app._progressPillModel.title = $L('Resuming...');
		
		app.disabledClass = "disabled";
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	saveToMyApps: function()
	{
		return true;
	},

	toString: function()
	{
		return "resuming";
	}
};

Catalog.appStates["removing"] = {
	
	init: function(app) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'none';
		app._progressPillModel.image = undefined;
		app._progressPillModel.title = $L('Deleting...');
		app._progressPillModel.value = 1;
		
		app.disabledClass = "disabled";
		app.updateClass = null;
		app.activeClass = null; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = null;
	},
	
	// after we send remove request we are in 
	// "removing..." state, at that point we ignore additional 
	// progress updates from appInstallService 
	// that come before the final "removed" state
	_allowTransition: function(newState)
	{
		if (newState == "download progress")
			return false;
		
		return true;
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	saveToMyApps: function()
	{
		return true;
	},

	toString: function()
	{
		return "removing";
	}
};

Catalog.appStates["canceling"] = {
	
	init: function(app) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'none';
		app._progressPillModel.image = undefined;
		app._progressPillModel.title = $L('Canceling...');
		
		app.disabledClass = "disabled";
	},
	
	// after we send cancel request we are in 
	// "canceling..." state, at that point we ignore additional 
	// progress updates that come before the final "canceled" state
	_allowTransition: function(newState)
	{
		if (newState == "download progress")
			return false;
		
		return true;
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	saveToMyApps: function()
	{
		return true;
	},

	toString: function()
	{
		return "canceling";
	}
};



// default / starting state for all apps
// once we obtain app details from the server
Catalog.appStates["download"] = {
	
	init: function(app, args) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon	= 'download-app-icon';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = undefined;
		app._progressPillModel.title = $L('Download for #{price}').interpolate({price:app.getFormattedPrice()});
		
		// check code status from cookie store
		var cookiePC = new Mojo.Model.Cookie("PromoCode");
		var cookieStoredPC = cookiePC.get();
		Mojo.Log.info("DownloadState, promocode cookie retrieve:[%s]", cookieStoredPC);
		
		// set promo tag on download button
		Mojo.Log.info("DownloadState.appStates[download]# promoLink:%s, price:%s, cookieStorePC:%s", 
				app.promoLink, app.price, cookieStoredPC);
		if(app.promoLink && app.price!=0 && cookieStoredPC && cookieStoredPC.length>0) {
			Mojo.Log.info("promo tag set.");
//			app._progressPillModel.title = $L("Download for #{price} FREE!").interpolate({price:app.getFormattedPrice()});
			app._progressPillModel.icon	= 'download-app-promo-icon';
			app._progressPillModel.image = 'images/download-icon.png';
		}
		
		if (app.price == 0){
			app._progressPillModel.title = $L('Download for free');
		}
		
		
		app.progress = 0;
		app.disabledClass = null;
		app.updateClass = null;
		app.activeClass = null; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = null;
	},
	
	updateFromInstalledAppsList: function(app)
	{
		if (app.installedVersion) 
		{
			if (app.serverVersion && Utilities.VersionCheck.compare(app.installedVersion, app.serverVersion) == -1) 
			{
				app.setState("installed update available");
			}
			else 
			{
				app.setState("installed");	
			}
		}
	},
	
	updateFromServer: function(app) 
	{	
		var state = "download";
		if (app.purchasedVersion)
		{
			state = 'purchased';
		}
		
		if (app.installedVersion) 
		{
			state = 'installed';
			if (Utilities.VersionCheck.compare(app.installedVersion, app.serverVersion) == -1) 
			{
				state = "installed update available";
			}
		}
		
		app.setState(state);
	},
	
	removeFromMyApps: function()
	{
		return true;
	}, 
	
	defaultAction: function(app) 
	{
		app.install();
	},
	
	install: function(app) 
	{
		Catalog.appStatesCommon._checkNotEmbargoed(app, function(status)
		{
			if(status)
			{
				Catalog.appStatesCommon._handleLocationServices(app, function(status)
				{
					if (status) 
					{
						Catalog.appStatesCommon.validateInstallSpace(app, "validate_space_default_single", function(status)
						{
							if (status) 
							{
								Catalog.appStatesCommon.validateDownloadConnection(function(status)
								{
									if (status)
									{ 
										if (app.price > 0) 
										{
											Catalog.appStatesCommon._handleVerifyPayment(app, !Preferences.isLoginTimedOut(), null, function(status)
											{
												Mojo.Log.info("Catalog.appStates[download].download _handleVerifyPayment returned");
												if (status) 
												{
													Mojo.Log.info("Catalog.appStates[download].download _handleVerifyPayment status=true download app");
													Catalog.appStatesCommon._install(app);
												}
												else 
												{
													// reset back in case of error
													app.setState("download");
												}
											});
										}
										else 
										{
											Catalog.appStatesCommon._install(app);
										}
									}
									else 
									{
										app.setState("download");
									}
								});
							}
							else 
							{
								app.setState("download");
							}
						});
					}
					else 
					{
						app.setState("download");
					}
				});
			}
			else 
			{
				app.setState("download");
			}
		});
	},
	
	toString: function()
	{
		return "download";
	}
};

// Entered when download manager send the first 
// valid progress amount and active until download is active
// that is, we receive progress updates
Catalog.appStates["download progress"] = {
	
	init: function(app, args) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'action-icon';
		app._progressPillModel.image = 'images/download-icon.png';
		app._progressPillModel.title = $L('Downloading...');
		app._progressPillModel.value = app.progress/100;
		
		app.disabledClass = null;
		app.updateClass = null;
		app.activeClass = "active"; 
		app.resumeClass = null;
		app.pauseClass = "show";
		app.warningClass = null;
	},
	
	updateFromServer: function(app) 
	{	
		// force a refresh
		app.setState("download progress");
	},
	
	updateFromInstalledAppsList: function(app)
	{
		// force a refresh
		app.setState("download progress");	
	},
	
	defaultAction: function(app) 
	{
		this.pauseDownload(app);
	},
	
	myAppsDefaultAction: function(app)
	{
		this.pauseDownload(app);
	},
	
	pauseDownload: function(app)
	{
		Catalog.appStatesCommon._pause(app);	
	},
	
	cancelDownload: function(app)
	{
		Catalog.appStatesCommon._cancel(app);
	},
	
	uninstall: function(app)
	{
		Catalog.appStatesCommon._uninstall(app);
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	saveToMyApps: function()
	{
		return true;
	},
	
	toString: function()
	{
		return "download progress";
	}
};

Catalog.appStates["paused"] = {
	
	init: function(app, args) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'none';
		app._progressPillModel.value = app.progress/100;
		app._progressPillModel.image = undefined;
		app._progressPillModel.title = $L('Resume Downloading...');
		
		app.disabledClass = null;
		app.updateClass = null;
		app.activeClass = "active"; 
		app.resumeClass = "show";
		app.pauseClass = null;
		app.warningClass = null;
	},
	
	updateFromServer: function(app) 
	{	
		// force a refresh
		app.setState("paused");
	},
	
	updateFromInstalledAppsList: function(app)
	{
		// force a refresh
		app.setState("paused");	
	},
	
	myAppsDefaultAction: function(app)
	{
		app.resumeDownload();
	},
	
	defaultAction: function(app) 
	{
		app.resumeDownload();
	},
	
	resumeDownload: function(app)
	{
		Catalog.appStatesCommon._resume(app);
	},
	
	cancelPausedDownload: function(app)
	{
		Mojo.Log.info("Catalog.appStates.paused.cancelPausedDownload")
		Catalog.appStatesCommon._cancel(app);
	},
	
	uninstall: function(app)
	{
		Catalog.appStatesCommon._uninstall(app);
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	saveToMyApps: function()
	{
		return true;
	},

	toString: function()
	{
		return "paused";
	}
};

Catalog.appStates["download failed"] = {
	
	init: function(app) 
	{
		Mojo.Log.error("Catalog.download failed.init error: ", app.errorCode);
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'failed-app-icon';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = undefined;
		app._progressPillModel.title = $L('Download failed');
		app.progress = 0;
		app.disabledClass = null;
		app.updateClass = null;
		app.activeClass = "warning"; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = "show";
	},
	
	updateFromServer: function(app) 
	{
		// force a refresh
		app.setState("download failed");
	},
	
	updateFromInstalledAppsList: function(app)
	{
		// force a refresh
		app.setState("download failed");	
	},
	
	defaultAction: function(app) 
	{
		this._defaultAction(app);
	},
	
	myAppsDefaultAction: function(app)
	{
		this._defaultAction(app);
	},
	
	_defaultAction: function(app) 
	{
		Utilities.Errors.displayError(app.errorCode, {errCode: app.errorCode}, "download_default", null, null, 
		function(value)
		{
			if (value == "retry") 
			{
				app.install();
			}
			else if (value == "cancel") 
			{
				Catalog.appStatesCommon._cancel(app);
			}
		});
	},
	
	cancelDownload: function(app)
	{
		Catalog.appStatesCommon._cancel(app);
	},
	
	uninstall: function(app)
	{
		Catalog.appStatesCommon._uninstall(app);
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	install: function(app)
	{
		var oldState = app.stateToString();
		app.setState("fake progress");
		
		Weave.Services.ApplicationServer.getApplicationDetails(app.id, app.publicApplicationId, Mojo.Locale.getCurrentLocale(), 
		function(status, details)
		{
			if (status) 
			{
				Mojo.Log.info("DownloadStates.download failed.getDetailsFromServer details %j", details);
				app.updateFromServer(details);
				
				Catalog.appStatesCommon.validateInstallSpace(app, "validate_space_default_single", function(status)
				{
					if (status) 
					{
						Catalog.appStatesCommon.validateDownloadConnection(function(status)
						{ 
							if (status)
							{
								Mojo.Log.info("DownloadStates.download failed install: ", app.publicApplicationId);
								Weave.Services.AppInstallService.install(app, function(status, response)
								{
									if (!status)
									{
										Mojo.Log.error("DownloadStates.download failed: install failed %s: %j", app.publicApplicationId, response);
										if (app.stateToString() == "fake progress")
											app.setState(oldState);
									}
								});
							}
							else
							{
								app.setState(oldState);
							}
						});
					}
					else
					{
						app.setState(oldState);
					}
				});
			}
			else 
			{
				Mojo.Log.error("DownloadStates.download failed.getDetailsFromServer failed to get details from the server error: ", details);
				app.setState(oldState);
				Utilities.Errors.displayError(details);
			}
		});
	},
	
	saveToMyApps: function()
	{
		return true;
	},
	
	toString: function()
	{
		return "download failed";
	}
};

Catalog.appStates["purchasing"] = {
	
	init: function(app, args) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'none';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = undefined;
		app._progressPillModel.title = $L('Purchasing...');
	},
	
	toString: function()
	{
		return "purchasing";
	}
};

Catalog.appStates["purchased"] = {
	
	init: function(app, args) 
	{
		if (!args || (args && !args.transitional)) 
		{
			app._progressPillModel.titleRight = undefined;
			app._progressPillModel.icon = 'download-app-icon';
			app._progressPillModel.image = undefined;
			app._progressPillModel.value = undefined;
			app._progressPillModel.title = $L('Download for free');
		}
		
		app.progress = 0;
		
		if (args && args.version)
			app.purchasedVersion = args.version;
	},
	
	updateFromServer: function(app) 
	{	
	},
	
	updateFromInstalledAppsList: function(app)
	{
		if (app.installedVersion) 
		{
			if (app.serverVersion && Utilities.VersionCheck.compare(app.installedVersion, app.serverVersion) == -1) 
			{
				app.setState("installed update available");
			}
			else 
			{
				app.setState('installed');	
			}
		}
	},
	
	removeFromMyApps: function()
	{
		return true;
	}, 
	
	defaultAction: function(app) 
	{
		app.install();
	},
	
	install: function(app)
	{
		Catalog.appStatesCommon.validateInstallSpace(app, "validate_space_default_single", function(status)
		{
			if (status) 
				Catalog.appStatesCommon._install(app);
		});
	},
	
	toString: function()
	{
		return "purchased";
	}
};

Catalog.appStates["purchase_failed"] = {
	
	init: function(app, args) 
	{
		Mojo.Log.error("Catalog.purchase_failed.init %j", args);
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'failed-app-icon';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = undefined;
		app._progressPillModel.title = $L('Purchase failed');
		
		if (args) 
		{
			app.errorCode = args.errorCode.toString();
			Mojo.Log.error("Catalog.appStates[purchase_failed].init error: %s", app.errorCode);
		}
	},
	
	updateFromServer: function(app) 
	{	
	},
	
	
	defaultAction: function(app) 
	{
		var self = this;
		var failover;
		if (app.paymentType == "cc") {
			failover = "ob";
		} else if (app.paymentType == "ob") {
			failover = "cc";
		}
		
		Utilities.Errors.displayError(app.errorCode, 
			{errCode: app.errorCode, failover:failover},
			"PMT_purchase_default", null, null, function(value)
		{
			if (value == "cc") {
				Mojo.Log.info("## Trying credit card now.");
				Catalog.appStatesCommon._forcePaymentType(app, "cc");				
			} else if (value == "ob") {
				Mojo.Log.info("## Trying operator billing now.");
				Catalog.appStatesCommon._forcePaymentType(app, "ob");				
			} else {
				self._reset(app);
			}
		});
	},
	
	_reset: function(app)
	{
		app.setState("download");
	},
	
	_remove: function(app)
	{
		app.setState("download");
	},
	
	toString: function()
	{
		return "purchase_failed";
	}
};

// Base Purchase Pending on Purchase Failed, but with new message
Catalog.appStates["purchase_pending"] = {};
Object.extend(Catalog.appStates["purchase_pending"], Catalog.appStates["purchase_failed"]);

Catalog.appStates["purchase_pending"].init = function(app, args) {
	Mojo.Log.error("Catalog.purchase_pending.init %j", args);
	app._progressPillModel.titleRight = undefined;
	app._progressPillModel.icon = 'failed-app-icon';
	app._progressPillModel.image = undefined;
	app._progressPillModel.value = undefined;
	app._progressPillModel.title = $L('Purchase Pending');
		
	if (args) 
	{
		app.errorCode = args.errorCode.toString();
		Mojo.Log.error("Catalog.appStates[purchase_pending].init error: %s", app.errorCode);
	}

	this.defaultAction(app);
};

Catalog.appStates["purchase_pending"].defaultAction = function(app) {
	// Just show error again
	Utilities.Errors.displayError(app.errorCode);
};
	
Catalog.appStates["purchase_pending"].toString = function() {
	return "purchase_pending";
};


Catalog.appStates["installing"] = {
	
	init: function(app, args) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'none';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = 1;
		app._progressPillModel.title = $L('Installing...');
		app.progress = 100;
		
		app.disabledClass = null;
		app.updateClass = null;
		app.activeClass = "active"; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = null;
	},
	
	updateFromInstalledAppsList: function(app)
	{
		// force a refresh
		app.setState("installing");
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	saveToMyApps: function()
	{
		return true;
	},
	
	toString: function()
	{
		return "installing";
	}
};

Catalog.appStates["installed"] = {
	
	init: function(app, args) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'launch-app-icon';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = undefined;
		app._progressPillModel.title = $L('Tap to launch');	
		Mojo.Log.info("Catalog.appStates[installed].init installedVersion=%s", app.installedVersion);
		
		app.disabledClass = null;
		app.updateClass = null;
		app.activeClass = null; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = null;
	},
	
	updateFromServer: function(app) 
	{
		this._update(app);
	},

	updateFromServerUpdatesList: function(app) 
	{
		this._update(app);
	},
	
	_update: function(app)
	{
		Mojo.assert(app.installedVersion, "ERROR: app.installedVersion undefined when app is in installed state");
		// See if update is available
		if (app.serverVersion && Utilities.VersionCheck.compare(app.installedVersion, app.serverVersion) == -1) 
		{
			app.setState("installed update available");
		}
		else
		{
			// force a refresh
			app.setState("installed");
		}
	},
	
	saveToMyApps: function()
	{
		return true;
	},

	defaultAction: function(app) 
	{
		app.launch();
	},
	
	launch: function(app)
	{
		Weave.Services.ApplicationManager.openApplication(app.publicApplicationId, undefined, true);
	},
	
	uninstall: function(app)
	{
		Catalog.appStatesCommon._uninstall(app);
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	toString: function()
	{
		return "installed";
	}
};

Catalog.appStates["installed update available"] = {	
	
	init: function(app, args) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'update-app-icon';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = undefined;
		app._progressPillModel.title = $L('Update Available');
		
		app.disabledClass = null;
		app.updateClass = "update";
		app.activeClass = null; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = null;
	},
	
	saveToMyApps: function()
	{
		return true;
	},
	
	defaultAction: function(app) 
	{
		app.install();
	},
	
	myAppsDefaultAction: function(app)
	{
		app.install();
	},
	
	install: function(app) 
	{
		Catalog.appStatesCommon.validateInstallSpace(app, "validate_space_default_single", function(status)
		{
			if (status) 
			{
				Catalog.appStatesCommon._install(app);
			}
			else 
			{
				app.setState("installed update available");
			}
		});
	},
	
	// called when updates are installed in a bulk
	// all checks (install capacity, network..) are done
	// once for the whole batch
	installUpdate: function(app) 
	{
		var oldState = app.stateToString();
		app.setState("fake progress");
				
		Mojo.Log.info("Catalog.installed update available.installUpdate: ", app.publicApplicationId);
		Weave.Services.AppInstallService.install(app, function(status, response)
		{
			if (!status)
			{
				Mojo.Log.error("Catalog.installed update available.installUpdate failed %s: %j, returing to state %s", app.publicApplicationId, response, oldState);
				if (app.stateToString() == "fake progress")
					app.setState(oldState);
			}
		});
	},
	
	updateFromInstalledAppsList: function(app)
	{
		this._update(app);
	},
	
	updateFromServerUpdatesList: function(app) 
	{
		this._update(app);
	},
	
	_update: function(app)
	{
		Mojo.assert(app.installedVersion, "ERROR: app.installedVersion undefined when app is in installed state");
		if (app.serverVersion && Utilities.VersionCheck.compare(app.installedVersion, app.serverVersion) == -1) 
		{
			// force a refresh
			app.setState("installed update available");
		}
		else 
		{
			app.setState("installed");
		}
	},
	
	uninstall: function(app)
	{
		Catalog.appStatesCommon._uninstall(app);
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	toString: function()
	{
		return "installed update available";
	}
};

Catalog.appStates["install failed"] = {

	init: function(app) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'failed-app-icon';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = undefined;
		app._progressPillModel.title = $L('Install failed');
		Mojo.Log.error("Catalog.appStates[install failed].init error: %s", app.errorCode);
		
		app.disabledClass = null;
		app.updateClass = null;
		app.activeClass = "warning"; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = "show";
	},
	
	updateFromServer: function(app) 
	{	
		// do nothing, let user retry to install
	},
	
	updateFromInstalledAppsList: function(app)
	{
		// force refresh
		app.setState("install failed");
	},
	
	defaultAction: function(app) 
	{
		this._defaultAction(app);
	},
	
	myAppsDefaultAction: function(app)
	{
		this._defaultAction(app);	
	},
	
	_defaultAction: function(app)
	{
		// TODO Add retryInstall back once NOV-83315 is implemented and there
		// is an "intelligent" retry, for now always download from scratch
		var totalInstallSize;
		if (app.installSize) 
		{
			totalInstallSize = (app.installSize / (1024 * 1024)) + 1;
			//totalInstallSize = (Math.ceil(totalInstallSize * 100) / 100) + "M";
			totalInstallSize = Mojo.Format.formatNumber(totalInstallSize, {fractionDigits: 2}) + $L("M");
		}
		else 
		{
			totalInstallSize = $L("unknown MB");
		}
		
		var revertableApp = Catalog.AppDownloadMngr.getDetailsRevertableApp(app.publicApplicationId);
		
		if (revertableApp) {
			Utilities.Errors.displayError(app.errorCode, {
				installSize: totalInstallSize,
				title : app.title
			}, "install_revert_default", null, null, function(value){
				if (value == "retry") {
					app.install();
				}
				else 
					if (value == "cancel") {
						Catalog.appStatesCommon._cancel(app);
					}
					else 
						if (value == "help") {
							Weave.Services.ConnectionManager.getStatus(function(online){
								Weave.Services.ApplicationManager.openApplication('com.palm.app.help', {
									target: online ? 'http://help.palm.com/basics/manage_applications/basics_delete_app_from_launcher.html' : 'no-network'
								});
							});
						}
						else 
							if (value == "revert") {
								app.pendingRevert = true;
								Catalog.appStatesCommon._restore(app);
							}
			});
		}
		else {
			Utilities.Errors.displayError(app.errorCode, {
				installSize: totalInstallSize
			}, "install_default", null, null, function(value){
				if (value == "retry") {
					app.install();
				}
				else 
					if (value == "cancel") {
						Catalog.appStatesCommon._cancel(app);
					}
					else 
						if (value == "help") {
							Weave.Services.ConnectionManager.getStatus(function(online){
								Weave.Services.ApplicationManager.openApplication('com.palm.app.help', {
									target: online ? 'http://help.palm.com/basics/manage_applications/basics_delete_app_from_launcher.html' : 'no-network'
								});
							});
						}
			});
		}
	},
	
	cancelDownload: function(app)
	{
		Catalog.appStatesCommon._cancel(app);
	},
	
	uninstall: function(app)
	{
		Catalog.appStatesCommon._uninstall(app);
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	install: function(app)
	{
		var oldState = app.stateToString();
		app.setState("fake progress");
		
		// refetch data from the server
		Weave.Services.ApplicationServer.getApplicationDetails(app.id, app.publicApplicationId, Mojo.Locale.getCurrentLocale(), 
		function(status, details)
		{
			if (status) 
			{
				Mojo.Log.error("DownloadStates.install failed.getDetailsFromServer details %j", details);
				app.updateFromServer(details);
				
				Catalog.appStatesCommon.validateInstallSpace(app, "validate_space_default_single", function(status)
				{
					if (status) 
					{
						Catalog.appStatesCommon.validateDownloadConnection(function(status)
						{ 
							if (status)
							{
								Mojo.Log.error("DownloadStates.install failed install: ", app.publicApplicationId);
								Weave.Services.AppInstallService.install(app, function(status, response)
								{
									if (!status)
									{
										Mojo.Log.error("DownloadStates.install failed: install failed %s: %j", app.publicApplicationId, response);
										if (app.stateToString() == "fake progress")
											app.setState(oldState);
									}
								});
							}
							else
							{
								app.setState(oldState);
							}
						});
					}
					else
					{
						app.setState(oldState);
					}
				});
			}
			else 
			{
				Mojo.Log.error("DownloadStates.install failed.getDetailsFromServer failed to get details from the server error: ", details);
				app.setState(oldState);
				Utilities.Errors.displayError(details);
			}
		});
	},
	
	saveToMyApps: function()
	{
		return true;
	},
	
	toString: function()
	{
		return "install failed";
	}
};

/* AppDetails
 * 
 * Stores details for a single application from the app store
 * 
 * Observer interface:
 * 
 * // called when this application's details change
 * updateDetails()
 * 
 */
var AppDetails = Class.create({
	
	initialize: function(appid, packageid) 
	{
		this._observers = new Array();
		// TLE these are no longer private
		this._appid = appid;
		this._packageid = packageid;
		this._details = null;
		this._error = null;
		//this._myRating = null;
	},
	
	getDetailsFromServer: function() 
	{
		var self = this;
		// testing
		//this._appid = 2008954;
		//this._packageid = "myfreekingapp";
		Weave.Services.ApplicationServer.getApplicationDetails(this._appid, this._packageid, 
			Mojo.Locale.getCurrentLocale(), function(status, details, myrating, country)
			{
				//status = false;
				if (status) 
				{
					myProfile.activationCountry = country;
					Mojo.Log.info("AppDetails.getDetailsFromServer details %j, myrating %j, activation country %s", details, myrating, myProfile.activationCountry);
					self._setError(null);
					self._setDetails(details);
					//self.getMyCommentFromServer();
				}
				else 
				{
					Mojo.Log.error("AppDetails.getDetailsFromServer failed to get details from the server error: ", details);
					self._setError(details);
					//self._setMyRating(null);
					self._setDetails(null);
					Utilities.Errors.displayError(details);
				}
			});
	},
	
	//Don't want to call getMyRating on every detail page
	/*getMyCommentFromServer: function() 
	{
		if (!this._details) return;
		
		var self = this;
		Weave.Services.ApplicationServer.getMyComment(this._details.id, function(status, review)
		{
			if (status && review)
			{
				self._setMyRating(review);
			}
			// Ignore server errors here
		});
	},*/
	
	_setDetails: function(details) 
	{
		// TLE maybe don't set it here
		if (details) 
		{
			this._appid = details.id;
			this._packageid = details.publicApplicationId;
		}
		
		this._details = details;
		
		// Go through the list of observers and notify them of the change
		// At that point observers can call getDetails() to get the changes
		// notify observers
		for (var i = 0; i < this._observers.length; i++) 
		{
			if (this._observers[i].updateDetails) 
			{
				this._observers[i].updateDetails(this);
			}
		}
	},
	
	getDetails: function() 
	{
		return this._details;
	},
	
	/*_setMyRating: function(rating) 
	{
		this._myRating = rating ? rating : null;
		
		// Go through the list of observers and notify them of the change
		for (var i = 0; i < this._observers.length; i++) 
		{
			if (this._observers[i].updateMyRating) 
			{
				this._observers[i].updateMyRating();
			}
		}
	},*/
	
	/*getMyRating: function() 
	{
		return this._myRating;
	},*/
	
	_setError: function(error) 
	{
		this._error = error;
	},
	
	getError: function() 
	{
		return this._error;
	},
	
	getProgramType: function() 
	{
		return this._details != null ? this._details.programType : null;
	},
	
	// adds observer to the list of observers
	attach: function(observer) 
	{
		this._observers.push(observer);
	},
	
	// removes observer from the list
	detach: function(observer) 
	{
		for (var i = 0; i < this._observers.length; i++)
		{
			if (this._observers[i] === observer)
			{
				this._observers.splice(i, 1);
			}
		}
	},
	
	setPromoInfo: function(promoInfo) {
		this._promoValidTo = promoInfo.validTo;
		this._promoCallbackStatus = promoInfo.callbackStatus;
		this._promoStatus = promoInfo.status;
		this._promoCampaignStatus = promoInfo.campaignStatus;
	}
});

/*
 * AppDownload
 * 
 * represents a single app download. Each time details scene is pushed an instance of
 * AppDownload object is created (or an existing one is returned from myApps hash
 * maintained by the AppDownloadManager). Details scene listens for state changes
 * on this object to update the UI.
 * The most important property of AppDownload is _state which is always set to one
 * of the states defined in downloadstates.js (Catalog.appStates).
 * Behavior of the download object is entirely driven by the current state.
 * AppDownload defers almost all functionlaity to its current state object.
 * 
 * For example if details scene calls appDownload->cancelDownload()
 * the call will map to appDownload->_state->cancelDownload()
 * In some states one can not cancel a download, thus only some states 
 * define this method. Calling cancelDownload() while _state == "installed"
 * will do nothing since Catalog.appStates["installed"] doesn't define cancelDownload().
 * 
 */


var AppDownload = Class.create({
	
	_defaultState: "dummy",
	
	initialize: function() 
	{
		this._observers 		= new Array();
		this._progressPillModel = {};
		this._setState(this._defaultState);
	},
	
	/*
	 *  Update functions
	 *  
	 *  update application object from different sources
	 *  Each source names properties differently, we
	 *  need to "equalize" them before updating object
	 */
	
	// called when application details are pulled
	// from the server to update state. Mostly used to
	// figure out if software update is available
	updateFromServer: function(appDetails) 
	{
		var appType;
		if(appDetails.attributes && ! appDetails.attributes.provides.noApp)
				appType = "app"
		else
			appType = "other"
			
		var details = 
		{
			id: appDetails.id,
			publicApplicationId: appDetails.publicApplicationId,
			title: appDetails.title,
			iconUrl: appDetails.appIcon,
			purchasedVersion: appDetails.purchasedVersion,
			serverVersion: appDetails.version,
			packageSize: appDetails.appSize, 
			installSize: appDetails.installSize,
			isEncrypted: appDetails.isEncrypted,
			currency: appDetails.currency,
			priceType: appDetails.priceType, 
			price: appDetails.price,
			sku: appDetails.sku,
			paymentCategory: appDetails.paymentCategory,
			// install wants vendor and purchase vendorid
			vendor: appDetails.creator,
			vendorid: appDetails.vendorid,
			vendorUrl: appDetails.homeURL,
			vendorCity: appDetails.vendorCity,
			vendorRegion: appDetails.vendorRegion,
			vendorCountry: appDetails.vendorCountry,
			islocationbased: appDetails.islocationbased,
			packageUrl: appDetails.appLocation,
			"appType": appType,
			"services": appDetails.attributes.provides.services,
			"dockMode": appDetails.attributes.provides.dockMode,
			"universalSearch":  appDetails.attributes.provides.universalSearch,
			"accounts" : appDetails.attributes.provides.connectors
			
		}
		
		Object.extend(this, details); 
		
		Mojo.Log.info("AppDownload.updateFromServer updated: details %j", details);
		// delegate to state objects
		if (this._state.updateFromServer)
			this._state.updateFromServer(this);
	},
	
	// called from download manager when installed queue is created
	// at startup
	updateFromInstalledAppsList: function(appDetails)
	{
		var appType;
		var dockMode = false;
		var universalSearch = false;
		
		if (appDetails.apps && appDetails.apps.length > 0) {
			appType = "app";
			
			//if any app in package has dockMode support, the package as dockMode support
			for(i = 0; i < appDetails.apps.length; i++)
			{
				if(appDetails.apps[i].dockMode)
					dockMode = true;
				if(appDetails.apps[i].universalSearch)
					universalSearch = true;
			}
		}
		else 
			appType = "other";
		
		//keeping it compable with old model of information being in first app	
		var title =	appDetails.loc_name ? appDetails.loc_name : appDetails.apps.length > 0 ?appDetails.apps[0].title : undefined;
		var icon =	appDetails.icon ? appDetails.icon : appDetails.apps.length > 0 ?appDetails.apps[0].icon : undefined;
		var vendor =	appDetails.vendor ? appDetails.vendor : appDetails.apps.length > 0 ?appDetails.apps[0].vendor : undefined;
		
			
			
		var details = 
		{
			publicApplicationId: appDetails.id,
			title: title,
			installedVersion: appDetails.version,
			icon: icon ? icon : this.icon,
			"appType": appType,
			installSize: appDetails.size,
			vendor: vendor,
			services : appDetails.services,
			accounts : appDetails.accounts,
			dockMode: dockMode,
                        universalSearch: universalSearch
		}
				
		Object.extend(this, details);
		Mojo.Log.info("AppDownload.updateFromInstalledAppsList updated: %s", this.toString());
		
		if (this._state.updateFromInstalledAppsList)
			this._state.updateFromInstalledAppsList(this); 
	},
	
	// called when list of updatable apps is retrived 
	// from the server (My apps scene calls it)
	updateFromServerUpdatesList: function(appDetails)
	{
		var details = 
		{
			id: appDetails.id,
			serverVersion: appDetails.appVersion,
			packageUrl: appDetails.packageUrl,			
			vendor: appDetails.vendor,
			vendorUrl: appDetails.homeURL,
			iconUrl: appDetails.appIcon,
			packageSize: appDetails.appSize, 
			installSize: appDetails.installSize
		}
		
		Object.extend(this, details); 
		Mojo.Log.info("AppDownload.updateFromServerUpdatesList updated %s, from details: %j", this.toString(), details);
		
		// delegate to state objects
		if (this._state.updateFromServerUpdatesList)
			this._state.updateFromServerUpdatesList(this);
	},
	
	updateFromInstallNotification: function(appDetails)
	{
		///Forcing a refresh for including size. 
		if (appDetails.change == "added" ||
		(appDetails.change == "updated" && appDetails.version &&
		this.installedVersion != appDetails.version)) {
			if (!this.installSize) {
				var details = {
					installSize: appDetails.size
				}
			}
			Object.extend(this, details);
			Mojo.Log.info("AppDownload.updateFromInstallNotification changeDetails: %j, app: %s", appDetails, this.toString());
			this.setState(this._state.toString());
		}
		/*if (appDetails.change == "added" ||
			(appDetails.change == "updated" && appDetails.version && 
			this.installedVersion != appDetails.version)) 
		{
			var details = 
			{
				installSize: appDetails.size
			}
			Object.extend(this, details);
			
			Mojo.Log.info("AppDownload.updateFromInstallNotification changeDetails: %j, app: %s", appDetails, this.toString());
		}
		else if (appDetails.change == "removed" && !this.pendingRevert)
		{
			if (this._state._remove)
				this._state._remove(this);
			Mojo.Log.info("AppDownload.updateFromInstallNotification removed: %s", this.toString());
		}*/
	},
	
	/*to update on status return form appinstaller "installnoverify"
	 * SUCCESS means succesful install
	 * If status string contains "FAILED", would consider it a failure
	 * 
	 */
	updateFromInstallerStatus: function(installResponse)
	{
		/*if (installResponse.state) {
			Mojo.Log.info("AppDownload.updateFromInstallStatus setting to state: %s", installResponse.state);
			this.setState(installResponse.state);
			
			if (installResponse.state === "installed") {
				this.installedVersion = Catalog.AppDownloadMngr.getDetailsRevertableApp(this.publicApplicationId).version;
			}
			else if (installResponse.state === "install failed") {
					Utilities.Errors.displayError(null, {
							title : this.title
							}, "install_revert_failed");
				}
		}*/
	},
	
	/*
	  	"icon download current"
		"icon download complete"
		"icon download paused" - will also have "progress" 100
		"ipk download current" - will also have "progress" : 0-100
		"ipk download complete"
		"ipk download paused"  - will also have "progress" : 0-100
		
		"installing"
		"installed"
		"removing"
		"removed"
		"canceled"
		"download failed" - will also have "errorCode" : int and "reason" : string
		"install failed" - - will also have "errorCode" : int and "reason" : string
		"remove failed" - - will also have "errorCode" : int and "reason" : string
		"unknown"
	 * 
	 * 
	 * 
	 */
	updateFromStatus: function(id, appDetails)
	{
		var appType;
		var newState = appDetails.state;
		Mojo.Log.info("AppDownload.updateFromStatus newState: %s", newState);
		
		// removed & installed notifications are handled in updateFromInstallNotification
		// nothing to do for removing & unknown
		if (newState == "removing" || 
			newState == "unknown" )
		{
			return;
		}
		if(newState == "installed" )
		{
			var details = 
			{
				installedVersion: appDetails.version,
			}
			Object.extend(this, details);
			this.setState("installed");
			Mojo.Log.info("AppDownload.updateFromStatus changeDetails: %j, app: %s", appDetails, this.toString());
			return;
		}
		else if (newState =="removed" )
		{
			if (this._state._remove)
				this._state._remove(this);
			Mojo.Log.info("AppDownload.updateFromStatus removed: %s", this.toString());
			return;
		}
		
		
		// translate state
		if (newState == "icon download complete" ||
			newState == "icon download current")
		{
			appDetails.progress = 0;
			newState = "download progress";
		}				
		
		if (newState == "ipk download complete")
		{
			appDetails.progress = 100;
		}
	
		// translate state
		if (newState == "ipk download current" ||
			newState == "ipk download complete")
		{
			newState = "download progress";
		}
		else if (newState == "icon download paused" ||
				newState == "ipk download paused") 
		{
			newState = "paused";
		}
		
		// fix up error code
		if (newState == "install failed")
		{
			this.errorCode = appDetails.reason;
		}
		else if (newState == "download failed")
		{
			this.errorCode = appDetails.errorCode.toString();
		}
		else 
		{
			this.errorCode = appDetails.errorCode;
		}
		
		if(appDetails.noApp && appDetails.noApp === true)
			appType = "other";
		else
			appType = "app";
		var details = 
		{
			publicApplicationId: id,
			title: appDetails.title,
			progress: appDetails.progress,
			serverVersion: appDetails.version,
			vendor: appDetails.vendor,
			vendorUrl: appDetails.vendorUrl,
			icon: this.icon ? this.icon : appDetails.iconUrl,
			"appType": appType,
			dockMode : appDetails.dockMode,
			universalSearch : appDetails.universalSearch,
			services : appDetails.services,
			accounts : appDetails.accounts
		}
		Object.extend(this, details);
		Mojo.Log.info("AppDownload.updateFromStatus updated: %s, from details %j, appDetails %s", this.toString(), details, JSON.stringify(appDetails));
		
		if (newState == "canceled" || newState == "remove failed") 
		{
			if (this._state._reset)
				this._state._reset(this);
		}
		else 
		{
			if (this._state._allowTransition && !this._state._allowTransition(newState)) 
			{
				Mojo.Log.info("AppDownload.updateFromStatus disallow transition from %s to %s", this.stateToString(), newState);
				return;
			}
				
			Mojo.Log.info("AppDownload.updateFromStatus setting to state: %s", newState);
			this.setState(newState);
		}
	},
	
	// called from state objects when state changes
	setState: function(state, args) 
	{
		Mojo.Log.info("AppDownload.setState %s", state);
		this._setState(state, args);
		
		// notify observers
		for (var i = 0; i < this._observers.length; i++) 
		{
			if (this._observers[i].updateDownloadState) 
				this._observers[i].updateDownloadState(this);
		}
	},
	
	_setState: function(state, args) 
	{
		this._state = Catalog.appStates[state];
		this._state.init(this, args);
	},
	
	// returns progress pill model, called by observers
	// to update the UI in response to state changes
	getProgressPillModel: function()
	{
		Mojo.Log.info("AppDownload.getProgressPillModel %j", this._progressPillModel);
		return this._progressPillModel;
	},
	
	// returns formated price for this app
	getFormattedPrice: function() 
	{
		// NOTE: If app.price is a string, then the server *must* have localized it
		return parseFloat(this.price) != this.price ? this.price : 
			this.price === 0 ? $L("free") : Mojo.Format.formatCurrency(this.price, { fractionDigits: 2, countryCode: myProfile.activationCountry});
		//return parseFloat(this.price) != this.price ? this.price : 
		//	this.price === 0 ? $L("free") : this.currency + " " +Mojo.Format.formatNumber(this.price, { fractionDigits: 2});
	},
	
	// adds observer to the list of observers
	attach: function(observer) 
	{
		this._observers.push(observer);
	},
	
	// removes observer from the list
	detach: function(observer) 
	{
		Mojo.Log.info("AppDownload.detach");
		for (var i = 0; i < this._observers.length; i++)
		{
			if (this._observers[i] === observer)
			{
				this._observers.splice(i, 1);
				Mojo.Log.info("AppDownload.detach removed observer, left %d", this._observers.length);
			}
		}
	},
	
	// defer all actions to state objects, that is 
	// if action is defined for the current state 
	install: function()
	{
		if (this._state.install) 
			this._state.install(this);
	},
	
	// called when updates are installed in a bulk from MyApps scene
	// all checks (install capacity, network..) are done
	// once for the whole batch and are skipped at this time
	installUpdate: function()
	{
		Mojo.Log.info("AppDownload.installUpdate ", this.publicApplicationId);
		if (this._state.installUpdate) 
			this._state.installUpdate(this);
	},
	
	// used by myApps scene to distinguish 
	// apps that are ready to be updated
	canInstallUpdate: function()
	{
		if (this._state.installUpdate) 
			return true;
		else
			return false;
	},
	
	cancelDownload: function()
	{
		if (this._state.cancelDownload) 
			this._state.cancelDownload(this);
	},
	
	pauseDownload: function()
	{
		if (this._state.pauseDownload) 
			this._state.pauseDownload(this);
	},
	
	cancelPausedDownload: function()
	{
		if (this._state.cancelPausedDownload) 
			this._state.cancelPausedDownload(this);
	},
	
	resumeDownload: function()
	{
		if (this._state.resumeDownload) 
			this._state.resumeDownload(this);
	},
	
	launch: function()
	{
		if (this._state.launch) 
			this._state.launch(this);
	},
	
	uninstall: function()
	{
		if (this._state.uninstall) 
			this._state.uninstall(this);
	},
	
	defaultAction: function()
	{
		if (this._state.defaultAction)
			this._state.defaultAction(this);
	},
	
	// called from MyApps scene to perform 
	// default action based on the current state
	myAppsDefaultAction: function()
	{
		if (this._state.myAppsDefaultAction)
			this._state.myAppsDefaultAction(this);
	},
	
	isInstalled: function()
	{
		var app = Catalog.AppDownloadMngr.getInstalledApp(this.publicApplicationId);
		if (app) 
			return true;
		
		return false;
	},
	
	stateToString: function()
	{
		return this._state.toString();
	},
	
	// for debugging purposes
	toString: function()
	{
		return "id:" + this.id + ", publicApplicationId:" + this.publicApplicationId + ", state:" + this.stateToString() + ", title:" + this.title
		+ ", serverVersion:" + this.serverVersion + ", installedVersion:" + this.installedVersion + ", purchasedVersion:" + this.purchasedVersion
		+ ", errorCode:" + this.errorCode + ", icon:" + this.icon + ", updateClass:" + this.updateClass + ", activeClass:" + this.activeClass +
		", resumeClass:" + this.resumeClass + ", pauseClass:" + this.pauseClass + " warningClass:" + this.warningClass +
		", packageSize:" + this.packageSize + " installSize: " + this.installSize + " appType: " + this.appType + "services" + this.servcies 
		+ "accounts" + this.accounts + "dockMode" + this.dockMode + "universalSearch" + this.universalSearch;
	},
	
	// returns true if app should be saved to the global
	// downloads queue based on the current state
	saveToMyApps: function()
	{
		if (this._state.saveToMyApps)
			return this._state.saveToMyApps();
		
		return false;
	},
	
	// returns true if app should be removed from the global
	// downloads queue based on the current state
	removeFromMyApps: function()
	{
		Mojo.Log.info("AppDownload.removeFromMyApps");
		if (this._state.removeFromMyApps)
			return this._state.removeFromMyApps();
		
		return false;
	},

        //Used to construct an informative delete message
        getAppDeleteDialogInfo: function() {
                var deleteType,
                    deleteTitle,
                    deleteMessage,
					removable,
                    removedItems = [];

                if (this.appType !== undefined && this.appType == "app") {
                    deleteTitle = $L('Delete application?');
                    deleteType =  'application';
                } else {
                    deleteTitle = $L('Delete this item?');
                    deleteType =  'item';
                }
				if (Catalog.AppDownloadMngr.isRevertable(this.publicApplicationId) || this.removable === "false") {
					removable = false;
					if (deleteType === 'application') {
							deleteMessage = $L("This application cannot be deleted from your phone.");
						}
						else {
							deleteMessage = $L("This item cannot be deleted from your phone.");
						}
				}
				else
				{
					if (this.accounts !== undefined && this.accounts instanceof Array && this.accounts.length > 0) {
						removedItems[removedItems.length] = $L('•Related accounts & data');
					}
					
					if (this.dockMode !== undefined && this.dockMode === true) {
						removedItems[removedItems.length] = $L('•Dock components');
					}
					
					//TODO: revise check once API in place.  Docs not super clear on the exact value being passed (ie.) true, false, emopty string, etc.
					if (this.universalSearch !== undefined && this.universalSearch !== false && (this.universalSearch === true || this.universalSearch !== '')) {
						removedItems[removedItems.length] = $L('•Universal Search plugins');
					}
					
					if (removedItems.length < 1) {
						if (deleteType === 'application') {
							deleteMessage = $L("Are you sure you want to delete this application from your phone?");
						}
						else {
							deleteMessage = $L("Are you sure you want to delete this item from your phone?");
						}
						
					}
					else {
						removable = true;
						if (deleteType === 'application') {
							deleteMessage = $L("Deleting #{appName} also removes:").interpolate({
								appName: this.title
							}) + "<br>";
							for (var a = 0; a < removedItems.length; a++) {
								deleteMessage += removedItems[a] + "<br>";
							}
						}
						else {
							deleteMessage = $L("Deleting this item removes:") + "<br>";
							for (var a = 0; a < removedItems.length; a++) {
								deleteMessage += removedItems[a] + "<br>";
							}
						}
					}
				}

                return { "deleteTitle": deleteTitle, "deleteMessage": deleteMessage, "removable": removable};
        },
        
    setPromoLink: function(promoLink) {
		this.promoLink = promoLink;
	}
});


/* AppDownloadManager
 * 
 * Keeps a queue of active downloads. On launch, it gets active downloads 
 * from appInstallerService/status method and initializes the queue. It then queries 
 * the system for the list of installed apps and adds them to myApps as well.
 * When client request the download object (e.g details scene)
 * dm will either return an existing one, or create a new one.
 * DM is listening for state changes on all download objects, in case that
 * download becomes active and needs to be stored in the myApps queue. 
 * MyApps are installations in progress, failed installations and installed apps.
 * Other downloads are stored in _activeQueue until user initiates the install
 * at which point appDownload object is moved to myApps queue and appears 
 * in the list on MyApps scene.
 * 
 * Sample flow:
 * 
 * User opens a details scene of some new app "com.company.myapp". 
 * AppDownloadManager creates a new AppDownload object and stores it in _activeQueue hash.
 * AppDownloadManager & current details scene both subscribe as listeners on this object 
 * to be notified of state changes. When user taps "download app" install is initiated 
 * and state of the object starts changing with updates from appInstallService/status method
 * (_appInstallServiceStatusCB). When state changes AppDownloadManager is notified through 
 * updateDownloadState() observer method and it then decides if AppDownload should be added
 * to myApps queue. If state became "download progress" for example, app is added to myApps hash.
 * It's similar with details scene. When state of AppDownload changes details scene's 
 * updateDownloadState method is called to update the UI (progress pill). 
 * 
 * 
 * Observers on AppDownloadManager can subscribe to be notified of these changes:
 * 
 * 1) changes to installed applications list
 * current observers: main scene, search scene...
 * observer needs to implement 
 * 
 * updateInstalledApps(AppDownloadManager_instance, updateReason);
 * 
 * 
 * 2) changes to the myApps queue, sent when app is added/deleted/updated from the queue
 * current observers: myApps scene.
 * observer needs to implement  
 * 
 * updateMyApps(updateReason, app);
 * 
 * updateReason: one of: APP_ADDED, APP_DELETED, APP_UPDATED
 * MYAPPS_ALL - sent when myApps queue is populated 
 *             (from appInstallService/status + installed app from /listApps)
 * 
 * app: instance of AppDownload that changed
 * 
 */

var AppDownloadManager = Class.create({
	
	APP_ADDED: 		0,
	APP_DELETED: 	1,
	APP_UPDATED:	2,
	MYAPPS_ALL:		3,
	UPDATELIST_ALL:		4,
	
	initialize: function() 
	{
		this._myApps = new Object();
		this._revertableApps = new Object();
		this._activeQueue = new Object();
		this._observers = new Array();
		this._allow1xDownload = false;
		// two things need to happen before myApps list is ready:
		// get all apps in progress and all installed apps
		this._myAppsListIsReady = 2;
	
		this._appInstallerService = new Mojo.Service.Request('palm://com.palm.bus/signal', {
			method: 'registerServerStatus',
			parameters: {
				'serviceName':'com.palm.appInstallService'
			},
			onSuccess: this._appInstallerServiceSignalCB.bind(this)
		});
		
		this._appManagerService = new Mojo.Service.Request('palm://com.palm.bus/signal', {
			method: 'registerServerStatus',
			parameters: {
				'serviceName':'com.palm.applicationManager'
			},
			onSuccess: this._appManagerServiceSignalCB.bind(this)
		});
		
		this._downloadManagerService = new Mojo.Service.Request('palm://com.palm.bus/signal', {
			method: 'registerServerStatus',
			parameters: {
				'serviceName':'com.palm.downloadmanager'
			},
			onSuccess: this._appDownloadServiceSignalCB.bind(this)
		});
	},
	
	start: function()
	{
		Mojo.Log.info("AppDownloadManager.start");
		
		this._myApps = new Object();
		this._revertableApps = new Object();
		this._myAppsListIsReady = 2;
		
		// get installed apps and subscribe for status
		this._getInstalledApps();
		
	},
	
	_appInstallerServiceSignalCB: function(response)
	{
		if (response.connected == true)
		{
			Mojo.Log.info("AppDownloadManager._appInstallerServiceSignal is back on the bus, starting");
			this.start();
		}
		else if (response.connected == false)
		{
			Mojo.Log.error("AppDownloadManager._appInstallerServiceSignal is gone from the bus");
		}
	},
	
	_appManagerServiceSignalCB: function(response)
	{
		if (response.connected == true)
		{
			// subscribe for app install/uninstall notifications
			var self = this;
			var cb = function(status, response) {
				Mojo.Log.info("AppDownloadManager.launchPointChanges callback %j", response);
				self._updateInstalledQueue(response);
			};
			Weave.Services.ApplicationManager.launchPointChanges(cb);
		}
		else if (response.connected == false)
		{
			Mojo.Log.error("AppDownloadManager._appManagerServiceSignalCB is gone from the bus");
		}
	},
	
	_appDownloadServiceSignalCB: function(response)
	{
		if (response.connected == true)
		{
			// if we need to allow 1x, reissue the command
			if (this._allow1xDownload)
				this.allow1xDownload(true);
		}
		else if (response.connected == false)
		{
			Mojo.Log.error("AppDownloadManager._appDownloadServiceSignalCB is gone from the bus");
		}
	},
	
	_getInstalledApps: function()
	{
		var self = this;
		Weave.Services.ApplicationManager.getInstalledApplications_V2(function(status,  packages)
		{
			Weave.Services.AppInstallService.status(self._appInstallServiceStatusCB.bind(self));
			Mojo.Log.info("AppDownloadManager._getInstalledApps installed app: ", packages);
			var packages = status ? packages : [];
			var loadedInfo = Mojo.loadJSONFile("/usr/palm/ipkgs/manifest.json") ||[] ;
            Mojo.Log.info("manifest file %j", loadedInfo);
			for (var i = 0; i < loadedInfo.length; i++) 
			{
				self._revertableApps[loadedInfo[i].id] = loadedInfo[i];
				Mojo.Log.info("_revertableApps[%s] %j", loadedInfo[i].id, self._revertableApps[loadedInfo[i].id]);
			}			
			for (var i = 0; i < packages.length; i++)
			{
				if ((packages[i].userInstalled ||(packages[i].apps[0] && packages[i].apps[0].userInstalled)) || self._revertableApps[packages[i].id])
				{
					Mojo.Log.info("AppDownloadManager._getInstalledApps installed app: %j", packages[i]);
					// update app from this payload
					// this might change the state of the app which will 
					// cause it to be added to _myApps
					var app = self.getAppDownload(packages[i].id);
					app.updateFromInstalledAppsList(packages[i]);
				}
			}
			self._sendMyAppsListIsReady();
			
			Mojo.Log.info("AppDownloadManager._getInstalledApps sending updateInstalledApps");
			for (var i = 0; i < self._observers.length; i++) 
			{
				if (self._observers[i].updateInstalledApps) 
					self._observers[i].updateInstalledApps();
			}
		});
	},
	
	// returns true if myApps list has been populated
	// from both sources: /status call - apps in progress
	// and /listApps call - installed applications
	myAppsListIsReady: function()
	{
		return (this._myAppsListIsReady == 0);
	},
	
	// Send MYAPPS_ALL notification when myApps list is populated
	// two things need to happen before myApps list is ready:
	// 1) get all apps in progress
	// 2) get all installed apps
	_sendMyAppsListIsReady: function()
	{
		this._myAppsListIsReady--;
		
		if (this._myAppsListIsReady == 0)
		{
			for (var i = 0; i < this._observers.length; i++) 
			{
				if (this._observers[i].updateMyApps) 
					this._observers[i].updateMyApps(null, this.MYAPPS_ALL);
			}
		}
	},
	
	// return app download with specified id
	// will attach listener to returned app object
	// called from details scene assistant
	getAppDownload: function(appId, listener) 
	{
		// queues have priority, we first return app from downloadQ if present and so on
		var app = this._myApps[appId];
		if (!app) app = this._activeQueue[appId];
		if (!app)
		{
			Mojo.Log.info("AppDownloadManager.getAppDownload  creating new with id %s", appId);
			// create a new one and add ourselfs as listener
			// we listen for state changes so that we can add it 
			// to the downloads queue if download starts 
			app = new AppDownload();
			app.attach(this);
			this._activeQueue[appId] = app;
		}
		
		if (listener) 
			app.attach(listener);
		 
		return app;
	},
	
	// releases appDownload obj. If we are the last listener
	// and this app is in active queue, delete it from the queue
	// since it is no longer needed
	releaseAppDownload: function(appId, listener)
	{
		var app = this._myApps[appId];
		if (!app) app = this._activeQueue[appId];
		
		app.detach(listener);
		
		if (app == this._activeQueue[appId] && app._observers.length == 1)
		{
			Mojo.Log.info("AppDownloadManager.releaseAppDownload deleting from activeQueue %s", appId);
			delete this._activeQueue[appId];	
		}
	},
	
	_updateInstalledQueue: function(updateReason)
	{
		Mojo.Log.info("AppDownloadManager._updateInstalledQueue updateReason: %j", updateReason);
		
		// if app was deleted notify the server
		if (updateReason && (updateReason.change == "added" || 
			updateReason.change == "removed" || updateReason.change == "updated"))
		{
			var app = this._myApps[updateReason.packageId];
			if (app)
			{
				app.updateFromInstallNotification(updateReason);
			
				var self = this;
				var f = function()
				{
					Mojo.Log.info("AppDownloadManager._updateInstalledQueue sending updateInstalledApps");
					for (var i = 0; i < self._observers.length; i++) 
					{
						if (self._observers[i].updateInstalledApps) 
							self._observers[i].updateInstalledApps();
					}
				}
				// delay until myApps queue is updated
				f.delay(2);
			}
		}
	},
	
	// returns installed app if found or null
	getInstalledApp: function(id) 
	{
		var app = this._myApps[id];
		if (app && app.installedVersion)
		{
			return app;
		}
		return null;
	},
	
	getMyApps: function()
	{
		return this._myApps;
	},
	
	// adds observer to the list
	attach: function(observer) 
	{
		//Mojo.Log.info("AppDownloadManager.attach");
		this._observers.push(observer);
	},
	
	// removes observer from the list
	detach: function(observer) 
	{
		Mojo.Log.info("AppDownloadManager.detach");
		for (var i = 0; i < this._observers.length; i++)
		{
			if (this._observers[i] === observer)
			{
				this._observers.splice(i, 1);
				Mojo.Log.info("AppDownloadManager.detach removed observer, left %d", this._observers.length);
			}
		}
	},
	
	
	// Observer method for app download state changes
	// Here we decide if this app should be added/removed from
	// the myApps queue. If app is in the queue and has changed state
	// we send the "update" event APP_UPDATED.
	updateDownloadState: function(app) 
	{
		Mojo.Log.info("AppDownloadManager.updateDownloadState ", app.publicApplicationId, app.stateToString());
		Mojo.Log.info("AppDownloadManager.updateDownloadState this._myApps[%s]: %s", app.publicApplicationId, this._myApps[app.publicApplicationId]);

		var updateType = null;
		
		if (app.saveToMyApps() && !this._myApps[app.publicApplicationId])
		{
			Mojo.Log.info("AppDownloadManager.updateDownloadState APP_ADDED ", app.publicApplicationId, app.stateToString());
			this._myApps[app.publicApplicationId] = app;
			updateType = this.APP_ADDED;
			
			Mojo.assert(this._activeQueue[app.publicApplicationId], "AppDownloadManager.updateDownloadState added to MyApps but app wasn't in the activeQ");
			delete this._activeQueue[app.publicApplicationId];
		}
		else if (app.removeFromMyApps() && this._myApps[app.publicApplicationId])
		{
			Mojo.Log.info("AppDownloadManager.updateDownloadState APP_DELETED ", app.publicApplicationId, app.stateToString());
			delete this._myApps[app.publicApplicationId];
			updateType = this.APP_DELETED;
			
			// move it to active queue if we are not the only observer
			if (app._observers.length > 1) 
			{
				this._activeQueue[app.publicApplicationId] = app;
			}
		}
		else if (this._myApps[app.publicApplicationId])
		{
			Mojo.Log.info("AppDownloadManager.updateDownloadState APP_UPDATED ", app.publicApplicationId, app.stateToString());
			updateType = this.APP_UPDATED;
		}
			
		// app is updated, notify observers
		if (updateType != null)
		{
			for (var i = 0; i < this._observers.length; i++) 
			{
				if (this._observers[i].updateMyApps)
					this._observers[i].updateMyApps(app, updateType);
			}
		}
	},	
	
	_appInstallServiceStatusCB: function(status, singleUpdate, apps)
	{
		Mojo.Log.info("AppDownloadManager._appInstallServiceStatusCB singleUpdate:%s, apps: %j", singleUpdate, apps);
		if (!status) return;
		
		for (var i = 0; i < apps.length; i++)
		{
			var app = this.getAppDownload(apps[i].id);
			app.updateFromStatus(apps[i].id, apps[i].details);
		}
		
		// on first response, when we get the entire list
		// of active apps send "ready" update
		if (!singleUpdate)
		{
			this._sendMyAppsListIsReady();
		}
	},
	
	
	isRevertable: function(id){
		Mojo.Log.info("AppDownloadMgr::isRevertable%s,  %s", id, this._revertableApps[id]);
		
		if(this._revertableApps[id])
			return true;
		else
			return false;
	},
	
	getDetailsRevertableApp: function(id){
		Mojo.Log.info("AppDownloadMgr::isRevertable%s,  %s", id, this._revertableApps[id]);
		return this._revertableApps[id];
	},
	
	allow1xDownload: function(allow, callback)
	{
		var self = this;
		Weave.Services.request("palm://com.palm.downloadmanager", 
		{
			method: 'allow1x',
			parameters: {"value": allow}
		},
		function(response)
		{
			self._allow1xDownload = allow;
			callback && callback(true);
		},
		function(response)
		{
			Mojo.Log.error("AppDownloadManager.allow1xDownload failed %j", response);
			callback && callback(false);
		});	
	},
	
	canAllow1xDownload: function()
	{
		return this._allow1xDownload;
	},
	
	cleanup: function()
	{
		Mojo.Log.info("AppDownloadManager.cleanup");
		if (this._allow1xDownload)
			this.allow1xDownload(false);
			
		// this is just causing errors 
		// "could not find call XXX to cancel"
		//delete this._appInstallerService;
		//delete this._appManagerService;
		//delete this._downloadManagerService;
	}
		
});


var Catalog 			= Catalog || {}; 
Catalog.AppDownloadMngr = Catalog.AppDownloadMngr || new AppDownloadManager;
Catalog.AppLists = Catalog.AppLists || new AppLists;



