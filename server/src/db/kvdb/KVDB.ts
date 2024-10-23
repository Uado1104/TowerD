import fs from 'fs';
import crypto from 'crypto';

function key2path(db:string,key:string){
    let dbFile = db + '_' + key + '.json';
    return dbFile;
}

export class KVDB{
    public static initPath(path:string){
        let arr = path.split('/');
        path = arr[0];
        for(let i = 1; i < arr.length; i++){
            path = path + '/' + arr[i];
            if(fs.existsSync(path)){
                continue;
            }
            fs.mkdirSync(path);
        }
    }
    public static read(db:string,key:string){
        try{
            let f = fs.readFileSync(key2path(db,key), { encoding: 'utf-8', flag: 'r' });
            let str = f.toString();
            let dbData = JSON.parse(str);
            return dbData;
        }
        catch(e){
            return null;
        }
    }
    
    public static update(db:string,key:string,data:any){
        fs.writeFileSync(key2path(db,key), JSON.stringify(data),{flag:'w+'});
    }

    public static delete(db:string,key:string){
        let path = key2path(db,key);
        if(fs.existsSync(path)){
            fs.unlinkSync(path);
        }
    }
}