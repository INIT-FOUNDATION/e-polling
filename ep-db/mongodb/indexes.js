db.events.createIndex({ eventId: 1 });
db.judges.createIndex({ judgeId: 1 });
db.nominations.createIndex({ nomineeId: 1 });
db.votes.createIndex({ voteId: 1 });
db.supportRequests.createIndex({ supportRequestId: 1 });
db.notifications.createIndex({ notificationId: 1 });