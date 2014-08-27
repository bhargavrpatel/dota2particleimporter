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
	$(".notice").css("display", "block");
	$("#fill").append("<div>Addon Name: "+localStorage["addon_name"]+"</div>");
	$("#fill").append("<div>UGC Path: "+localStorage["ugc_path"]+"</div>");
	$("#fill").append("<div>Content Path:"+localStorage["content_path"]+"</div>");
}

	
// Checks if Github repo has new/edited particles.
// Updates master database accordingly.
// Returns: 0 if master db is up to date.
//			1 if master db was updated
function checkUpdate() {
	var request = require('request')
	  , JSONStream = require('JSONStream')
	  , es = require('event-stream')

	  
	// Check if data on github json has been updated
	var req = request({url: 'https://raw.githubusercontent.com/bhargavrpatel/dota2particleimporter/master/particles.json'})
	req.pipe(JSONStream.parse('lastscan')).on('data', function (obj) { 
		console.log(obj);
		if(localStorage["lastscan_github"] == obj || (typeof localStorage["lastscan_github"] === "undefined")) {
			req.destroy();
			return 0;
		} else {
			localStorage["lastscan_github"] = obj
			var gui = require('nw.gui');
			var update_popup = gui.Window.get(
			  window.open('pages/update.html')
			);

			update_popup.resizeTo(550,180)
			return 1;
		}
	}) 
}



function fetchParticle(relPath) {
	var fs = require('fs');
	var master = fs.readFileSync('particles-cache/master.json', "utf8");
	var slave = fs.readFileSync("particles-cache/slave.json", "utf8");
	
	var pSlave = JSON.parse(slave)
	var pMaster = JSON.parse(master)

	// TODO: Detect particles, wrap the code below in a for loop.
		if( validParticle(relPath, pSlave, pMaster) >= 1 )
			downloadParticleFromSrc(relPath, pSlave, pMaster); 		// Download particle into folder

}



// Checks if particle is Valid
// Returns: -1 if particle is invalid (is not in master.json)
// 	  		 0 if particle is present and up-to-date.
// 	  		 1 if particle is needs to be re-downloaded and updated in slave.json
// 	  		 2 if particle is needs to be downloaded and added to slave.json 
function validParticle(relPath, pSlave, pMaster) {
	pSlave = pSlave || [];
	pMaster = pMaster || [];
	var found = false;
	var updateDate = '1993';
	for (var i = pMaster.particle.length - 1; i >= 0; i--) {
		if (pMaster.particle[i].relPath == relPath) {			// Valid particle relative path was provided
			updateDate = pMaster.particle[i].updatedOn;
			for (var j = pSlave.particle.length - 1; j >= 0; j--) {
				if(pMaster.particle[i].relPath == pSlave.particle[j].relPath) 
					if(pMaster.particle[i].updatedOn == pSlave.particle[j].updatedOn) { 			// Exists and Upto Date
						return 0;
					} else {
						modifySlave(pSlave, relPath, updateDate, false)
						return 1;
					}
					found = true;
					break;
			};
			break;
		}
	};
	
	if( found == false ) {
		modifySlave(pSlave, relPath, updateDate, true)
		return 2;
	}
	return -1;  // Invalid fparticle	
}

// Downloads particles and stores in the correct directory structure within particles-cache folder
// Returns: void
function downloadParticleFromSrc(relPath, pSlave, pMaster) {
	var fs = require("fs");
	var Download = require('download');
	var progress = require('download-status');


	var splittedPaths = relPath.split("/");
	var folderPaths = "";
	for (var i = 0; i <= splittedPaths.length - 2; ++i) {
		var folderPaths = folderPaths+"/"+splittedPaths[i];
	};
	folderPaths = folderPaths.replace("/", "particles-cache/")


	var download = new Download()
 		 .get("http://toraxxx.d2modd.in/"+relPath, folderPaths.replace(/\//g, "\\"))
 		 .use(progress());
	download.run(function (err, files) {
	    if (err) throw err;
	    alert("File (re)Download successful");
	});
}


// Adds particle as a new entry in slave.json
function modifySlave(pSlave, relativePath, updateDate, isNew) {
	fs = require("fs");
	if (isNew)
		pSlave.particle.push({
			relPath:relativePath,
			updatedOn:updateDate
		});
	else
		for (var i = 0; i < pSlave.particle.length; i++) {
			if (pSlave.particle[i].relPath == relativePath) {
				pSlave.particle[i].updatedOn = updateDate;
				break;
			}
		}

	var data = JSON.stringify(pSlave);
	fs.writeFileSync("particles-cache/slave.json", data);
}

