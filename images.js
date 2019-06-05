// jshint ignore: start
const NAME = 'Project Samaritan Images Library',
    VERSION = '0.0.2',
    AUTHOR = 'Aliquis';

console.time('Import Images');
// Image Object {
const Image = function(name, code) {
    this.name = name || 'Unknown';
    if (typeof code !== 'function') {
        console.error('Image \'' + this.name + '\' has invalid draw code.');
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
        if (!this.loaded) {
            console.warn('Attempted to draw image \'' + this.name +
                '\' before initialization.');
            this.load();
        }
        image(this.image, x, y);
    };
};
// }
// Images {
const testImage = new Image('Test', function() {
    translate(25, 30);
    noStroke();
    fill(RED);
    quad(0, 0, -25, -15, 0, -30, 25, -15);
    fill(GREEN);
    quad(0, 0, -25, -15, -25, 15, 0, 30);
    fill(BLUE);
    quad(0, 0, 25, -15, 25, 15, 0, 30);
});
var images = [testImage];
// }
// Exporting {
let export_module;
if (export_module) {
    console.log('Importing images object...')
    export_module(images);
    console.timeEnd('Import Images');
} else {
    background(255);
    fill(0);
    textAlign(CENTER);
    textFont(createFont('monospace'), 15);
    text(NAME + '\nVersion ' + VERSION, width / 2, height / 2);
}
// }
