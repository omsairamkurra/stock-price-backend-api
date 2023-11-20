const {MongoClient}=require('mongodb')

const uri="mongodb+srv://root:root@cluster2.lrczczf.mongodb.net/?retryWrites=true&w=majority"

const client=new MongoClient(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

module.exports=client