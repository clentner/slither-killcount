// http://stackoverflow.com/a/9517879/3707721
function injectScript(f) {
    var actualCode = '(' + f + ')();';
    var script = document.createElement('script');
    script.textContent = actualCode;
    (document.body||document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
}

function addKills(){
    var oldconnect = window.connect;
    window.connect = function(){
        var res = oldconnect();
        try {
            if (0 != sos.length){
                window.kills = 0;

                window.ws.addEventListener("message", function(b){
                    if (ws == this) {
                        var c = new Uint8Array(b.data);
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

    var oldredraw = window.redraw;
    window.redraw = function(){
        oldredraw();
        if (window.animating) {
            window.lbf.innerHTML += '<br><span>Your kills: ' + window.kills + '</span>';
        }
    }
    window.lbf.style.height = "50px";
}

injectScript(addKills);