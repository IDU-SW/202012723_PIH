const fs = require('fs');
const dbConn = require('./connection');
let index = 0;

class LOLCharacter {
    constructor() {
        try {
            this.prepareModel(); //  테이블 준비
        } catch (error) {
            console.error(error);    
        }
    }

    async prepareModel() {
        try {
            const db = await dbConn.getConn();
            const characters = db.collection('LOLCharacters');

            characters.find().toArray((err, docs) => {
                if ( err ) {
                    console.log('== Find ALL, toArray Error ', err);
                    return;
                }
                // 기존 데이터를 모두 삭제한다.
                for (var i = 0 ; i < docs.length; i++) {
                    characters.deleteOne({characterId:docs[i].characterId}, (err, result) => {
                        if ( err ) {
                            console.error('DeleteOne Error ', err);
                            return;
                         }  
                    });
                }
            });

            await this.allDataInsert(characters); //  초기 데이터 넣어주기.
        }
        catch (error) {
            console.log('Characters.sync Error ', error);
        }
    }

    // oneDataInsert함수를 호출하여 json 파일의 모든 데이터를 db에 저장.
    async allDataInsert(characters) {
        const data = fs.readFileSync('./model/data.json');
        const jsonData = JSON.parse(data);
        for (var oneData of jsonData ) {
            await this.oneDataInsert(characters, oneData);
            index++;
        }
        console.log('초기 데이터 입력 성공');
    }

    // 데이터를 하나씩 db에 저장.
    async oneDataInsert(characters, oneData) {
        try {
            await characters.insertOne(oneData, (err, result) => {
                if (err) {
                    console.error('Insert Error', err);
                    return;
                 }
                 return result.ops[0];
            });

            return;
        } catch (error) {
            console.error(error);
        }
    }

    // 목록 불러오기.
    async getCharacterList() {
        const db = await dbConn.getConn();
        const characters = db.collection('LOLCharacters');

        try {
            return await characters.find().toArray();
        } catch(error) {
            console.log('데이터 불러오기 에러', error);
        }
        return;
    }

    // 데이터 추가.
    async addCharacter(name, characteristic, explanation, latelySkin) {
        const db = await dbConn.getConn();
        const characters = db.collection('LOLCharacters');

        const characterId = String(index++);
        const newCharacter = {characterId, name, characteristic, explanation, latelySkin};
        try {
            const returnValue = await this.oneDataInsert(characters, newCharacter);
            return returnValue;
        } catch (error) {
            console.error(error);
        }
    }

    // 캐릭터 상세 데이터 불러오기.
    async getCharacterDetail(id) {
        const db = await dbConn.getConn();
        const characters = db.collection('LOLCharacters');
        try {
            const returnValue = await characters.findOne({characterId:id});
            if(!returnValue)
                console.log('Error! 해당 데이터 없음 id : ' + id);
            return returnValue;
        } catch(error) {
            console.log('데이터 상세 불러오기 에러', error);
        }
        return;
    }

    // 캐릭터 정보를 변경하는 함수.
    async updateCharacter(id, name, characteristic, explanation, latelySkin) {
        const db = await dbConn.getConn();
        const characters = db.collection('LOLCharacters');
        try {
            let character = await this.getCharacterDetail(id); //  기존 상세 데이터를 찾아와서
            // 변경 값을 받아온 데이터만 수정. 그외에 기존 데이터는 유지.
            character.name = !name ? character.name : name;
            character.characteristic = !characteristic ? character.characteristic : characteristic;
            character.explanation = !explanation ? character.explanation : explanation;
            character.latelySkin = !latelySkin ? character.latelySkin : latelySkin;
            
            await characters.updateOne({characterId:id}, { $set: {name : character.name,
                                                                characteristic : character.characteristic,
                                                                explanation : character.explanation,
                                                                latelySkin : character.latelySkin} });
            return character;      
        } catch (error) {
            console.error(error);  
        }
    }

    // 해당 characterId 의 캐릭터를 삭제한다.
    async deleteCharacter(id) {
        const db = await dbConn.getConn();
        const characters = db.collection('LOLCharacters');
        try {
            await characters.deleteOne({characterId:id});
            console.log('Remove success :', characterId);
        } catch (error) {
            console.error(error);  
        }
    }
}

module.exports = new LOLCharacter();