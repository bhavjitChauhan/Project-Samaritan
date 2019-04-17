//jshint ignore: start

// System object
var System = function() {
    this.init();
};
System.prototype = {
    init: function() {
        // Basic system information
        const NAME = "Project Samaritan", 
        	  VERSION = "0.0.1", 
        	  AUTHOR = "Aliquis";
        	  
        // For debugging purposes
        const console = (function() {
        	return this.console;	
        })();
        
        // Log system information to console
        with(console) {
            clear();
            group("");
            info("%c" + NAME + " v" + VERSION + "\n%c(c) " + year() + " " + AUTHOR + ". Most rights reserved, I think...\n ", "font-weight:bold;", "font-weight:normal");
            groupEnd();
        }
        
        // To calculate system initialization time
        let startTime = Date.parse(new Date());
        
        // Stores all events
        var logs = [];
        // Event object
        var Event = function(event, type) {
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
            logs.push(this);
        };
        
        // Client information
        var window = (function () {
            return this;
        })();
        this.appVersion = window.navigator.appVersion
        new Event(this.appVersion, "debug")
        this.userAgent = window.navigator.userAgent;
        new Event(this.userAgent, "debug");
        
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
        
        // Calculate and log initialization time
        this.initTime = Date.parse(new Date()) - startTime;
        new Event("System initialized in " + this.initTime + "ms");
    }
};

// Export if called by another program as module
var export_module;
if (export_module){
    export_module(System);
} else {
    // For testing purposes
    var s = new System();
}
