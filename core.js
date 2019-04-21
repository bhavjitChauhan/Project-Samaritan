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
        
        // Client information
        let window = (function () {
            return this;
        })();
        let appVersion = window.navigator.appVersion
        console.debug(appVersion);
        let userAgent = window.navigator.userAgent;
        console.debug(userAgent);
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

var __requirements__ = {
    "": "#5219990839590912"
}

bootstrapper({
    done: function(BMS, methods) {
        var system = new System();
        draw = function() {
            if(!system.booted) {
                system.boot();
            }
        };
    }
})
