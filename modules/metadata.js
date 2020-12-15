
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

	async all() {
		const sql = 'SELECT users.user, trackinfo.* FROM trackinfo, users\
						WHERE trackinfo.userid = users.id;'
		const metadata = await this.db.all(sql)
		return metadata
	}
	
	
	
	async close() {
		await this.db.close()
	}
}

export default Metadata