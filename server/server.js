Meteor.publish('country_status', function(){
	return Countries.find();
})

Meteor.startup(function(){
	Countries.insert({cid: "MEX", status: "RED"});
	Countries.insert({cid: "CAN", status: "YELLOW"});
	Countries.insert({cid: "USA", status: "ORANGE"});
	Countries.insert({cid: "PRI", status: "GREEN"});
})