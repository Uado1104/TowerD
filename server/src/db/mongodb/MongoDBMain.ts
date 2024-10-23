import mongoose from "mongoose"
import { ServerGlobals } from "../../common/ServerGloabls";
/**
 * 数据库连接
 */
class MongoDBMain {
    async start() {
        let dbConfig = ServerGlobals.mongodb;
        let connectionString = `mongodb://${dbConfig.usr}:${dbConfig.pwd}@${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`;
        //mongoose.Promise = require('bluebird');
        let ret = await mongoose.connect(connectionString);//, options
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'mongoose connection error:'));
        db.once('open', function () {
            return console.log('mongoose open success');
        });
    }
}

export const mongodbMain = new MongoDBMain();
