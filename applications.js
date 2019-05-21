// jshint ignore: start
const NAME = "Project Samaritan Applications Library",
	VERSION = "0.0.2",
	AUTHOR = "Aliquis";

console.time("Import Applications");
// Application Object {
const Application = function(name, init, code) {
	this.name = name || "Unknown";
	if (typeof init !== "function") {
		console.error("Application '" + this.name +
			"' has invalid initialization code.");
		return;
	}
	if (typeof code !== "function") {
		console.error("Application '" + this.name + "' has invalid draw code.");
		return;
	}
	this.init = function() {
		pushMatrix();
		pushStyle();
		init();
		popStyle();
		popMatrix();
		this.initialized = true;
	};
	this.draw = function() {
		if (!this.initialized) {
			console.warn("Attempted to draw Application '" + this.name +
				"' before initialization.");
			this.init();
		}
		pushMatrix();
		pushStyle();
		code();
		popStyle();
		popMatrix();
	};
};
// }
// Applications {
const testApplication = new Application("Test", function() {
    this.image = system.images[0];
}, function() {
    fill(WHITE);
    colorMode(HSB);
    background(map(sin(frameCount), -1, 1, 0, 255), map(sin(frameCount), -1, 1, 0, 255), 255);
    this.image.draw(0, 0);
    textAlign(CENTER, CENTER);
    textSize(50);
    outlineText("Test App", width / 2, height / 2);
});
var applications = [testApplication];
// }
// Exporting {
let export_module;
if (export_module) {
	console.log("Importing applications object...")
	export_module(applications);
	console.timeEnd("Import Applications");
} else {
    background(255);
    fill(0);
    textAlign(CENTER);
    textFont(createFont("monospace"), 15);
    text(NAME + "\nVersion " + VERSION, width / 2, height / 2);
}
// }
