
import Router from 'koa-router'
import mime from 'mime-types'
import fs from 'fs-extra'
import serve from 'koa-static'
import views from 'koa-views'
const router = new Router()
import * as mm from 'music-metadata';
import * as util from 'util'
import Accounts from '../modules/accounts.js'
const dbName = 'website.db'
import Metadata from '../../5009CEM/modules/metadata.js'


/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 */
router.get('/', async ctx => {
	try {
		if(ctx.hbs.authorised) {
			return ctx.redirect('secure?msg=you are logged in...')
		} else{
			return ctx.redirect('/login?msg=you need to log in...')
		}
	} catch(err) {
		await ctx.render('error', ctx.hbs)
	}
})


router.post('/secure/upload/uploadfile', async ctx => {

	try {
		console.log('fs.copy2')
		var myfile = ctx.request.files.myfile
		myfile.extension = mime.extension(myfile.type)
		console.log('fs.copy3')
		if (myfile.type != "audio/mpeg")
			{
			throw new Error('wrong file type');
			}
	 console.log('fs.copy4')
    await fs.copy(myfile.path, `uploads/${myfile.name}`) 	
	console.log('fs.copy5')
	}
 
	catch(err) {
 		 await ctx.render('index')
 		 console.log('first catch')
     console.log(err.message)
  }
 
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
	let username = ctx.session.user
	let userid = ctx.session.userid
	const metadata = await new Metadata(dbName)
	metadata.addSong(userid,username,title,artist,album,duration)
	
	
	return ctx.redirect('/secure?msg=file uploaded')
});



/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', async ctx => {
	const account = await new Accounts(dbName)
	try {
		// call the functions in the module
		await account.register(ctx.request.body.user, ctx.request.body.pass, ctx.request.body.email)
		ctx.redirect(`/login?msg=new user "${ctx.request.body.user}" added, you need to log in`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	} finally {
		await account.close()
	}
})

router.get('/login', async ctx => {
	console.log(ctx.hbs)
	await ctx.render('login', ctx.hbs)
})

router.post('/login', async ctx => {
	const account = await new Accounts(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
		const id = await account.login(body.user, body.pass)
		ctx.session.authorised = true
		ctx.session.user = body.user
		ctx.session.userid = id
		const referrer = body.referrer || '/secure'
		return ctx.redirect(`${referrer}?msg=you are now logged in...`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		await ctx.render('login', ctx.hbs)
	} finally {
		await account.close()
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	delete ctx.session.user
	delete ctx.session.userid
	ctx.redirect('/?msg=you are now logged out')
})

export default router