// jshint ignore: start

var bootstrapper = function(callback) {
    var doc = Object.constructor("return this.document")();
    var jsonp = doc[["createElement"]]("script");
    doc.BMS_bootstrap_loader = function(data) {
        delete doc.BMS_bootstrap_loader; jsonp.parentNode.removeChild(jsonp);
        Object.constructor("importer_context", "export_module", data.revision.code)(this, callback);
    }.bind(this);
    jsonp.setAttribute("src", "https://www.khanacademy.org/api/labs/scratchpads/5522928629252096?callback=document.BMS_bootstrap_loader");
    doc.head.appendChild(jsonp);
};

var runTests = function() {
    try {
        console.clear();
        var strings = [
            "title case method works".toTitleCase(),
            "jQuery version: " + $().jquery,
            "underscore.js version: " + _.VERSION
        ];
        fill(0);
        for(i in strings) {
            text(strings[i], textAscent(), i * textAscent() * 2 + textAscent() * 2);
        }
    } catch(error) {
        _clearLogs();
        println("Error loading library, try reloading the page.\n\n" + error);
    }
};

// Import library
bootstrapper(function(BMS) {
    BMS.import_module("4796495045427200", runTests);
});

// // For enabling the 'Restart' button
random();
