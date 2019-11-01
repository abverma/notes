// ./lib/index.js

const fs = require('fs'),
	  path = require('path'),
	  message = process.argv[2],
	  notesFolder = '../notes',
	  syncFolder = '/Users/abhishek/Documents/cloud/notes',
	  { exec } = require('child_process'),
	  folderpath = path.join(__dirname, notesFolder)



exports.handleRequest = (mode, title, note) => {
	let files = fs.readdirSync(path.join(__dirname, notesFolder)),
		syncedfiles = fs.readdirSync(syncFolder),
		filepath = path.join(__dirname, notesFolder, title + '.txt'),
		count = 0

	try {
		switch(mode) {
			case 'new':
				contents = fs.readFileSync(filepath, 'utf-8')

				if (contents) {
					contents += '\n' + note
					fs.writeFileSync(filepath, contents, 'utf-8')
				} else {
					fs.writeFileSync(filepath, note, 'utf-8')
				}
			
				console.log('Note created')
				break

			case 'append': 
				contents = fs.readFileSync(filepath, 'utf-8')
				contents += '\n' + note
				fs.writeFileSync(filepath, contents, 'utf-8')
				console.log('Note updated')
				break

			case 'list': 

				if (files.length) {
					files.forEach((file) => {
						console.log(++count + '. ' + file)
					})
				} else {
					console.log('There are no notes')
				}
				break

			case 'search': 

				if (files.length) {
					files.forEach((file) => {
						if (file.includes(title)) {
							console.log(++count + '. ' + file)
						}
					})
				} else {
					console.log('There are no notes')
				}
				break

			case 'edit': 
				exec('subl ' + filepath, (err, stdout, stderr) => {
				  if (err) {
				  	console.log(err)
				    return
				  }
				})
				break

			case 'sync': 
				exec('cp ' + filepath + ' ' + syncFolder, (err, stdout, stderr) => {
				  if (err) {
				  	console.log(err)
				    return
				  }
				})
				console.log('Note synced')
				break

			case 'syncall': 
				exec('cp ' + folderpath + '/*.* ' + syncFolder, (err, stdout, stderr) => {
				  if (err) {
				  	console.log(err)
				    return
				  }
				})
				console.log('All notes synced')
				break

			default: console.log('Unidentified command')
		}
	}
	catch(err) {
		if (mode == 'new' && err.code == 'ENOENT') {
			fs.writeFileSync(filepath, note, 'utf-8')
			console.log('Note creted')
		} else {
			console.log(err.code)
		}
	}
}