import { ServerGlobals } from "../common/ServerGloabls";
import { DBMail } from "./DBMailDef";
import { DBUser } from "./DBUserDef";
import { KVDB_Mail } from "./kvdb/KVDBMail";
import { KVDB_User } from "./kvdb/KVDBUser";
import { MongoDBMail } from "./mongodb/MongoDBMail";
import { MongoDBUser } from "./mongodb/MongoDBUser";

export let dbUser!:DBUser;
export let dbMail!:DBMail;
export function dbInitialize(){
    console.log('/////dbInitialize//////');
    dbUser = ServerGlobals.dbType=='mongodb'? new MongoDBUser() : new KVDB_User();
    dbMail = ServerGlobals.dbType=='mongodb'? new MongoDBMail() : new KVDB_Mail();
    console.log(dbUser,dbMail);
}