/**
 * Created by JXP1195 on 6/28/2015.
 */
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    testData = require('./testData');

var url = 'mongodb://127.0.0.1:3001/meteor';

var com = process.argv.slice(2);

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
                test_all(db,c);
                break;
            case 'help':
            default:
                console.log(
                    'Available commands:\n' +
                    'Default (no args): Rebuilds collection from testData.json\n\n' +
                    '"test_store [test_iters] [store_num]"\n\t' +
                    'Tests store 3703 or [store_num] 4 or [test_iters] times\n\n' +
                    '"test_all [test_iters] [amt_tested]"\n\t' +
                    'Tests random or [amt_tested] number of stores 4 or [test_iters] times\n\n' +
                'Enter 0 to use default for [test_iters]\n\n');

                console.log('Disconnecting...');
                db.close();
        }
    }
});

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
            d[i].metrics = {
                'cpu_%' : (Math.random() * 100).toFixed(2),
                'mem_%' : (Math.random() * 100).toFixed(2),
                'network' : (Math.random() * 1000).toFixed(2),
                'critical_errors' : Math.floor(Math.random() * 10),
                'warnings' : Math.floor(Math.random() * 10),
                'open_incidents' : Math.floor(Math.random() * 10),
                'incidents_last24' : Math.floor(Math.random() * 10)
            };
            batch.insert(d[i]);
        }

        batch.execute(function(err,r){

            assert.equal(err,null);

            console.log('Documents inserted: ' + r.nInserted);

            c.find().count(function(err,count){

                assert.equal(err,null);

                console.log('Documents in collection "' + c.s.name + '": ' + count);

                db.close();

            });
        });
    });
};

var test_store = function(db, c){

    var num = '3703',
        iters = 1,
        i = 0;
    var intArg = Number(com[1]);
    if(intArg){
        iters = com[1];
    }
    if(com[2]){
        num = com[2];
    }


        c.findOne({num:num}, function(err, doc) {

            console.log(doc);
            for(i; i < iters; i++){

                var stop = new Date().getTime();
                while(new Date().getTime() < stop + 1500){
                    ;
                }

                doc.status === 'GREEN' ? doc.status = 'RED' : doc.status = 'GREEN';
                doc.metrics = {
                    'cpu_%': (Math.random() * 100).toFixed(2),
                    'mem_%': (Math.random() * 100).toFixed(2),
                    'network': (Math.random() * 1000).toFixed(2),
                    'critical_errors': Math.floor(Math.random() * 10),
                    'warnings': Math.floor(Math.random() * 10),
                    'open_incidents': Math.floor(Math.random() * 10),
                    'incidents_last24': Math.floor(Math.random() * 10)
                };
                console.log(doc);
                c.updateOne({'num': num}, {$set: doc});
                stop = new Date().getTime();
                while(new Date().getTime() < stop + 1500){
                    ;
                }
            }
            console.log('Disconnecting...');
            db.close();
        });



};

var test_all = function(db,c){
    ;
};
