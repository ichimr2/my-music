
/** @module Metadata */

import sqlite from 'sqlite-async'


/**
 * Metadata
 * ES6 module that manages the metadata in the system.
 */
class Metadata {
	/**
   * Create an account object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS trackinfo(\
					id INTEGER PRIMARY KEY AUTOINCREMENT,\
					userid INTEGER,\
					username TEXT NOT NULL,\
					trackname TEXT,\
					artistname TEXT,\
					albumart TEXT,\
					duration TEXT,\
					FOREIGN KEY(userid) REFERENCES users(id)\
				);'
			await this.db.run(sql)
			return this
		})()
	}

	async all(userid) {
		
		
		
		const metadata = await this.db.all('SELECT DISTINCT trackinfo.* FROM trackinfo, users\
						WHERE trackinfo.userid = $id', {
							$id : userid
						})
	
	
		return metadata
	}
	
	
	async addSong(userid,username,title,artist,album,duration){
		console.log("inserting into database", title)
		let albumart = 'NA'
		console.log(userid, username,title,artist,album,duration)
// 		let userid = id
// 		let username = userid
// 		let song_title = title
// 		let artist = artist
// 		let duration = dur
		
		
		let soMany = 10;
		console.log(`This is ${soMany} times easier!`);

		
		let sql_statement = `INSERT INTO trackinfo (userid, username, trackname, artistname, duration, albumart)\
						  VALUES(${userid}, '${username}', '${title}', '${artist}', '${duration}', '${albumart}')`;
			console.log(sql_statement)
		await this.db.run(sql_statement)
		
// 		INSERT INTO trackinfo(userid, username, trackname, artistname, duration, albumart)
// 	VALUES(3, "user3", "We Come One", "Faithless", "2m 57s", "77.jpg");

		
		
	}
	
	
	
	
	async close() {
		await this.db.close()
	}
}

export default Metadata