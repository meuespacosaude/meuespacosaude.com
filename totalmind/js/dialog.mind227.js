/*! dialogs-manager v4.9.0 | (c) Kobi Zaltzberg | https://github.com/kobizz/dialogs-manager/blob/master/LICENSE.txt
 2021-08-15 18:13 */
!(function (p, t) {
  "use strict";
  var y = {
    widgetsTypes: {},
    createWidgetType: function (t, e, n) {
      n = n || this.Widget;
      function i() {
        n.apply(this, arguments);
      }
      var o = (i.prototype = new n(t));
      return (
        (o.types = o.types.concat([t])),
        p.extend(o, e),
        ((o.constructor = i).extend = function (t, e) {
          return y.createWidgetType(t, e, i);
        }),
        i
      );
    },
    addWidgetType: function (t, e, n) {
      return e && e.prototype instanceof this.Widget
        ? (this.widgetsTypes[t] = e)
        : (this.widgetsTypes[t] = this.createWidgetType(t, e, n));
    },
    getWidgetType: function (t) {
      return this.widgetsTypes[t];
    },
  };
  (y.Instance = function () {
    var n = this,
      e = {},
      i = {};
    (this.createWidget = function (t, e) {
      t = new (y.getWidgetType(t))(t);
      return t.init(n, (e = e || {})), t;
    }),
      (this.getSettings = function (t) {
        return t ? i[t] : Object.create(i);
      }),
      (this.init = function (t) {
        return (
          p.extend(
            i,
            {
              classPrefix: "dialog",
              effects: { show: "fadeIn", hide: "fadeOut" },
            },
            t
          ),
          (e.body = p("body")),
          n
        );
      }),
      n.init();
  }),
    (y.Widget = function (n) {
      function e(t, e) {
        var n = u.effects[t],
          t = d.widget;
        if (p.isFunction(n)) n.apply(t, e);
        else {
          if (!t[n]) throw "Reference Error: The effect " + n + " not found";
          t[n].apply(t, e);
        }
      }
      function i(t) {
        if (!f(t)) {
          if (u.hide.onClick) {
            if (p(t.target).closest(u.selectors.preventClose).length) return;
          } else if (t.target !== this) return;
          c.hide();
        }
      }
      function o(t) {
        f(t) || p(t.target).closest(d.widget).length || g(t) || c.hide();
      }
      function s(t, e) {
        (t = p.extend(!0, {}, t.getSettings())),
          (u = {
            headerMessage: "",
            message: "",
            effects: t.effects,
            classes: {
              globalPrefix: t.classPrefix,
              prefix: t.classPrefix + "-" + n,
              preventScroll: t.classPrefix + "-prevent-scroll",
            },
            selectors: { preventClose: "." + t.classPrefix + "-prevent-close" },
            container: "body",
            preventScroll: !1,
            iframe: null,
            closeButton: !1,
            closeButtonOptions: {
              iconClass: t.classPrefix + "-close-button-icon",
              attributes: {},
              iconElement: "<i>",
            },
            position: {
              element: "widget",
              my: "center",
              at: "center",
              enable: !0,
              autoRefresh: !1,
            },
            hide: {
              auto: !1,
              autoDelay: 5e3,
              onClick: !1,
              onOutsideClick: !0,
              onOutsideContextMenu: !1,
              onBackgroundClick: !0,
              onEscKeyPress: !0,
              ignore: "",
            },
          }),
          p.extend(!0, u, c.getDefaultSettings(), e),
          p.each(u, function (t) {
            t = t.match(/^on([A-Z].*)/);
            t &&
              ((t = t[1].charAt(0).toLowerCase() + t[1].slice(1)),
              c.on(t, this));
          });
      }
      function r(t) {
        27 === t.which && c.hide();
      }
      function t() {
        var t = [d.window];
        d.iframe && t.push(jQuery(d.iframe[0].contentWindow)),
          t.forEach(function (t) {
            u.hide.onEscKeyPress && t.off("keyup", r),
              u.hide.onOutsideClick && t[0].removeEventListener("click", o, !0),
              u.hide.onOutsideContextMenu &&
                t[0].removeEventListener("contextmenu", o, !0),
              u.position.autoRefresh && t.off("resize", c.refreshPosition);
          }),
          (u.hide.onClick || u.hide.onBackgroundClick) &&
            d.widget.off("click", i);
      }
      var c = this,
        u = {},
        a = {},
        d = {},
        l = 0,
        h = ["refreshPosition"],
        g = function (t) {
          return !!u.hide.ignore && !!p(t.target).closest(u.hide.ignore).length;
        },
        f = function (t) {
          return "click" === t.type && 2 === t.button;
        };
      (this.addElement = function (t, e, n) {
        (e = d[t] = p(e || "<div>")),
          (t = t.replace(/([a-z])([A-Z])/g, function () {
            return arguments[1] + "-" + arguments[2].toLowerCase();
          }));
        return (
          (n = n ? n + " " : ""),
          (n += u.classes.globalPrefix + "-" + t),
          (n += " " + u.classes.prefix + "-" + t),
          e.addClass(n),
          e
        );
      }),
        (this.destroy = function () {
          return t(), d.widget.remove(), c.trigger("destroy"), c;
        }),
        (this.getElements = function (t) {
          return t ? d[t] : d;
        }),
        (this.getSettings = function (t) {
          var e = Object.create(u);
          return t ? e[t] : e;
        }),
        (this.hide = function () {
          if (c.isVisible())
            return (
              clearTimeout(l),
              e("hide", arguments),
              t(),
              u.preventScroll &&
                c.getElements("body").removeClass(u.classes.preventScroll),
              c.trigger("hide"),
              c
            );
        }),
        (this.init = function (t, e) {
          if (!(t instanceof y.Instance))
            throw (
              "The " +
              c.widgetName +
              " must to be initialized from an instance of DialogsManager.Instance"
            );
          var n;
          return (
            (n = h.concat(c.getClosureMethods())),
            p.each(n, function () {
              var t = c[this];
              c[this] = function () {
                t.apply(c, arguments);
              };
            }),
            c.trigger("init", e),
            s(t, e),
            (function () {
              if (
                (c.addElement("widget"),
                c.addElement("header"),
                c.addElement("message"),
                c.addElement("window", window),
                c.addElement("body", document.body),
                c.addElement("container", u.container),
                u.iframe && c.addElement("iframe", u.iframe),
                u.closeButton)
              ) {
                u.closeButtonClass &&
                  (u.closeButtonOptions.iconClass = u.closeButtonClass);
                const n = p("<div>", u.closeButtonOptions.attributes),
                  i = p(u.closeButtonOptions.iconElement).addClass(
                    u.closeButtonOptions.iconClass
                  );
                n.append(i), c.addElement("closeButton", n);
              }
              var t = c.getSettings("id");
              t && c.setID(t);
              var e = [];
              p.each(c.types, function () {
                e.push(u.classes.globalPrefix + "-type-" + this);
              }),
                e.push(c.getSettings("className")),
                d.widget.addClass(e.join(" "));
            })(),
            c.buildWidget(),
            c.attachEvents(),
            c.trigger("ready"),
            c
          );
        }),
        (this.isVisible = function () {
          return d.widget.is(":visible");
        }),
        (this.on = function (t, e) {
          return (
            "object" == typeof t
              ? p.each(t, function (t) {
                  c.on(t, this);
                })
              : t.split(" ").forEach(function (t) {
                  a[t] || (a[t] = []), a[t].push(e);
                }),
            c
          );
        }),
        (this.off = function (t, e) {
          if (!a[t]) return c;
          if (!e) return delete a[t], c;
          e = a[t].indexOf(e);
          return -1 !== e && a[t].splice(e, 1), c;
        }),
        (this.refreshPosition = function () {
          var t, e, n, i, o, s, r;
          u.position.enable &&
            ((t = p.extend({}, u.position)),
            d[t.of] && (t.of = d[t.of]),
            t.of || (t.of = window),
            u.iframe &&
              (e = t).my &&
              ((n = /([+-]\d+)?$/),
              (i = d.iframe.offset()),
              (o = d.iframe[0].contentWindow),
              (s = e.my.split(" ")),
              (r = []),
              1 === s.length &&
                (/left|right/.test(s[0])
                  ? s.push("center")
                  : s.unshift("center")),
              s.forEach(function (t, e) {
                t = t.replace(n, function (t) {
                  return (
                    (t = +t || 0),
                    (t =
                      0 <= (t += e ? i.top - o.scrollY : i.left - o.scrollX)
                        ? "+" + t
                        : t)
                  );
                });
                r.push(t);
              }),
              (e.my = r.join(" "))),
            d[t.element].position(t));
        }),
        (this.setID = function (t) {
          return d.widget.attr("id", t), c;
        }),
        (this.setHeaderMessage = function (t) {
          return c.getElements("header").html(t), c;
        }),
        (this.setMessage = function (t) {
          return d.message.html(t), c;
        }),
        (this.setSettings = function (t, e) {
          return (
            jQuery.isPlainObject(e) ? p.extend(!0, u[t], e) : (u[t] = e), c
          );
        }),
        (this.show = function () {
          var t;
          return (
            clearTimeout(l),
            d.widget.appendTo(d.container).hide(),
            e("show", arguments),
            c.refreshPosition(),
            u.hide.auto && (l = setTimeout(c.hide, u.hide.autoDelay)),
            (t = [d.window]),
            d.iframe && t.push(jQuery(d.iframe[0].contentWindow)),
            t.forEach(function (t) {
              u.hide.onEscKeyPress && t.on("keyup", r),
                u.hide.onOutsideClick && t[0].addEventListener("click", o, !0),
                u.hide.onOutsideContextMenu &&
                  t[0].addEventListener("contextmenu", o, !0),
                u.position.autoRefresh && t.on("resize", c.refreshPosition);
            }),
            (u.hide.onClick || u.hide.onBackgroundClick) &&
              d.widget.on("click", i),
            u.preventScroll &&
              c.getElements("body").addClass(u.classes.preventScroll),
            c.trigger("show"),
            c
          );
        }),
        (this.trigger = function (t, n) {
          var e = "on" + t[0].toUpperCase() + t.slice(1);
          c[e] && c[e](n);
          t = a[t];
          if (t)
            return (
              p.each(t, function (t, e) {
                e.call(c, n);
              }),
              c
            );
        });
    }),
    (y.Widget.prototype.types = []),
    (y.Widget.prototype.buildWidget = function () {
      var t = this.getElements(),
        e = this.getSettings();
      t.widget.append(t.header, t.message),
        this.setHeaderMessage(e.headerMessage),
        this.setMessage(e.message),
        this.getSettings("closeButton") && t.widget.prepend(t.closeButton);
    }),
    (y.Widget.prototype.attachEvents = function () {
      var t = this;
      t.getSettings("closeButton") &&
        t.getElements("closeButton").on("click", function () {
          t.hide();
        });
    }),
    (y.Widget.prototype.getDefaultSettings = function () {
      return {};
    }),
    (y.Widget.prototype.getClosureMethods = function () {
      return [];
    }),
    (y.Widget.prototype.onHide = function () {}),
    (y.Widget.prototype.onShow = function () {}),
    (y.Widget.prototype.onInit = function () {}),
    (y.Widget.prototype.onReady = function () {}),
    (y.widgetsTypes.simple = y.Widget),
    y.addWidgetType("buttons", {
      activeKeyUp: function (t) {
        9 === t.which && t.preventDefault(),
          this.hotKeys[t.which] && this.hotKeys[t.which](this);
      },
      activeKeyDown: function (t) {
        var e, n;
        !this.focusedButton ||
          (9 === t.which &&
            (t.preventDefault(),
            (e = this.focusedButton.index()),
            t.shiftKey
              ? (n = e - 1) < 0 && (n = this.buttons.length - 1)
              : (n = e + 1) >= this.buttons.length && (n = 0),
            (this.focusedButton = this.buttons[n].focus())));
      },
      addButton: function (t) {
        var e = this,
          n = e.getSettings(),
          i = jQuery.extend(n.button, t),
          o = t.classes ? t.classes + " " : "";
        o += n.classes.globalPrefix + "-button";
        i = e.addElement(t.name, p("<" + i.tag + ">").html(t.text), o);
        e.buttons.push(i);
        o = function () {
          n.hide.onButtonClick && e.hide(),
            p.isFunction(t.callback) && t.callback.call(this, e);
        };
        return (
          i.on("click", o),
          t.hotKey && (this.hotKeys[t.hotKey] = o),
          this.getElements("buttonsWrapper").append(i),
          t.focus && (this.focusedButton = i),
          e
        );
      },
      bindHotKeys: function () {
        this.getElements("window").on({
          keyup: this.activeKeyUp,
          keydown: this.activeKeyDown,
        });
      },
      buildWidget: function () {
        y.Widget.prototype.buildWidget.apply(this, arguments);
        var t = this.addElement("buttonsWrapper");
        this.getElements("widget").append(t);
      },
      getClosureMethods: function () {
        return ["activeKeyUp", "activeKeyDown"];
      },
      getDefaultSettings: function () {
        return { hide: { onButtonClick: !0 }, button: { tag: "button" } };
      },
      onHide: function () {
        this.unbindHotKeys();
      },
      onInit: function () {
        (this.buttons = []), (this.hotKeys = {}), (this.focusedButton = null);
      },
      onShow: function () {
        this.bindHotKeys(),
          this.focusedButton || (this.focusedButton = this.buttons[0]),
          this.focusedButton && this.focusedButton.focus();
      },
      unbindHotKeys: function () {
        this.getElements("window").off({
          keyup: this.activeKeyUp,
          keydown: this.activeKeyDown,
        });
      },
    }),
    y.addWidgetType(
      "lightbox",
      y.getWidgetType("buttons").extend("lightbox", {
        getDefaultSettings: function () {
          var t = y
            .getWidgetType("buttons")
            .prototype.getDefaultSettings.apply(this, arguments);
          return p.extend(!0, t, {
            contentWidth: "auto",
            contentHeight: "auto",
            position: {
              element: "widgetContent",
              of: "widget",
              autoRefresh: !0,
            },
          });
        },
        buildWidget: function () {
          y.getWidgetType("buttons").prototype.buildWidget.apply(
            this,
            arguments
          );
          var t = this.addElement("widgetContent"),
            e = this.getElements();
          t.append(e.header, e.message, e.buttonsWrapper),
            e.widget.html(t),
            e.closeButton && t.prepend(e.closeButton);
        },
        onReady: function () {
          var t = this.getElements(),
            e = this.getSettings();
          "auto" !== e.contentWidth && t.message.width(e.contentWidth),
            "auto" !== e.contentHeight && t.message.height(e.contentHeight);
        },
      })
    ),
    y.addWidgetType(
      "confirm",
      y.getWidgetType("lightbox").extend("confirm", {
        onReady: function () {
          y.getWidgetType("lightbox").prototype.onReady.apply(this, arguments);
          var t = this.getSettings("strings"),
            e = "cancel" === this.getSettings("defaultOption");
          this.addButton({
            name: "cancel",
            text: t.cancel,
            callback: function (t) {
              t.trigger("cancel");
            },
            focus: e,
          }),
            this.addButton({
              name: "ok",
              text: t.confirm,
              callback: function (t) {
                t.trigger("confirm");
              },
              focus: !e,
            });
        },
        getDefaultSettings: function () {
          var t = y
            .getWidgetType("lightbox")
            .prototype.getDefaultSettings.apply(this, arguments);
          return (
            (t.strings = { confirm: "OK", cancel: "Cancel" }),
            (t.defaultOption = "cancel"),
            t
          );
        },
      })
    ),
    y.addWidgetType(
      "alert",
      y.getWidgetType("lightbox").extend("alert", {
        onReady: function () {
          y.getWidgetType("lightbox").prototype.onReady.apply(this, arguments);
          var t = this.getSettings("strings");
          this.addButton({
            name: "ok",
            text: t.confirm,
            callback: function (t) {
              t.trigger("confirm");
            },
          });
        },
        getDefaultSettings: function () {
          var t = y
            .getWidgetType("lightbox")
            .prototype.getDefaultSettings.apply(this, arguments);
          return (t.strings = { confirm: "OK" }), t;
        },
      })
    ),
    (t.DialogsManager = y);
})(
  "undefined" != typeof jQuery
    ? jQuery
    : "function" == typeof require && require("jquery"),
  "undefined" != typeof module && void 0 !== module.exports
    ? module.exports
    : window
);
