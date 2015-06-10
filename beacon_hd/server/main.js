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