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
	try {
		await ctx.render('secure', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})






export default router
