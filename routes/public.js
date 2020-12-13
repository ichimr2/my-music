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
const router = new Router()
router.use(bodyParser({multipart: true}))


var dbName = 'website.db'

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 */
 router.get('/', async ctx => {
 	try {
// 		console.log("home")
//  		const music = await new Music(dbName)
//  		let data = music.getMusic()
		
//  		ctx.hbs.data = data

 		await ctx.render('login', ctx.hbs)
 	} catch(err) {
		console.log(err)
 		await ctx.render('error', ctx.hbs)
 	}
 })


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
		await account.register(ctx.request.body.user, ctx.request.body.pass, ctx.request.body.email)
		ctx.redirect(`/login?msg=new user "${ctx.request.body.user}" added, you need to log in`)
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	} finally {
		account.close()
	}
})





router.post('/secure', async ctx => {
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
		
			mm.parseFile(`uploads/${myfile.name}`)
  .then( metadata => {
								console.log(metadata['format']['duration'])
								console.log(metadata['common']['title'])
								console.log(metadata['common']['album'])
								console.log(metadata['common']['artists'])

			})
});



router.get('/login', async ctx => {
	console.log(ctx.hbs)
	await ctx.render('login', ctx.hbs)
})





router.post('/login', async ctx => {
	const account = await new Accounts(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
		await account.login(body.user, body.pass)
		ctx.session.authorised = true
		ctx.session.user = body.user
		const referrer = body.referrer || '/secure'
		return ctx.redirect(`${referrer}`)
	} catch(err) {
		ctx.hbs.msg = err.message
		await ctx.render('secure', ctx.hbs)
	} finally {
		account.close()
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/?msg=you are now logged out')
})
export default router