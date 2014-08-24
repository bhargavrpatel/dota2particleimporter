function chooseFile(name) {
	var fs = require("fs");
	var chooser = $(name);
	chooser.change(function(evt) {
	console.log($(this).val());

	var dirPath = $(this).val().replace(/\\/g, '/');
	
	var ugc_path = dirPath.substring(0, dirPath.indexOf("dota_ugc/") + "dota_ugc/".length);
	var addon_name = dirPath.substring(dirPath.indexOf("dota_addons/") + "dota_addons/".length, dirPath.indexOf("/addoninfo.txt"))

	if(!fs.existsSync(ugc_path) || !(fs.existsSync(ugc_path+"/content/dota_addons/"+addon_name))) {
		alert("Invalid folder, is this inside dota_ugc? All target addons are to be inside dota_ugc folder. Redo please!");
	} else {
		alert("Set successfully");
		localStorage["ugc_path"] = ugc_path
		localStorage["addon_name"] = addon_name
		localStorage["content_path"] = ugc_path+"/content/dota_addons/"+addon_name
		$("#ugcNotSetNotice").remove();

		postUGCSet();
	}
	
});
	chooser.trigger('click');  
}

function postUGCSet() {
	$(".notice").remove();
	$(document).change()
}

function firstTime() {
	localStorage["first_time"] = true; // Flag variable, set to true.
	// Create Database.
	var Datastore = require('nedb')
		, path = require('path')
		, db = new Datastore({ filename: path.join(require('nw.gui').App.dataPath, 'particles.db'), autoload: true });
	insertTestData(db);
}

function insertTestData(db) {
	var document = { hello: 'world'
               , n: 5
               , today: new Date()
               , nedbIsAwesome: true
               , notthere: null
               , notToBeSaved: undefined  // Will not be saved
               , fruits: [ 'apple', 'orange', 'pear' ]
               , infos: { name: 'nedb' }
               };

	db.insert(document, function (err, newDoc) {   // Callback is optional
	  // newDoc is the newly inserted document, including its _id
	  // newDoc has no key called notToBeSaved since its value was undefined
	});
	alert("Shit was added");
}