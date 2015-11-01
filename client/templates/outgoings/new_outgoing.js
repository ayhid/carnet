Template.newOutgoing.events({
    'submit form': function(e) {
        e.preventDefault();
        var outgoing = {
            name: $(e.target).find('[name=name]').val()
        };
        console.log(outgoing);
        outgoing._id = Outgoings.insert(outgoing);
        Router.go('outgoingsList');
    }
});