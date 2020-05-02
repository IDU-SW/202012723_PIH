const fs = require('fs');

class LOLCharacter {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.characters = JSON.parse(data)
    }

    getCharacterList() {
        if (this.characters) {
            return this.characters;
        }
        else {
            return [];
        }
    }

    addCharacter(name, characteristic, explanation, latelySkin) {
        return new Promise((resolve, reject) => {
            let last = this.characters[this.characters.length - 1];
            let id = last.id + 1;

            let newCharacter = {id, name, characteristic, explanation, latelySkin};
            this.characters.push(newCharacter);

            resolve(newCharacter);
        });
    }

    getCharacterDetail(characterId) {
        return new Promise((resolve, reject) => {
            for (var character of this.characters ) {
                if ( character.id == characterId ) {
                    resolve(character);
                    return;
                }
            }
            reject({msg:'Can not find character', code:404});
        });
    }

    // 캐릭터 정보를 변경하는 함수.
    updateCharacter(characterId, name, characteristic, explanation, latelySkin) {
        return new Promise((resolve, reject) => {
            for (var character of this.characters ) {
                if ( character.id == characterId ) {    //  변경할 캐릭터를 찾았다면
                    // 변경 값을 받아온 데이터만 수정. 그외에 기존 데이터는 유지.
                    character.name = !name ? character.name : name;
                    character.characteristic = !characteristic ? character.characteristic : characteristic;
                    character.explanation = !explanation ? character.explanation : explanation;
                    character.latelySkin = !latelySkin ? character.latelySkin : latelySkin;
                    resolve(character);
                    return;
                }
            }
            reject({msg:'Can not find character', code:404});   //  삭제할 캐릭터 id 가 없는 경우 error
        });
    }

    // 해당 characterId 의 캐릭터를 삭제한다.
    deleteCharacter(characterId) {
        return new Promise((resolve, reject) => {
            for (var character of this.characters ) {
                if ( character.id == characterId ) {
                    this.characters.pop(character);
                    resolve(character);
                    return;
                }
            }
            reject({msg:'Can not find character', code:404});   //  삭제할 캐릭터 id 가 없는 경우 error
        });
    }
}

module.exports = new LOLCharacter();