use('cityfix-db');
// db.issues.find({}).toArray()
Db.issues.updateMany({},{
    $set : {
        upvoteBy : []
    }
})