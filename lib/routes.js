Router.configure({
    layoutTemplate: 'layout'
});
Router.route('/', {name: 'commonFundsList'});
Router.route('/new', {name: 'newCommonFund'});

Router.route('/common_fund/:_id', {
    name: 'commonFundPage',
    data: function() {
        return CommonFundCollection.findOne(this.params._id);
    }
});