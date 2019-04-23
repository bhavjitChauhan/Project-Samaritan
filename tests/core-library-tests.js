// jshint ignore: start

const bootstrapper = function(callback) {
    let doc = Object.constructor("return this.document")();
    let jsonp = doc[["createElement"]]("script");
    doc.BMS_bootstrap_loader = function(data) {
        delete doc.BMS_bootstrap_loader; jsonp.parentNode.removeChild(jsonp);
        Object.constructor("importer_context", "export_module", data.revision.code)(this, callback);
    }.bind(this);
    jsonp.setAttribute("src", "https://www.khanacademy.org/api/labs/scratchpads/5522928629252096?callback=document.BMS_bootstrap_loader");
    doc.head.appendChild(jsonp);
};

var run = function() {
    try {
        console.clear();
        textFont(createFont("monospace"));
        fill(0);
        // Demonstrate executing functions asynchronously with `chainAsync`
        chainAsync([function(next) {
            // Demonstrate `toTitleCase` method
            text("core library tests".toTitleCase(), 25, 50);
            next(); 
        }, function(next) {
            // Demonstrate `highlightedText`
            // Demonstrate formatted duration from milliseconds with `formatDuration`
            highlightedText(formatDuration(millis()), 25, 75, color(255, 255, 0));
            next();
        }, function(next) {
            // Libraries to display
            let libraries = {
                "jQuery version": $().jquery,
                "underscore.js version": _.VERSION,
                "Backbone.js version": Backbone.VERSION
            };
            // Demonstrate `centeredObjectText` by displaying library name and version
            text(centeredObjectText(libraries), 25, 100);
            next();
        }, function(next) {
            // Demonstrate `mostPerformant` by testing which method of printint to browser console is more efficient
            let winner = mostPerformant([debug, console.log]);
            // Demonstrate text with colors based on results from performance test with `multiColoredText`
            multiColoredText("[0,0,255]debug() [0,0,0]is " + (winner === 0 ? "[0,255,0]faster" : "[255,0,0]slower") + " [0,0,0]than [0,0,255]console.log()", 25, 175);
            next();
        }, function() {
            // Demonstrate `attempt` by executing `printHTML` which
            attempt(printHTML, "<a href='https://www.khanacademy.org/profile/AIiquis/'>My Profile");
        }])
    } catch(error) {
        println("\n\nError loading library, try restarting.\n\n" + error);
    }
};

const __requirements__ = {
    "core": "#5219990839590912"
}

// Import library
bootstrapper({
    done: function(BMS, modules) {
        run();
    }
})

// For enabling the 'Restart' button
random();
