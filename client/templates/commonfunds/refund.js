Template.refundItem.helpers({
    source: function(){
        return Meteor.users.findOne(this.source);
    },
    target: function(){
        return Meteor.users.findOne(this.target);
    }
});