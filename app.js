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

//Databse connection

db = config.database;
var connection=mysql.createConnection({user:db.user,host:db.host,password:db.password,database:db.database,multipleStatements: true});

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
          "TRUNCATE TABLE paths;INSERT INTO paths (source, destination,signal_time) VALUES ?";
        connection.query(query, [csvData], (error, response) => {
			if(error){
				 console.log(error);
			}
			get_user_iput();
        });
		
		
      }
    });
  });

stream.pipe(csvStream);
}

// To get the path from one node to another

getpath = function(start_node,end_node,maximum_time){
	
  return new Promise(function(resolve, reject){
    connection.query(
        "WITH RECURSIVE cte AS(SELECT p.destination,concat(p.source, '=>', p.destination) 	AS path,signal_time,path_id FROM paths p WHERE p.source = '"+start_node+"' UNION ALL SELECT p.destination, concat(c.path, '=>', p.destination) AS path,p.signal_time + c.signal_time,p.path_id+c.path_id FROM cte c JOIN paths p ON p.source = c.destination) SELECT c.path,c.signal_time,c.path_id FROM cte c WHERE c.destination = '"+end_node+"' AND c.signal_time <='"+maximum_time+"' ORDER BY c.path_id LIMIT 1;", 
        function(err, rows){                                                
            if(rows === undefined){
                reject(new Error("Error rows is undefined"));
            }else{
                resolve(rows);
            }
        }
    )}
)}

// To get the reverse path from one node to another

getpath_reverse = function(start_node,end_node,maximum_time){
	
  return new Promise(function(resolve, reject){
    connection.query(
        "WITH RECURSIVE cte AS(SELECT p.destination,concat(p.source, '=>', p.destination) 	AS path,signal_time,path_id FROM paths p WHERE p.source = '"+end_node+"' UNION ALL SELECT p.destination, concat(c.path, '=>', p.destination) AS path,p.signal_time + c.signal_time ,p.path_id+c.path_id FROM cte c JOIN paths p ON p.source = c.destination) SELECT c.path,c.signal_time,c.path_id FROM cte c WHERE c.destination = '"+start_node+"' AND c.signal_time <='"+maximum_time+"' ORDER BY c.path_id LIMIT 1;", 
        function(err, rows){                                                
            if(rows === undefined){
                reject(new Error("Error rows is undefined"));
            }else{
                resolve(rows);
            }
        }
    )}
)}
	
get_user_iput = function(){
		rl.question("", function(name1) {
			if(name1!='QUIT'){
					 var string = name1.split(" ");
					 var start_node =string[0]; 
					 var end_node =string[1]; 
					 var maximum_time =string[2]; 
					  getpath(start_node,end_node,maximum_time)
							.then(function(results){

								if(results.length > 0){
									console.log(results[0].path+"=>"+results[0].signal_time);
								}else{
									getpath_reverse(start_node,end_node,maximum_time).then(function(results){
										if(results.length > 0){
												console.log(results[0].path+"=>"+results[0].signal_time);
										}else{
											console.log("No path found");
										}
									});
								}
							 get_user_iput();
							})
							.catch(function(err){
							  console.log("Promise rejection error: "+err);
							})
			}else{
				
				console.log("\nThank you!");
				process.exit(0);
			}				
				});
}

//On application termination		
		
rl.on("close", function() {
    console.log("\nThank you!");
    process.exit(0);
});
