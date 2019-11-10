#!/usr/bin/env node

const fs = require('fs'),
	  handler = require('../lib/index.js'),
	  readMeFilePath = './README.md'

const printHelp = () => {
	try {
		let contents = fs.readFileSync(readMeFilePath, 'utf-8')
		console.log(contents)
	}
	catch(e) {
		console.log(e)
		console.log('Can not file README.md file.')
	}

}

if (process.argv[2]) {

	switch(process.argv[2]) {
		case '-c': mode = 'new'
			  	   break
		case '-a': mode = 'append'
			  	   break
		case '-l': mode = 'list'
			  	   break
		case '-s': mode = 'search'
			  	   break
		case '-e': mode = 'edit'
			  	   break
		case '-h': printHelp()
				   return 
		case '-r': mode = 'read'
				   break 
		default: console.log('Unidentified options')
				 return
	}

	title = process.argv[3]
	note = process.argv[4]

	handler.handleRequest(mode, title, note)
}

