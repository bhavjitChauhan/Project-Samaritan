// jshint ignore: start
const NAME = "Project Samaritan Core",
	VERSION = "0.0.3",
	AUTHOR = "Aliquis";

// Global Variables {
/* The current environnment the program is in. To be utilized by modules and core to determine wether verbose debugging and experimental features should be enabled. 

Environment should be set to 'production', 'development' or 'canary' */
const ENV = "development";
/* Since variables' are still stored after the program is restarted Project Samaritan makes use of this functionality to prevent unnecessary loading. 

Set the value to any set before program restart or false by default */
var clearMemory = clearMemory || false;
// }
// Imports {
// Using BMS, see www.khanacademy.org/cs/i/6070976254115840
const bootstrapper = function(callback) {
	let doc = Object.constructor("return this.document")();
	let jsonp = doc[["createElement"]]("script");
	doc.BMS_bootstrap_loader = function(data) {
		delete doc.BMS_bootstrap_loader;
		jsonp.parentNode.removeChild(jsonp);
		Object.constructor("importer_context", "export_module", data.revision.code)
			(this, callback);
	}.bind(this);
	jsonp.setAttribute("src",
		"https://www.khanacademy.org/api/labs/scratchpads/5522928629252096?callback=document.BMS_bootstrap_loader"
	);
	doc.head.appendChild(jsonp);
};
const __requirements__ = {
	"core": "#5219990839590912",
	"images": "#5748624898490368",
	"applications": "#6275061522989056"
};
// }
// System Object {
const System = function() {
	// For startup operations
	this.startup = {
		// Line number to write to
		line: 0,
		// Add line to canvas
		addLine: function(string) {
			fill(255);
			// Pre-increment `this.line` so the `y` value is never 0
			text(string, 0, ++this.line * textAscent() * 1.5);
		}
	};
	this.createdAt = new Date();
};
System.prototype = {
	// Using the `once` method of underscore.js to prevent system being initialized more than once
	init: _.once(function() {
		background(0);
		// Set font for logging to canvas
		textFont(createFont("monospace"));
		// Log initialization to canvas
		this.startup.addLine("Initializing system...");
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
		if (!this.initialized) {
			console.warn("Attempted system boot before initialization.");
			this.init();
		}
		// Begin timer for system boot
		console.time("System Boot");
		console.log("Booting system...");
		// Background is not set so previous logs to canvas are visible
		// Set font for logging to verbose screen again, just in case
		textFont(createFont("monospace"));
		// Log boot to canvas
		this.startup.addLine("Booting system...");
		// Import core library, images and applications
		bootstrapper({
			done: function(BMS, modules) {
				// Check if imported variables were defined globally
				try {
					IMPORTED_CORE;
				} catch (error) {
					console.error(
						"Core library variables not defined, restarting program...");
					Program.restart();
				}
				// Run functions asynchronously
				chainAsync([
					function(done) {
						// Load images
						system.startup.addLine("Loading images");
						let images = system.images = modules.images;
						for (let i in images) {
							console.log("Loading image '" + images[i].name + "'...");
							try {
								images[i].load();
							} catch (error) {
								console.error("Error loading image '" + images[i].name +
								    "'\n" + error);
							}
						}
						console.log("Loaded all " + images.length + " images.");
						done();
					},
					function(done) {
						// Load applications
						let applications = system.applications = modules.applications;
						for (let i in applications) {
							console.log("Loading application '" + applications[i].name +
								"'...");
							try {
								applications[i].init();
							} catch (error) {
								console.error("Error loading application '" + applications[i].name +
									"'\n" + error);
							}
						}
						console.log("Loaded all " + applications.length +
							" applications.");
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
// Drawing {
/* Set the value to `system` if it was previously set, this reduces loading times as system only needs to be initialized and booted once */
let system = system || new System();
// Create new system instance if `clearMemory` is true
if (clearMemory) {
    system = new System();   
}

/* Try initializing and booting the system, this will catch any errors not created by applications or images as those are already in a `try`/`catch` statement */
try {
    system.init();
    system.boot();
} catch (error) {
    console.error(error);
    // Prepare to clear memory as corrupted variables might be causing errors
    clearMemory = true;
}
draw = function() {
    // Draw test applications if system is booted
	system.booted && system.applications[0].draw();
}
// }

// Reset the value to false after cleanup is done, always true if development environment
clearMemory = ENV == "development";
