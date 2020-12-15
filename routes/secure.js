import Router from 'koa-router'
import bodyParser from 'koa-body'
import mime from 'mime-types'
import fs from 'fs-extra'
import Koa from 'koa'
import serve from 'koa-static'
import views from 'koa-views'
import * as mm from 'music-metadata';
import * as util from 'util'
import Accounts from '../modules/accounts.js'
import Music from '../modules/music.js'
import Metadata from '../../5009CEM/modules/metadata.js'
const dbName = 'website.db'
const router = new Router({ prefix: '/secure' })
router.use(bodyParser({multipart: true}))


async function checkAuth(ctx, next) {
	console.log('secure router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	await next()
}

router.use(checkAuth)

router.get('/', async ctx => {
	const metadata = await new Metadata(dbName)
	try {
		console.log('ss')
		const records = await metadata.all()
		console.log(records)
		ctx.hbs.records = records
		await ctx.render('secure', ctx.hbs)
	} catch(err) {
		console.log('AI BELUT PUALFDSAFAS')
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
		console.log('finally')
	}
})

router.get('/upload', async ctx => {
	try {
		console.log('handlebars data')
		console.log(ctx.hbs)
		await ctx.render('uploadform', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})


router.post('/upload', async ctx => {
	try {
		console.log(ctx.session.user)
		var myfile = ctx.request.files.myfile
		myfile.extension = mime.extension(myfile.type)
		if (myfile.type != "audio/mpeg")
			{
			console.log('sss')
			throw new Error('wrong file type');
			}
 
		await fs.copy(myfile.path, `uploads/${myfile.name}`) 	
	}
 
	catch(err) {
 		 await ctx.render('index')
 		 console.log('first catch')
     console.log(err.message)
  }
	return ctx.redirect('/secure?msg=file uploaded')
 
	var musicData = {}
 
	const parsedFile = await mm.parseFile(`uploads/${myfile.name}`)
	 let duration = parsedFile.format['duration']
	 let title = parsedFile.common['title']
	 let album = parsedFile.common['album']
	 let artist = parsedFile.common['artist']
	 musicData.duration = duration
	  musicData.title = title
	 musicData.album = album
	 musicData.artist = artist
	ctx.hbs.data = musicData
	console.log(ctx.hbs)
	await ctx.render('secure', ctx.hbs)
 
 
 
 
 
 
})






export default router
