
import Router from 'koa-router'
import mime from 'mime-types'
import fs from 'fs-extra'
import serve from 'koa-static'
import * as mm from 'music-metadata';
import * as util from 'util'
import views from 'koa-views'
const router = new Router({ prefix: '/secure' })

async function checkAuth(ctx, next) {
	console.log('secure router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	await next()
}

router.use(checkAuth)

router.get('/', async ctx => {
	try {
		await ctx.render('secure', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

router.get('/upload', async ctx => {
	try {
 
		await ctx.render('upload', ctx.hbs)
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
			throw new Error('wrong file type');
			}
 
    await fs.copy(myfile.path, `uploads/${myfile.name}`) 	
	}
 
	catch(err) {
 		 await ctx.render('index')
 		 console.log('first catch')
     console.log(err.message)
  }
 
	var musicData = {}
 
	const parsedFile = await mm.parseFile(`uploads/${myfile.name}`)
	 let duration = parsedFile.format['duration']
	 console.log(duration)
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
 
 
 
 
 
 
});

export default router