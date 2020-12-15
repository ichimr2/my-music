
/* main.js */

window.addEventListener('DOMContentLoaded', event => {
	console.log('DOMContentLoaded')
	const delay = 2000
	document.querySelector('aside').hidden = false
	window.setTimeout( () => {
		document.querySelector('aside').hidden = true
	}, delay)
})
