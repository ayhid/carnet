Template.newCommonFund.helpers({
    members: function () {
        return Meteor.users.find().map(function (u) {
            return {
                label: u.profile.first_name +' '+u.profile.last_name ,
                value: u._id
            };
        });
    }
});
