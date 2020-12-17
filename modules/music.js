import sqlite from 'sqlite-async'
class Music {

	constructor(dbName) {
		return (async() => {
			this.db = await sqlite.open(dbName)
			await this.db
			return this
		})()
	}

	async getMusic() {
		const sql = 'SELECT * FROM music'
 		const data = await this.db.all(sql)
		if (data === null || undefined) {
			throw new Error('Database could not retrieve data')
		}
		return data


	}
	
	
	async putMusic(autor,title) {
	
	
	const sql = 'INSERT INTO music, ?autor,title'
	db.execute(sql)
	
	
	
}

	async close() {
		await this.db.close()
	}
}

export default Music