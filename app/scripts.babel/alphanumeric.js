(function($) {
  $.fn.alphanumeric = function(p) {
    const baseAllowedKeyCodes = new Array(8, 9, 46, 37, 39);
    p = $.extend({
      ichars: "!@#$%^&*()+=[]\\\";,/{}|\":<>?~`.- _",
      nchars: "",
      allow: "",
      allowkeycode: "",
      blockcntlkey: true,
      onedecimal: false,
      allownegative: false
    }, p);
    return this.each(

      function() {
        if(p.nocaps) p.nchars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if(p.allcaps) p.nchars += "abcdefghijklmnopqrstuvwxyz";
        const s = p.allow.split("");
        for(let i = 0; i < s.length; i++) {
          if(p.ichars.indexOf(s[i]) !== -1) {
            s[i] = "\\" + s[i];
          }
        }

        p.allow = s.join("|");
        const reg = new RegExp(p.allow, "gi");
        let ch = p.ichars + p.nchars;
        ch = ch.replace(reg, "");
        $(this).keydown(
          //this is to block cntl in browsers for cut and paste. if we are block certain chars anyway cntl c/v should be apart of that
          function(e) {
            if(window.event) {
              e = window.event;
            }
            if(p.blockcntlkey) {
              if(e.ctrlKey) {
                if(typeof e.preventDefault !== "undefined") {
                  e.preventDefault();
                } else {
                  e.cancelBubble = true;
                }
                return false;
              }
            }
          });
        $(this).keypress(

          function(e) {
            if(window.event) {
              e = window.event;
            }
            let code, k;
            if(e.keyCode === 0) { //FF
              k = String.fromCharCode(e.which);
              code = e.which;
            } else { //IE
              k = String.fromCharCode(e.keyCode);
              code = e.keyCode;
            }
            //e.charCode is used to block numpad entries from working in FF
            if(ch.indexOf(k) !== -1 && !isValidKeyCode(this, code, e.charCode, p.money)) {
              if(e.preventDefault !== undefined) {
                e.preventDefault();
              } else {
                e.cancelBubble = true;
              }
              return false;
            }
            //left as failsafe from the keydown event. works in FF
            if(e.ctrlKey && k === "v") {
              if(e.preventDefault != undefined) {
                e.preventDefault();
              } else {
                e.cancelBubble = true;
              }
              return false;
            }
            const value = $(this).val();
            if(value.indexOf("-") !== -1 && p.allownegative && e.charCode === 45) {
              return false;
            }
            if(e.charCode === 46 && value.indexOf(".") !== -1 && p.onedecimal) {
              return false;
            }
          });
        $(this).bind("contextmenu", function() {
          return false;
        });
      });

    function isValidKeyCode(obj, code, charCode) {
      const s = p.allowkeycode.split(",");
      const testValues = baseAllowedKeyCodes.concat(s);
      for(let i = 0; i < testValues.length; i++) {
        if(testValues[i] === code && charCode === 0) {
          return true;
        }
      }
      return false;
    }
  };
  $.fn.numeric = function(p) {
    let az = "abcdefghijklmnopqrstuvwxyz";
    az += az.toUpperCase();
    p = $.extend({
      nchars: az
    }, p);
    return this.each(function() {
      $(this).alphanumeric(p);
    });
  };
  $.fn.alpha = function(p) {
    const nm = "1234567890";
    p = $.extend({
      nchars: nm
    }, p);
    return this.each(function() {
      $(this).alphanumeric(p);
    });
  };
})(jQuery);