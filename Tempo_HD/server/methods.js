/**
 * Created by JXP1195 on 6/10/2015.
 */
Meteor.startup(function(){
    Meteor.methods({
        runTestProgram: function(){ /*TODO: create named function for testing process*/
            console.log('Testing...');
            var test_data = JSON.parse(Assets.getText('testData.json'));
            var len = test_data.length, i = 0, flag = true;

            for(i;i<3;i++) {
                var stop = new Date().getTime();
                while(new Date().getTime() < stop + 3000){
                    ;
                }
                var number_to_change = Math.floor((Math.random() * 100));
                console.log('Toggling ' + number_to_change + ' stores.');
                var stores_to_change = [];
                for (var j = 0; j < number_to_change; j++) {
                    var index = Math.floor((Math.random() * len));
                    var current_store = test_data[index];
                    current_store.status == 'GREEN' ? current_store.status = 'RED' : current_store.status = 'GREEN';

                    StoreStatus.update({num : current_store.num},
                        {
                            num : current_store.num,
                            status : current_store.status,
                            lat : current_store.lat,
                            lng : current_store.lng
                        }
                    );
                    stores_to_change.push(current_store);
                }

                stop = new Date().getTime();
                while(new Date().getTime() < stop + 1000){
                    ;
                }
                for (var k = 0; k < number_to_change; k++) {
                    stores_to_change[k].status == 'GREEN' ? stores_to_change[k].status = 'RED' : stores_to_change[k].status = 'GREEN';

                    StoreStatus.update({num : stores_to_change[k].num},
                        {
                            num : stores_to_change[k].num,
                            status : stores_to_change[k].status,
                            lat : stores_to_change[k].lat,
                            lng : stores_to_change[k].lng
                        }
                    );
                }
            }
            console.log('Test Finished.')
        }
    });
});
