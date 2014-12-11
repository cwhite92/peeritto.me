// Gibber as in gibberish... get it? hahahahaha...
// TODO: This is a shitty class, could be cleaned up a lot. Refactor later.
var Gibber = function() {
	this.adjectives = [];
	this.animals = [];
	
	// Load the word lists
	this.loadAdjectives();
	this.loadAnimals();
}

Gibber.prototype.loadAdjectives = function() {
	var fs = require('fs');
	
	// Load the wordlist and split by new line
	this.adjectives = fs.readFileSync(__dirname + '/../data/adjectives.txt', {encoding: 'utf8'}).split(/\n/);
}

Gibber.prototype.loadAnimals = function() {
	var fs = require('fs');

	// Load the wordlist and split by new line
	this.animals = fs.readFileSync(__dirname + '/../data/animals.txt', {encoding: 'utf8'}).split(/\n/);
}

Gibber.prototype.getRandomAdjective = function() {
	var adjective = this.adjectives[Math.floor(Math.random() * this.adjectives.length)];
	
	return adjective.charAt(0).toUpperCase() + adjective.slice(1);
}

Gibber.prototype.getRandomAnimal = function() {
	var animal = this.animals[Math.floor(Math.random() * this.animals.length)];
	
	return animal.charAt(0).toUpperCase() + animal.slice(1);
}

Gibber.prototype.getRandomId = function() {
	return this.getRandomAdjective() + this.getRandomAdjective() + this.getRandomAnimal();
}

module.exports = Gibber;