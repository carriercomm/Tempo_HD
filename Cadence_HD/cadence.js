/**
 * Created by JXP1195 on 6/28/2015.
 */
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    testData = require('./testData');

var url = 'mongodb://127.0.0.1:3001/meteor';

var com = process.argv.slice(2);

var intArg1 = Number(com[1]);
var intArg2 = Number(com[2]) || '';


MongoClient.connect(url, function(err,db){

    assert.equal(null,err);

    console.log('Connected\n\n');

    var c = db.collection('store_status');

    if (com.length === 0){
        rebuildCollection(db,c,testData);
    }else{
        switch (com[0]) {
            case 'test_store':
                test_store(db,c);
                break;
            case 'test_all':
                test_all(db,c,closeOut);
                break;
            case 'help':
            default:
                console.log(
                    'Available commands:\n' +
                    'Default (no args): Rebuilds collection from testData.json\n\n' +
                    '"test_store [test_iters:int] [store_num:int]"\n\t' +
                    'Tests store 3703 or [store_num] 1 or [test_iters] times\n\n' +
                    '"test_all [test_iters:int] [amt_tested:int]"\n\t' +
                    'Tests random or [amt_tested] number of stores 1 or [test_iters] times\n\n' +
                'Enter 0 to use default for [test_iters]\n\n');

                console.log('Disconnecting...');
                db.close();
        }
    }
});
var closeOut = function(db){
    if(!db){
        console.log("Oops!");
    }
    console.log('\nDisconnecting...');
    db.close();
}

var rebuildCollection = function(db, c, d){

    console.log('Rebuilding collection "' + c.s.name + '"');

    c.deleteMany({},function(err, r){

        assert.equal(err,null);

        console.log('Documents deleted: ' + r.deletedCount);

        console.log('Inserting documents into collection "' + c.s.name + '"');

        var batch = c.initializeOrderedBulkOp();
        var len = d.length,
            i = 0;

        for(i; i < len; i++){

            //TODO: functionalize this for reuse in different commands
            d[i].metrics = [
                {'name': 'cpu', 'value': (Math.random() * 100).toFixed(2)},
                {'name': 'mem', 'value': (Math.random() * 100).toFixed(2)},
                {'name': 'network', 'value': (Math.random() * 100).toFixed(2)},
                {'name': 'critical_errors', 'value': (Math.random() * 100).toFixed(2)},
                {'name': 'warnings', 'value': (Math.random() * 100).toFixed(2)},
                {'name': 'open_incidents', 'value': (Math.random() * 100).toFixed(2)},
                {'name': 'incidents_last24', 'value': (Math.random() * 100).toFixed(2)}
            ];
            batch.insert(d[i]);
        }

        batch.execute(function(err,r){

            assert.equal(err,null);

            console.log('Documents inserted: ' + r.nInserted);

            c.find().count(function(err,count){

                assert.equal(err,null);

                console.log('Documents in collection "' + c.s.name + '": ' + count);

                console.log('\nDisconnecting...');
                db.close();

            });
        });
    });
};

// Modifies data for a single store based on parameters passed via the command line
// Command line syntax: node cadence.js test_store [test_iters:int] [store_num:int]
// test_iters = number of test iterations to run; store_num = specific store to test
// Command defaults to 1 iteration on store 3703
var test_store = function(db, c){

    var test_iters = intArg1 || 1,
        store_num = String(intArg2) || '3703';

    console.log('Updating store ' + store_num + '...');

    c.findOne({'num':store_num}, function(err, doc) {


        for(var i = 0; i < test_iters; i++){

            console.log('\nRunning test iteration ' + (i + 1) + ' of ' + test_iters + '...');

            console.log('\nCurrent Status:');
            console.log(doc);

            var stop = new Date().getTime();
            while(new Date().getTime() < stop + 1500){
                ;
            }

            doc.status === 'GREEN' ? doc.status = 'RED' : doc.status = 'GREEN';
            doc.metrics = [
                {'name': 'cpu', 'value': (Math.random() * 100).toFixed(2)},
                {'name': 'mem', 'value': (Math.random() * 100).toFixed(2)},
                {'name': 'network', 'value': (Math.random() * 100).toFixed(2)},
                {'name': 'critical_errors', 'value': (Math.random() * 100).toFixed(2)},
                {'name': 'warnings', 'value': (Math.random() * 100).toFixed(2)},
                {'name': 'open_incidents', 'value': (Math.random() * 100).toFixed(2)},
                {'name': 'incidents_last24', 'value': (Math.random() * 100).toFixed(2)}
            ];

            console.log('\nUpdated Status:');
            console.log(doc);

            c.updateOne({'num': store_num}, {$set: doc});

            stop = new Date().getTime();
            while(new Date().getTime() < stop + 1500){
                ;
            }
        }
        console.log('\nDisconnecting...');
        db.close();
    });



};

// Modifies data for a given numbers stores based on parameters passed via the command line
// Command line syntax: node cadence.js test_all [test_iters:int] [amt_tested:int]
// test_iters = number of test iterations to run; amt_tested = amount of stores to be tested
// Command defaults to 1 iteration on 20-70 stores
var test_all = function(db,c,cb){

    var test_iters = intArg1 || 1;
    var iters_run = 0;

    c.find().toArray(function(err,docs){

        for(var i = 0; i < test_iters; i++){

            console.log('Running test iteration ' + (i+1) + ' of ' + test_iters + '...');

            var amt_tested = intArg2 || Math.floor(Math.random() * 50) + 20;

            var batch_update = c.initializeUnorderedBulkOp();

           /* var stop1 = new Date().getTime();
            while(new Date().getTime() < stop1 + 1500){
                ;
            }*/

            console.log('Updating ' + amt_tested + ' stores...');

            var stores = docs;

            for (var j = 0; j < amt_tested; ++j) {

                var offset = Math.floor(Math.random() * stores.length - 1);

                var store_to_update = stores[offset];

                store_to_update.status === 'GREEN' ? store_to_update.status = 'RED' : store_to_update.status = 'GREEN';
                store_to_update.metrics = [
	                {'name': 'cpu', 'value': (Math.random() * 100).toFixed(2)},
	                {'name': 'mem', 'value': (Math.random() * 100).toFixed(2)},
	                {'name': 'network', 'value': (Math.random() * 100).toFixed(2)},
	                {'name': 'critical_errors', 'value': (Math.random() * 100).toFixed(2)},
	                {'name': 'warnings', 'value': (Math.random() * 100).toFixed(2)},
	                {'name': 'open_incidents', 'value': (Math.random() * 100).toFixed(2)},
	                {'name': 'incidents_last24', 'value': (Math.random() * 100).toFixed(2)}
	            ];

                batch_update.find({'num':store_to_update.num}).updateOne({$set: store_to_update});

                stores.splice(offset,1);

            }
            batch_update.execute(function(err,r) {

                assert.equal(err, null);

                iters_run++;
                console.log(r.nModified + ' stores updated.');

                var stop2 = new Date().getTime();
                while(new Date().getTime() < stop2 + 3000){
                    ;
                }

                if(iters_run === test_iters){
                    cb(db);
                }
            });
        }
    });
};
