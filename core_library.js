// jshint ignore: start

// jQuery
const $ = (function() {
    return this.$;
})();
// underscore.js
const _ = (function() {
    return this._;
})();
String.prototype.toTitleCase = function(str) {
    return this.replace(/\w\S*/g, function(word) {
		// For every word, set the beginning letter to upper case and the rest to lower case
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
};
const console = (function() {
	return this.console;
})();

var exports = [$, _, String.prototype.toTitleCase, console]

var importer_context, export_module;
if(importer_context && export_module) {
    for(var i in exports) {
        importer_context.i = exports[i];
    }
    export_module();
}
