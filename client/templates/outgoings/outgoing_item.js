var CommonFund = function CommonFund(outgoingItem) {
    this.outgoing = outgoingItem;
}
/**
 *
 * @returns {number}
 */
CommonFund.prototype.totalAmount = function () {
    let sum = 0;
    _.each(this.outgoing.participations, function (participation) {
        sum += participation.amount;
    });
    return sum;
}
/**
 *
 * @returns {Number}
 */
CommonFund.prototype.membersCount = function () {
    return this.outgoing.members.length;
}
/**
 *
 * @returns {Number}
 */
CommonFund.prototype.participantsCount = function () {
    return this.outgoing.participations.length;
}
/**
 *
 * @returns {number}
 */
CommonFund.prototype.regularShare = function () {
    return this.totalAmount() / this.membersCount();
}
/**
 *
 * @returns {Array}
 */
CommonFund.prototype.getMoneylenders = function () {
    let regularShare = this.regularShare();
    let moneylenders = [];
    _.each(this.outgoing.participations, function (participation) {
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
}
/**
 *
 * @returns {Array}
 */
CommonFund.prototype.getLiables = function () {
    let moneylenders = this.getMoneylenders();
    let liables = [];
    let regulatShare = this.regularShare();
    let participations = this.outgoing.participations;

    let liablesIds = _.filter(this.outgoing.members, function (memberId) {
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
}

/**
 *
 * @returns {{liables, moneylenders}}
 */
CommonFund.prototype.dispatchMembers = function () {
    return {
        liables: this.getLiables(),
        moneylenders: this.getMoneylenders()
    };
}
/**
 *
 * @returns {Array}
 */
CommonFund.prototype.calculateRefunds = function () {
    let liables = this.getLiables();
    let moneylenders = this.getMoneylenders();

    let refunds = [];
    _.map(liables, function (liable) {
        if (liable.amount > 0) {
            _.map(moneylenders, function (moneylender) {
                let amount = 0;
                if (moneylender.amount < liable.amount ) {
                    amount = moneylender.amount;
                    liable.amount -= moneylender.amount;
                    moneylender.amount = 0;
                } else{
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

Template.outgoingItem.onCreated(function () {
    this.commonFund = new CommonFund(this.data);
});


Template.outgoingItem.helpers({
    membersCount: function () {
        return Template.instance().commonFund.membersCount();
    },
    participantsCount: function () {
        return Template.instance().commonFund.participantsCount();
    },
    totalAmount: function () {
        return Template.instance().commonFund.totalAmount();
    },
    regularShare: function () {
        return Template.instance().commonFund.regularShare();
    },
    refunds: function () {
        return Template.instance().commonFund.calculateRefunds();
    }
});
