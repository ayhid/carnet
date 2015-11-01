Router.configure({
    layoutTemplate: 'layout'
});
Router.route('/', {name: 'outgoingsList'});
Router.route('/new', {name: 'newOutgoing'});