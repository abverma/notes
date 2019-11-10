// ./lib/index.js

const fs = require('fs'),
	  path = require('path'),
	  message = process.argv[2],
	  destFolder = require('../config').destination_folder,
	  notesFolder = path.join(process.env.HOME, destFolder ? destFolder : ''),
	  { exec, spawn } = require('child_process'),
	  folderpath = path.join(__dirname, notesFolder)

const upsertDestinationFolder = (folder) => {
	try {
		fs.readdirSync(folder)
	}
	catch(err) {
		if (err.code == 'ENOENT' && err.syscall == 'scandir') {
			fs.mkdirSync(folder)
			console.log('Notes folder created')
		}
	}
}
exports.handleRequest = (mode, title, note) => {

	let files, filepath, count = 0

	try {

		upsertDestinationFolder(notesFolder)

		files = fs.readdirSync(notesFolder)
		filepath = path.join(notesFolder, title + '.txt')

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
				if (!note) {
					console.log('Error: Empty note')
				}
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

			case 'read': 
				let cat = spawn('cat', [filepath])

				cat.stdout.on('data', (data) => {
					console.log(`${data}`)
				})

				cat.stderr.on('data', (data) => {
					console.log(`stderr: ${data}`)
				})
				break

			default: console.log('Unidentified command')
		}
	}
	catch(err) {
		if (mode == 'new' && err.code == 'ENOENT') {
			fs.writeFileSync(filepath, note, 'utf-8')
			console.log('Note created')
		} else {
			console.log(err)
		}
	}
}