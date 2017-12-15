// http://stackoverflow.com/a/9517879/3707721
// Inject a script into the current window context so it has access to the same variables
function injectScript(f) {
    var actualCode = '(' + f + ')();';
    var script = document.createElement('script');
    script.textContent = actualCode;
    (document.body||document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
}

/*
Wrap the global connect() function with our own logic.
Add a new event listener to count the number of "k" type messages over the socket
Conditionals are taken from de-minified game source.
*/
function addKills(){
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
}

injectScript(addKills);
