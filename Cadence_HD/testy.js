/**
 * Created by JXP1195 on 7/2/2015.
 */

asyncTest(callbackTest);
console.log('not done');



function asyncTest(cbt){
    setTimeout(function(){cbt('done')},1500);

}

function callbackTest(output){
    console.log(output);
}