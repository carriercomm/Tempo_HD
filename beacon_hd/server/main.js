Meteor.startup(function(){
	//console.log('Before start up:\n');
	//console.log(StoreStatus.find().fetch());
	if(StoreStatus.find().fetch().length > 0){
		StoreStatus.remove({});
	}

	if(StoreStatus.find().fetch().length == 0){
		var test_data = JSON.parse(Assets.getText('testData.json'));
		var len = test_data.length, i = 0;
		for(i;i<len;i++){
			//console.log(test_data[i]);
			test_data[i].metrics = {"info1": "-54.333","info2": "-55.333","info3": "-56.333","info4": "-57.333","info5": "-54.333","info6": "-55.333","info7": "-56.333","info8": "-57.333","info9": "-54.333","info10": "-55.333","info11": "-56.333","info12": "-57.333","info13": "-54.333","info14": "-55.333","info15": "-56.333","info16": "-57.333"};
			StoreStatus.insert(test_data[i]);
		}
	}
	
	console.log('After start up:\n');
	console.log(StoreStatus.find().fetch().length);
	//console.log(StoreStatus);
});

Meteor.publish('store_status', function(){
	var status = StoreStatus.find();
	console.log('Publishing ' + status.fetch().length + ' documents.');
	return status;
});