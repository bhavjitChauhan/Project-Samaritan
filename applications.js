// jshint ignore: start

console.time("Import Applications");

const Application = function(name, init, code) {
    this.name = name || "Unknown";
    if(typeof init !== "function") {
        console.error("Application '" + this.name + "' has invalid initialization code.");
        return;
    }
    if(typeof code !== "function") {
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
        if(!this.initialized) {
            console.warn("Attempted to draw Application '" + this.name + "' before initialization.");
            this.init();
        }
        pushMatrix();
        pushStyle();
        code();
        popStyle();
        popMatrix();
    };
};

const testApplication = new Application("Test", function() {
    this.x = 1;
}, function() {
    rect(this.x, 100, 200, 200);
    this.x++;
});

var applications = [testApplication];

let export_module;
if(export_module) {
    console.log("Importing applications object...")
    export_module(applications);
    console.timeEnd("Import Applications");
}
