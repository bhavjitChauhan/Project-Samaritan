// jshint ignore: start

// For debugging purposes
const console = (function() {
	return this.console;	
})();

// System object
var System = function() {
    this.init();
};
System.prototype = {
    init: function() {
        // Basic system information
        let info = {
            name: "Project Samaritan",
            version: "0.0.1",
            author: "Aliquis"
        };
        
        // Log system information to console
        console.clear();
        console.group("");
        console.info("%c%s v%s", "font-weight:bold;", info.name, info.version);
        console.info("(c) %d %s. Most rights reserved, I think...", year(), info.author);
        console.info("");
        console.groupEnd();
            
        // To calculate system initialization time
        let startTime = Date.parse(new Date());
        
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
        
        // Load jQuery
        try {
            const $ = (function() {
                return this.$;
            })();
            new Event("Succesfully loaded jQuery");
        } catch(error) {
            // In case this functionality is removed in the future
            new Event("Error loading jQuery: " + error, "warn")
        }
        
        // Load underscore.js
        try {
            const _ = (function() {
                return this._;
            })();
            new Event("Succesfully loaded underscore.js");
        } catch(error) {
            new Event("Error loading underscore.js: " + error, "warn")
        }
        
        // Make info public key
        this.info = info;
        
        // Calculate and log initialization time
        this.initTime = Date.parse(new Date()) - startTime;
        new Event("System initialized in " + this.initTime + "ms");
    }
};

var system = new System();
