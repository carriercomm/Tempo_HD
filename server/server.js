Meteor.startup(function(){
	//console.log('Before start up:\n');
	//console.log(Countries.find().fetch());
	if(Countries.find().fetch().length > 0){
		Countries.remove({});
	}
	Countries.insert({cid: "MEX", status: "RED"});
	Countries.insert({cid: "CAN", status: "YELLOW"});
	Countries.insert({cid: "USA", status: "ORANGE"});
	Countries.insert({cid: "PRI", status: "GREEN"});
	
	console.log('After start up:\n');
	//console.log(Countries.find().fetch());
	//console.log(Countries);
});

Meteor.publish('country_status', function(){
	return Countries.find();
});