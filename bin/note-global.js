#!/usr/bin/env node

const handler = require('../lib/index.js')

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
	}

	title = process.argv[3]
	note = process.argv[4]

	handler.handleRequest(mode, title, note)
}