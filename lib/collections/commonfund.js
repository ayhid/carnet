CommonFund = function (doc) {
    _.extend(this, doc);
};

CommonFund.prototype = {
    constructor: CommonFund,

    totalAmount: function () {
        let sum = 0;
        _.each(this.participations, function (participation) {
            sum += participation.amount;
        });
        return sum;
    },
    membersCount: function () {
        return this.members.length;
    },
    participantsCount: function () {
        return this.participations.length;
    },
    regularShare: function () {
        return this.totalAmount() / this.membersCount();
    },
    getMoneylenders: function () {
        let regularShare = this.regularShare();
        let moneylenders = [];
        _.each(this.participations, function (participation) {
            if (participation.amount >= regularShare) {
                moneylenders.push(
                    {
                        memberId: participation.memberId,
                        amount: participation.amount - regularShare
                    }
                );
            }
        });

        return moneylenders;
    },
    getLiables: function () {
        let moneylenders = this.getMoneylenders();
        let liables = [];
        let regulatShare = this.regularShare();
        let participations = this.participations;

        let liablesIds = _.filter(this.members, function (memberId) {
            return !_.find(moneylenders, {memberId: memberId});
        });

        _.map(liablesIds, function (memberId) {
            let result = _.findIndex(participations, {memberId, memberId});
            let amount = regulatShare;
            if (result !== -1) {
                amount = regulatShare - participations[result].amount;
            }

            liables.push({
                memberId: memberId,
                amount: amount
            })
        });

        return liables;
    },
    dispatchMembers: function () {
        return {
            liables: this.getLiables(),
            moneylenders: this.getMoneylenders()
        };
    },
    refunds: function () {
        let liables = this.getLiables();
        let moneylenders = this.getMoneylenders();

        let refunds = [];
        _.map(liables, function (liable) {
            if (liable.amount > 0) {
                _.map(moneylenders, function (moneylender) {
                    let amount = 0;
                    if (moneylender.amount < liable.amount) {
                        amount = moneylender.amount;
                        liable.amount -= moneylender.amount;
                        moneylender.amount = 0;
                    } else {
                        amount = liable.amount
                        moneylender.amount -= liable.amount;
                        liable.amount = 0;
                    }
                    if (amount) {
                        refunds.push(
                            {
                                source: liable.memberId,
                                target: moneylender.memberId,
                                amount: amount
                            }
                        );
                    }

                });
            }
        });
        return refunds;

    }

};


CommonFundCollection = new Mongo.Collection('common_funds', {
    transform: function (doc) {
        return new CommonFund(doc);
    }
});
ParticipationsSchema = new SimpleSchema({
    memberId: {
        type: String,
    },
    amount:{
        type: Number
    }
});
CommonFundCollection.attachSchema(new SimpleSchema({
    name:{
        type: String,
    },
    members:{
        type: [String]
    },
    participations:{
        type: [ParticipationsSchema]
    }
}));

