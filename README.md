# Network-path-test
### To check whether a signal can travel between two devices in a given amount of time or less.

Built with love, using:

[Node.js](https://nodejs.org/en/)

[MySQL](https://www.mysql.com/)

[Commander.js](https://www.npmjs.com/package/commander)

[CSV](https://www.npmjs.com/package/csv)

[csv-parse](https://www.npmjs.com/package/csv-parse)

### Requirements

[Node.js](https://nodejs.org/en/)

[MySQL 8.0](https://www.mysql.com/)

### Set Up Local Development Environment (Windows)

 1. Download and install [XAMPP](https://www.apachefriends.org/).
 2. Start Appache and MySQL from XAMPP control panel.
 3. Download or clone this repository.
 4. Create databse 'network_test'
```
CREATE DATABASE network_test;

```
  5.Create table
```
CREATE TABLE IF NOT EXISTS paths (path_id int NOT NULL AUTO_INCREMENT,source char(50),destination char(50),signal_time int,PRIMARY KEY (path_id));

```
  6. Clone this repository or download
  7. open command prompt inside the downloaded folder
  8. Install dependencies type 
  ```
  npm install
  ```
  10. Open config.js and enter your host and database details
  11. To run the project type
  ```
  node app
  ```
  
