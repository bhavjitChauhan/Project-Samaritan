// jshint ignore: start

// System object
const System = function() {
    this.init();
};
System.prototype = {
    init: function() {
        console.clear();
        console.time("System Initialize");
        
        // Basic system information
        this.info = {
            name: "Project Samaritan",
            version: "0.0.1",
            author: "Aliquis"
        };
        
        // Log system information to console
        console.group("");
        console.info("%c%s v%s", "font-weight:bold;", this.info.name, this.info.version);
        console.info("(c) %d %s. Most rights reserved, I think...", year(), this.info.author);
        console.info("");
        console.groupEnd();
        
        console.timeEnd("System Initialize");
    },
    boot: function() {
        console.time("System Boot");
        this.booted = true;
        console.timeEnd("System Boot");
    }
};

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

const __requirements__ = {
    "core": "#5219990839590912"
}

bootstrapper({
    done: function(BMS, methods) {
        let system = new System();
        draw = function() {
            if(!system.booted) {
                system.boot();
            }
        };
    }
})
