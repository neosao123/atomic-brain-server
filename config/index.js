const dbuser = "neosaoservices";
const dbpassword = "mKYBzcAr3jxXKzZi";

const MONGODB_URI = `mongodb+srv://${dbuser}:${dbpassword}@cluster0.rdzxs.mongodb.net/atomic-db-new?retryWrites=true`;
// mongodb+srv://neosaoservices:mKYBzcAr3jxXKzZi@cluster0.rdzxs.mongodb.net/atomic-db-new?retryWrites=true

//const MONGODB_URI = "mongodb://localhost:27017/atomic-brain-server";

module.exports = MONGODB_URI;
