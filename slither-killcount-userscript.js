// ==UserScript==
// @name         Slither Killcount
// @namespace    slither-killcount-cjl
// @version      1
// @description  Add killcount to slither.io
// @author       github.com/clentner
// @include      http://slither.io/
// @grant        none
// ==/UserScript==

(function (){
    var oldconnect = window.connect;
    window.connect = function(){
        var res = oldconnect();
        try {
            // We have a server to connect to
            if (0 != sos.length){
                window.kills = 0;

                window.ws.addEventListener("message", function(b){
                    if (ws == this) {
                        var c = new Uint8Array(b.data);
                        // Logic from game.js. Pretty sure this is off-by-one.
                        if (2 <= c.length) {
                            var f = String.fromCharCode(c[2]);
                            if ("k" == f) {
                                window.kills ++;
                            }
                        }
                    }
                }, false)
            }
        } catch (e) {
            console.error("While adding killcount event listener, caught ", e);
        }
        return res;
    }

    // Wrap redraw so we can display the count
    var oldredraw = window.redraw;
    window.redraw = function(){
        oldredraw();
        // Conditional copied from game.js. Only periodically is the lbf display redrawn.
        if (window.animating) {
            window.lbf.innerHTML += '<br><span>Your kills: ' + window.kills + '</span>';
        }
    }
    // Make space for it
    window.lbf.style.height = "50px";
})();
