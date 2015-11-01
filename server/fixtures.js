if(Meteor.users.find().count() ===0){
    ayoubId = Accounts.createUser({
        username: 'ayoub',
        email: 'ayoub.hidri@gmail.com',
        password: '123456',
        profile: {
            first_name: 'Ayoub',
            last_name: 'Hidri',
        }
    });


    rimId = Accounts.createUser({
        username: 'rim',
        email: 'rim.zarmdini@gmail.com',
        password: '123456',
        profile: {
            first_name: 'Rim',
            last_name: 'zarmdini',
        }
    });

    johnId = Accounts.createUser({
        username: 'john',
        email: 'john.doe@gmail.com',
        password: '123456',
        profile: {
            first_name: 'John',
            last_name: 'Doe',
        }
    });

    tolkienId = Accounts.createUser({
        username: 'tolkien',
        email: 'john.tolkien@gmail.com',
        password: '123456',
        profile: {
            first_name: 'john',
            last_name: 'tolkien',
        }
    });
}




if (Outgoings.find().count() === 0) {
    Outgoings.insert({
        name: "trip cool",
        members:[
            ayoubId,
            rimId,
            johnId,
            tolkienId
        ],

        participations: [
            {
                memberId: ayoubId,
                amount: 10
            },
            {
                memberId: rimId,
                amount: 30
            },
            {
                memberId:johnId,
                amount: 55
            }
        ]
    });

    Outgoings.insert({
        name: "electricité",
        members:[
            ayoubId,
            rimId,
            johnId,
            tolkienId
        ],
        participations: [
            {
                memberId: ayoubId,
                amount: 80
            },

        ]
    })
}