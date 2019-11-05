const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const unirest = require("unirest");
var p1;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.channel.send("bot running");

});

client.on('message', input => {
	if (input.toString().includes("new person") && input.author.bot === false) {
		var str = input.toString().split(" ");
		p1 = new Person(str[2], str[3]);
		input.channel.send("new person " + p1.name + " " + p1.sex);

	} else if (input.toString().includes("new food") && input.author.bot === false) {
		let food = input.toString().slice(8);
		let req = unirest("GET", `https://nutritionix-api.p.rapidapi.com/v1_1/search/${food}`);

		req.headers({
			"x-rapidapi-host": "nutritionix-api.p.rapidapi.com",
			"x-rapidapi-key": "0c34e27658mshee48dec47a403f8p1b8092jsnb9337256d552"
		});

		req.query({
			"fields": "item_name,item_id,brand_name,nf_calories,nf_total_fat"
		});

		req.end(function (res) {
		if (res.error) throw new Error(res.error);
		
		let content = JSON.stringify(res.body);
		let read = JSON.parse(content);
		console.log(read.hits[0].fields);		

		input.channel.send(read.hits[0].fields.item_name);
		input.channel.send("calories: " + read.hits[0].fields.nf_calories);
		p1.addCal(parseInt(read.hits[0].fields.nf_calories));

		input.channel.send("total fat: " + read.hits[0].fields.nf_total_fat);
		p1.addFat(parseInt(read.hits[0].fields.nf_total_fat));
		});

	} else if (input.toString().includes("get totals") && input.author.bot === false) {
		input.channel.send(p1.getCal());
		input.channel.send(p1.getFat());
	}
});

function Person(name, sex) {
	this.name = name;
	this.sex = sex;
	this.totalFat = 0.0;
	this.totalCal = 0.0;
}

Person.prototype.getCal = function() {
	return this.totalCal;
}

Person.prototype.getFat = function() {
	return this.totalFat;
}

Person.prototype.addCal = function(cals) {
	this.totalCal += cals;
}

Person.prototype.addFat = function(fats) {
	this.totalFat += fats;
}

Person.prototype.reset = function() {
	this.totalFat = 0;
	this.totalCal = 0
}
/**
//money function
client.on('message', input => {
	var newInput = input.toString().split("\n");
	for (let str of newInput) {							
		input.channel.send(str.substring(str.indexOf("(") + 1, str.indexOf(")")));				
	}
});
*/

client.login(auth.token);