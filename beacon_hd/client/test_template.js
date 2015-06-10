/**
 * Created by JXP1195 on 6/10/2015.
 */
Template.test.events = {
    'click input.test-button' : function(){
        Meteor.call('runTestProgram');
    }
}
