$(".wcSafeShow").click(function() {
    $(".safeWrap").fadeIn();
});

$(".wcSafeClose").click(function() {
    $(".safeWrap").fadeOut();
    $("#generatelink").addClass("hidden");
    $("#generateurl").val("");
});

$(document).ready(function() {
    $("#btngenerate").on("click", function() {
        var e = $("#generateurl").val();
        var r = $("#generatelink");
        var a = $("#generateloading");
        var n = $("#resulturl");
        
        if (e === "") {
            $("#generateurl").focus();
            return false;
        }
        
        $("#copytoclipboard").html(setCopyUrl);
        a.removeClass("hidden");
        r.addClass("hidden");
        
        $.ajax({
            url: "/feeds/posts/summary?alt=json-in-script",
            type: "get",
            dataType: "jsonp",
            success: function(t) {
                var o = "", l = t.feed.entry, s = new Array();
                if (l !== undefined) {
                    for (var i = 0; i < l.length; i++) {
                        for (var d = 0; d < l[i].link.length; d++) {
                            if ("alternate" === l[i].link[d].rel) {
                                o = l[i].link[d].href;
                                break;
                            }
                        }
                        s[i] = o;
                    }
                    var c = Math.random() * s.length;
                    c = parseInt(c);
                    var resultgenerate = "https://www.rulsz.eu.org/p/safe.html" + "#?o=" + aesCrypto.encrypt(convertstr(e), convertstr("root"));
                    a.addClass("hidden");
                    r.removeClass("hidden");
                    n.val(resultgenerate);
                } else {
                    n.val("No result!");
                }
            },
            error: function() {
                n.val("Error loading feed!");
            }
        });
    });

    new ClipboardJS(".copytoclipboard").on("success", function(e) {
        $("#copytoclipboard").html(setCopied);
    });
});

function convertstr(t) {
    return t.replace(/^\s+/, "").replace(/\s+$/, "");
}

!function(t) {
    var e = {
        init: function(e) {
            var r = {
                timer: null,
                timerSeconds: 10,
                callback: function() {},
                timerCurrent: 0,
                showPercentage: !1,
                fill: !1,
                color: "#CCC"
            };
            r = t.extend(r, e);
            this.each(function() {
                var e = t(this);
                e.data("pietimer") || (e.addClass("pietimer"), e.css({ fontSize: e.width() }), e.data("pietimer", r), r.showPercentage && e.find(".percent").show(), r.fill && e.addClass("fill"), e.pietimer("start"));
            });
        },
        stopWatch: function() {
            var e = t(this).data("pietimer");
            if (e) {
                var r = (e.timerFinish - (new Date).getTime()) / 1e3;
                if (r <= 0) clearInterval(e.timer), t(this).pietimer("drawTimer", 100), e.callback();
                else {
                    var n = 100 - r / e.timerSeconds * 100;
                    t(this).pietimer("drawTimer", n);
                }
            }
        },
        drawTimer: function(e) {
            var $this = t(this);
            var r = $this.data("pietimer");
            if (r) {
                $this.html('<div class="percent"></div><div class="slice' + (e > 50 ? ' gt50"' : '"') + '><div class="pie"></div>' + (e > 50 ? '<div class="pie fill"></div>' : "") + "</div>");
                var n = 3.6 * e;
                $this.find(".slice .pie").css({
                    "-moz-transform": "rotate(" + n + "deg)",
                    "-webkit-transform": "rotate(" + n + "deg)",
                    "-o-transform": "rotate(" + n + "deg)",
                    transform: "rotate(" + n + "deg)"
                });
                $this.find(".percent").html(Math.round(e) + "%");
                r.showPercentage && $this.find(".percent").show();
                $this.hasClass("fill") ? $this.find(".slice .pie").css({ backgroundColor: r.color }) : $this.find(".slice .pie").css({ borderColor: r.color });
            }
        },
        start: function() {
            var e = t(this).data("pietimer");
            e && (e.timerFinish = (new Date).getTime() + 1e3 * e.timerSeconds, t(this).pietimer("drawTimer", 0), e.timer = setInterval("$this.pietimer('stopWatch')", 50));
        },
        reset: function() {
            var e = t(this).data("pietimer");
            e && (clearInterval(e.timer), t(this).pietimer("drawTimer", 0));
        }
    };

    t.fn.pietimer = function(r) {
        return e[r] ? e[r].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof r && r ? void t.error("Method " + r + " does not exist on jQuery.pietimer") : e.init.apply(this, arguments);
    };
}(jQuery);

function gotolinkcountdown() {
    var t = 3;
    gotolink.removeClass("hidden");
    var e = setInterval(function() {
        var r = t -= 1;
        gotolink.html(setText);
        r < 0 && (clearInterval(e), gotolink.prop("disabled", !1), gotolink.html(setGotolink));
    }, 1e3);
}

$(document).ready(function() {
    $.urlParam = function(t) {
        var e = new RegExp("[?&]" + t + "=([^&#]*)").exec(window.location.href);
        return null == e ? null : decodeURI(e[1]) || 0;
    };

    var wcGetLink = $("#wcGetLink"),
        gotolink = $("#gotolink"),
        timer = $("#timer");

    if (null != $.urlParam("o")) {
        timer.pietimer({
            timerSeconds: setTimer,
            color: setColor,
            fill: !1,
            showPercentage: !0,
            callback: function() {
                wcGetLink.prop("disabled", !1);
                wcGetLink.removeClass("hidden");
                timer.addClass("hidden");
            }
        });
    }

    var request = !1;
    wcGetLink.click(function() {
        0 == request && (gotolinkcountdown(), request = !0);
        $("html, body").animate({ scrollTop: eval(gotolink.offset().top - 10) }, 500);
    });

    gotolink.on("click", function() {
        var t = aesCrypto.decrypt(convertstr($.urlParam("o")), convertstr("root"));
        window.location.href = t;
    });
});
