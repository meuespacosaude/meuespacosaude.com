!(function (t) {
  var o = function (o, s) {
    var e,
      i,
      r = !1,
      n = !1,
      a = !1,
      c = {},
      f = {
        to: "top",
        offset: 0,
        effectsOffset: 0,
        parent: !1,
        classes: {
          sticky: "sticky",
          stickyActive: "sticky-active",
          stickyEffects: "sticky-effects",
          spacer: "sticky-spacer",
        },
      },
      p = function (t, o, s) {
        var e = {},
          i = t[0].style;
        s.forEach(function (t) {
          e[t] = void 0 !== i[t] ? i[t] : "";
        }),
          t.data("css-backup-" + o, e);
      },
      l = function (t, o) {
        return t.data("css-backup-" + o);
      },
      m = function () {
        p(e, "unsticky", [
          "position",
          "width",
          "margin-top",
          "margin-bottom",
          "top",
          "bottom",
        ]);
        var t = {
          position: "fixed",
          width: u(e, "width"),
          marginTop: 0,
          marginBottom: 0,
        };
        (t[i.to] = i.offset),
          (t["top" === i.to ? "bottom" : "top"] = ""),
          e.css(t).addClass(i.classes.stickyActive);
      },
      d = function () {
        e.css(l(e, "unsticky")).removeClass(i.classes.stickyActive);
      },
      u = function (t, o, s) {
        var e = getComputedStyle(t[0]),
          i = parseFloat(e[o]),
          r = "height" === o ? ["top", "bottom"] : ["left", "right"],
          n = [];
        return (
          "border-box" !== e.boxSizing && n.push("border", "padding"),
          s && n.push("margin"),
          n.forEach(function (t) {
            r.forEach(function (o) {
              i += parseFloat(e[t + "-" + o]);
            });
          }),
          i
        );
      },
      y = function (t) {
        var o = c.$window.scrollTop(),
          s = u(t, "height"),
          e = innerHeight,
          i = t.offset().top - o,
          r = i - e;
        return {
          top: { fromTop: i, fromBottom: r },
          bottom: { fromTop: i + s, fromBottom: r + s },
        };
      },
      h = function () {
        (c.$spacer = e
          .clone()
          .addClass(i.classes.spacer)
          .css({
            visibility: "hidden",
            transition: "none",
            animation: "none",
          })),
          e.after(c.$spacer),
          m(),
          (r = !0),
          e.trigger("sticky:stick");
      },
      k = function () {
        d(), c.$spacer.remove(), (r = !1), e.trigger("sticky:unstick");
      },
      v = function () {
        var t = y(e),
          o = "top" === i.to;
        if (n) {
          (o ? t.top.fromTop > i.offset : t.bottom.fromBottom < -i.offset) &&
            (c.$parent.css(l(c.$parent, "childNotFollowing")),
            e.css(l(e, "notFollowing")),
            (n = !1));
        } else {
          var s = y(c.$parent),
            r = getComputedStyle(c.$parent[0]),
            a = parseFloat(r[o ? "borderBottomWidth" : "borderTopWidth"]),
            f = o ? s.bottom.fromTop - a : s.top.fromBottom + a;
          (o ? f <= t.bottom.fromTop : f >= t.top.fromBottom) &&
            (function () {
              p(c.$parent, "childNotFollowing", ["position"]),
                c.$parent.css("position", "relative"),
                p(e, "notFollowing", ["position", "top", "bottom"]);
              var t = { position: "absolute" };
              (t[i.to] = ""),
                (t["top" === i.to ? "bottom" : "top"] = 0),
                e.css(t),
                (n = !0);
            })();
        }
      },
      g = function () {
        var t,
          o = i.offset;
        if (r) {
          var s = y(c.$spacer);
          (t = "top" === i.to ? s.top.fromTop - o : -s.bottom.fromBottom - o),
            i.parent && v(),
            t > 0 && k();
        } else {
          var n = y(e);
          (t = "top" === i.to ? n.top.fromTop - o : -n.bottom.fromBottom - o) <=
            0 && (h(), i.parent && v());
        }
        !(function (t) {
          a && -t < i.effectsOffset
            ? (e.removeClass(i.classes.stickyEffects), (a = !1))
            : !a &&
              -t >= i.effectsOffset &&
              (e.addClass(i.classes.stickyEffects), (a = !0));
        })(t);
      },
      b = function () {
        g();
      },
      w = function () {
        r && (d(), m(), i.parent && ((n = !1), v()));
      };
    (this.destroy = function () {
      r && k(),
        c.$window.off("scroll", b).off("resize", w),
        e.removeClass(i.classes.sticky);
    }),
      (i = jQuery.extend(!0, f, s)),
      (e = t(o).addClass(i.classes.sticky)),
      (c.$window = t(window)),
      i.parent &&
        ((c.$parent = e.parent()),
        "parent" !== i.parent && (c.$parent = c.$parent.closest(i.parent))),
      c.$window.on({ scroll: b, resize: w }),
      g();
  };
  (t.fn.sticky = function (s) {
    var e = "string" == typeof s;
    return (
      this.each(function () {
        var i = t(this);
        if (e) {
          var r = i.data("sticky");
          if (!r)
            throw Error(
              "Trying to perform the `" + s + "` method prior to initialization"
            );
          if (!r[s])
            throw ReferenceError(
              "Method `" + s + "` not found in sticky instance"
            );
          r[s].apply(r, Array.prototype.slice.call(arguments, 1)),
            "destroy" === s && i.removeData("sticky");
        } else i.data("sticky", new o(this, s));
      }),
      this
    );
  }),
    (window.Sticky = o);
})(jQuery);
