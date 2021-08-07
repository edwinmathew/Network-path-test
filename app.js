config = require("./config");
const readline = require("readline");
const fs = require('fs'); 
const csv = require('csv');
const mysql = require("mysql");
const parse = csv.parse;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

db = config.database;
var connection=mysql.createConnection({user:db.user,host:db.host,password:db.password,database:db.database});

//To get csv file name
get_csv_file = function(){
	
	rl.question("Enter csv file path ", function(name) {
		 if (fs.existsSync(name)) {
				read_csv(name);
			}else{
				console.error('Invalid file path');
				get_csv_file();
			}
		
	});
}

get_csv_file();

//To read csv and insert into database

read_csv= function(csv_file_name){
	
let stream = fs.createReadStream(csv_file_name);
let csvData = [];
let csvStream = csv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
	  
    // open the connection
    connection.connect(error => {
      if (error) {
        console.error(error);

      } else {
       let query =
          "INSERT INTO paths (source, destination,signal_time) VALUES ?";
        connection.query(query, [csvData], (error, response) => {
          console.log(error);
        });
		
      }
    });
  });

stream.pipe(csvStream);
}

//On application termination		
		
rl.on("close", function() {
    console.log("\nThank you!");
    process.exit(0);
});