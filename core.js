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

// jQuery
const $ = (function() {
    return this.$;
})();
// underscore.js
const _ = (function() {
    return this._;
})();
String.prototype.toTitleCase = function(str) {
    return this.replace(/\w\S*/g, function(word) {
		// For every word, set the beginning letter to upper case and the rest to lower case
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
};
const console = (function() {
	return this.console;
})();

// System object
const System = function() {
    this.init();
};
System.prototype = {
    init: function() {
        console.clear();
        console.time("System Initialize");
        
        // Basic system information
        let info = {
            name: "Project Samaritan",
            version: "0.0.1",
            author: "Aliquis"
        };
        
        // Log system information to console
        console.group("");
        console.info("%c%s v%s", "font-weight:bold;", info.name, info.version);
        console.info("(c) %d %s. Most rights reserved, I think...", year(), info.author);
        console.info("");
        console.groupEnd();
        
        info.events = [];
        // Event object
        const Event = function(event, type) {
            this.event = event;
            this.type = type || "log";
            this.createAt = new Date();
            try {
                // Try using any specified log types
                console[this.type](this.event);
            } catch(error) {
                if(error instanceof TypeError) {
                    new Event("Invalid Event type '" + this.type + "'", "warn");
                    // Log event to console regardless
                    console.log(this.event);
                } else {
                    new Event("Error creating event: " + error, "error");
                }
            }
            // Add event to logs array
            info.events.push(this);
        };
        
        // Client information
        let window = (function () {
            return this;
        })();
        let appVersion = window.navigator.appVersion
        new Event(appVersion, "debug")
        let userAgent = window.navigator.userAgent;
        new Event(userAgent, "debug");
        // let browser = (function() {
        //     var browsers = ["MSIE", "Firefox", "Safari", "Chrome", "Opera"];
        //     for (i = browsers.length - 1; i > -1 && this.userAgent.indexOf(browsers[i]) === -1; i--) {}
        //     return browsers[i];
        // })();
        
        info.client = {
            "window": window,
            "appVersion": appVersion,
            "userAgent": userAgent
        };
        
        // Make info public key
        this.info = info;
        
        console.timeEnd("System Initialize");
    },
    boot: function() {
        console.time("System Boot");
        this.booted = true;
        console.timeEnd("System Boot");
    }
};

var exports = [$, _, String.prototype.toTitleCase, console]

var importer_context, export_module;
if(importer_context && export_module) {
    for(var i in exports) {
        importer_context.i = exports[i];
    }
    export_module(null);
} else {
    var system = new System();
    draw = function() {
        if(!system.booted) {
            system.boot();
        }
    };
}
