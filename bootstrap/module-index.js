/**
 * Original program by Ben Burrill
 * https://www.khan academy.org/cs/i/4834075599
 */

// jshint ignore: start

const NAME = "Project Samaritan Module Index",
    VERSION = "0.0.1",
    AUTHOR = "Aliquis";

var export_module;
if (export_module) {
    export_module({
        'bootstrap': '5870919682981888',
        'module-index': '5111168422477824',
        'library': '5219990839590912',
        'applications': '6275061522989056',
        'images': '5748624898490368',
    });
} else {
    background(255);
    fill(0);
    textAlign(CENTER);
    textFont(createFont('monospace'), 15);
    text(NAME + '\nVersion ' + VERSION, width / 2, height / 2);
}
