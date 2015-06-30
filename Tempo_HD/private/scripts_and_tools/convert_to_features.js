var fs = require("fs");
var file = JSON.parse(fs.readFileSync("./sam_data_com_status.json", "utf8"));

//console.info(file);

//CONVERT TO GEOJSON*******************************************
/*
var geoData = {
	type: "FeatureCollection",
	features: [
		type: "Feature",
		properties: {},
		geometry: {
			type: "Point",
			coordinates: []
		}
	]
};

var len = file.length,
	i = 0;

for(i;i<len;i++){
	geoData.features.push(
		{
			type: "Feature",
			properties: {
				num: file[i].num,
				name: file[i].name
			},
			geometry: {
				type: "Point",
				coordinates: [Number(file[i].lng), Number(file[i].lat)]
			}
		}
	);
}
				
	
console.info(geoData.features[123]);

fs.writeFileSync('store_geo_features.json', JSON.stringify(geoData));*/

//CONVERT TO STATUS_DATA File (used for testing purposes)
var testData = [];

var len = file.length,
	i = 0;

for(i;i<len;i++){
	testData.push(
		{
			num: file[i].num,
			status: "GREEN",
			lng: file[i].lng,
			lat: file[i].lat
		}
	);
}

fs.writeFileSync('testData.json', JSON.stringify(testData));


/*"na_places1":{"type":"GeometryCollection","geometries":[{"type":"Point","properties":{"name":"Faribault"},"coordinates":[2392,4378]}

"type": "FeatureCollection",
                                                                                
"features": [
{ "type": "Feature", "properties": { "NAME": "Colonia del Sacramento",  }, "geometry": { "type": "Point", "coordinates": [ -57.840002473401341, -34.47999900541754 ] } },*/