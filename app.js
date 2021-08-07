const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Enter csv file path ", function(name) {
		console.log(name);
		
	});