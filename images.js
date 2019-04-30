// jshint ignore: start

console.time("Import Images");

const Image = function(name, code) {
    this.name = name || "Unknown";
    if(typeof code !== "function") {
        console.error("Image '" + this.name + "' has invalid draw code.");
        return;
    }
    this.load = function() {
        background(0, 0);
        pushMatrix();
        pushStyle();
        code();
        popStyle();
        popMatrix();
        this.image = get();
        this.loaded = true;
    };
    this.draw = function(x, y) {
        if(!this.loaded) {
            console.warn("Attempted to draw image '" + this.name + "' before initialization.");
            this.load();
        }
        image(this.image, x, y);
    };
};

const testImage = new Image("Test", function() {
    fill(0, 111, 222);
    rect(0, 0, 100, 100, 15);
});

var images = [testImage];

let export_module;
if(export_module) {
    console.log("Importing images object...")
    export_module(images);
    console.timeEnd("Import Images");
}
