#! /usr/bin/env node


/**
 * mazorca bin for version 1.2.1
 */
/**
 * Este módulo permite la creación rápida de módulos, elementos y componentes ".scss" para la arquitectura de Mazorca.
 * La creación de archivos permite crearlos dentro de un folder anidado en el directorio principal, i.e. "modules/general/", pero ello sólo funciona
 * con folders de primer nivel.
 * El comando se escribe de la siguiente manera "node mazorca-make module:archivo", o "node mazorca-make module@general:archivo"
 */

var fs = require('fs')
var path = require('path')

var make = function(){
	process.argv.forEach(function (val, index, array) {
		if (index < 3)  return
		var mazorca_folders = {
				element: './mazorca/elements/',
				module: './mazorca/modules/',
				component: './mazorca/components/',
			},
			parsedCommand = val.split(':'),
			parsedBaseAndFolder = parsedCommand[0].split('@'),
			directory = mazorca_folders[parsedBaseAndFolder[0]],
			classname = parsedCommand[1],
			filename = '_' + classname,
			subfolder = parsedBaseAndFolder[1] ? parsedBaseAndFolder[1] : '', 
			filepath, 
			template
		//set file, template and subfolder
		if (directory && filename) { 
			//create subfolder if does not exist
			fs.stat(directory+subfolder, function(err, stat) {
				if (subfolder !== '' && !stat ) { 
					fs.mkdirSync('./' + directory + subfolder)
					console.log('Subfolder '+ subfolder + ' has been created.')
				}
			})
			//set file
			filepath = path.format({
				dir: directory + subfolder,
				name: filename,
				ext: '.scss'
			})
			if (parsedBaseAndFolder[0] === 'component') { template = '@mixin ' + classname + '() {}'}
			else if (parsedBaseAndFolder[0] === 'element') { template = '% ' + classname + '{}'}
			else template = '.'+ classname +' {}' 
		}
		else {
			console.log('Comando desconocido: ' + val)
			return
		}
		//make and write file
		fs.stat(directory, function(err, stat) {
			if (err) {console.log('Ha habido un error', err); return}
			if (stat.isDirectory()) {
				fs.stat(filepath, function(err, stats) {
					if(!stats)  {
						fs.writeFile(filepath, template)
						console.log('"'+  filename + '.scss"' + ' ha sido creado en ' + '"'+ directory + subfolder + '"')
					}
					else console.log('"'+ filename + '.scss"' +  ' ya existe en ' + '"'+ directory + subfolder + '"')
				})
			} else console.log('El directorio "' + directory + '" no existe')
		})

	})
}
var ncp = require('ncp').ncp;

var boilerplate = function() {
	ncp('./node_modules/mazorca-core/core/mazorca-boilerplate/', './', function (err) {
	 if (err) {
	   return console.error(err);
	 }
	 console.log('mazorca has been installed!');
	});
}
var mazorca = {
	boilerplate: boilerplate,
	make: make
}

var cmnd = process.argv[2]

if (mazorca[cmnd]) {
	mazorca[cmnd]()
} else {
	console.log('Mazorca command '+ cmnd +' not found')
}