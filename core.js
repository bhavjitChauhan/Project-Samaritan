// jshint ignore: start

const NAME = "Project Samaritan Core",
      VERSION = "0.0.2",
      AUTHOR = "Aliquis";

// Makes development easier, disables unnecessary animations and enables more verbose logging
const DEBUG_MODE = true;

// Using BMS, see www.khanacademy.org/cs/i/6070976254115840
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
    "core": "#5219990839590912",
    "images": "#5748624898490368",
    "applications": "#6275061522989056"
};

// System object {
const System = function() {
    
};
System.prototype = {
    // Using the `once` method of underscore.js to prevent system being initialized more than once
    init: _.once(function() {
        // Clear any console logs created by Khan Academy or extensions
        console.clear();
        // Begin timer for initialization
        console.time("System Initialize");
        console.log("Initializing system...");
        // Log system information to console in group
        console.group("");
        console.info("%c%s v%s", "font-weight:bold;", NAME, VERSION);
        console.info("(c) %d %s. Most rights reserved, I think...", year(), AUTHOR);
        // Blank line for symmetry in console
        console.info("");
        console.groupEnd();
        this.initialized = true;
        // End and log system initialization time
        console.timeEnd("System Initialize");
    }),
    // Using the `once` method of underscore.js to prevent system being booted more than once
    boot: _.once(function() {
        if(!this.initialized) {
            console.warn("Attempted system boot before initialization.");
            this.init();
        }
        // Begin timer for system boot
        console.time("System Boot");
        
        // Import core library, images and applications
        bootstrapper({
            done: function(BMS, modules) {
                // Check if variables were defined correctly
                try {
                    IMPORTED_CORE;
                } catch(error) {
                    console.error("Core library variables not defined, restarting program...");
                    Program.restart();
                }
                // Run functions asynchronously
                chainAsync([
                    function(done) {
                        // Load images
                        let images = system.images = modules.images;
                        for(let i in images) {
                            console.log("Loading image '" + images[i].name + "'...");
                            try {
                                images[i].load();
                            } catch(error) {
                                console.error("Error loading image '" + images[i].name + "'\n" + error);
                            }
                        }
                        done();
                    },
                    function(done) {
                        // Load applications
                        let applications = system.applications = modules.applications;
                        for(let i in applications) {
                            console.log("Loading application '" + applications[i].name + "'...");
                            try {
                                applications[i].init();
                            } catch(error) {
                                console.error("Error loading application '" + applications[i].name + "'\n" + error);
                            }
                        }
                        done();  
                    },
                    function() {
                        system.booted = true;
                        // End and log system boot time
                        console.timeEnd("System Boot");
                    }
                ]);
            }
        });
    })
};
// }

let system = new System();
system.init();
system.boot();
draw = function() {
    if(system.booted) {
        background(0, 255, 0);
    }
}
