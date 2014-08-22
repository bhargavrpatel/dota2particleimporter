// Error Message: -1    (int)
// Success Message: 1   (int)
// Failure Message: 0   (int)

var fs = require("fs")
filename = "downloaded.json"

function readJSON(filename) {
	if (isUndef(filename)) return -1;
	var json = fs.readFileSync(filename);	
	var content = JSON.parse(json);
	
	for (var i = content.particle.length -1; i >= 0; i--) {
		console.log("particles/"+content.particle[i].relPath)
		console.log(content.particle[i].updatedOn)
	};
	return 1;
}


function pushJSON(filename, pushContent) {
	if (isUndef(filename) || isUndef(pushContent)) return -1;
	var json = fs.readFileSync(filename);	
	var content = JSON.parse(json);
	content.particle.push(pushContent);
	//content.particle.push({"relPath":"base_attacks/fountain_attack_a.vpcf", "updatedOn":"2014-08-20"});	
	content =  JSON.stringify( content );
	fs.writeFileSync(filename, content);
	return 1;
}


function relPathExists(filename, rel) {
	if (isUndef(filename) || isUndef(rel)) return -1;
	var json = fs.readFileSync(filename);	
	var content = JSON.parse(json);
	
	for (var i = content.particle.length -1; i >= 0; i--){
		if (content.particle[i].relPath == rel) return true;
	}
	return false;
}


function findDateByRelPath(filename, rel) {
	if (isUndef(filename) || isUndef(rel)) return -1;
	var json = fs.readFileSync(filename);	
	var content = JSON.parse(json);
	
	for (var i = content.particle.length -1; i >= 0; i--){
		if (content.particle[i].relPath == rel) return content.particle[i].updatedOn;
	}
	return 0;
}


function  isUndef(variable){
	return typeof variable === 'undefined' ? true : false;
}