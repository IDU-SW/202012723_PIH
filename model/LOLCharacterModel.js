const fs = require('fs');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('LOLCharacter', 'dev', 'secret', {
    dialect: 'mysql', host: '127.0.0.1'
});

class Characters extends Sequelize.Model {}
Characters.init({
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING,
    characteristic: Sequelize.STRING,
    explanation: Sequelize.STRING,
    latelySkin: Sequelize.STRING,
}, {tableName:'characters', sequelize, timestamps: false});

class CharacterImage extends Sequelize.Model {}
CharacterImage.init({
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    fk_character_id: Sequelize.INTEGER,
    image: Sequelize.STRING
}, {tableName:'characterImage', sequelize, timestamps: false});

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
            await Characters.sync({force:true}); //  테이블 삭제 후 새로 만들기.
            await CharacterImage.sync({force:true});

            Characters.hasOne(CharacterImage, {
                foreignKey:'fk_character_id',
                onDelete:'cascade'
            });

            await this.allDataInsert(); //  초기 데이터 넣어주기.
        }
        catch (error) {
            console.log('Characters.sync Error ', error);
        }
    }

    // oneDataInsert함수를 호출하여 json 파일의 모든 데이터를 db에 저장.
    async allDataInsert() {
        const data = fs.readFileSync('./model/data.json');
        const characters = JSON.parse(data);
        for (var character of characters ) {
            await this.oneDataInsert(character);
        }
    }

    // 데이터를 하나씩 db에 저장.
    async oneDataInsert(character) {
        try {
            let charData = await Characters.create({ 
                            name : character.name, 
                            characteristic : character.characteristic, 
                            explanation : character.explanation, 
                            latelySkin : character.latelySkin 
                        }, {logging:false});
            let imageData = await CharacterImage.create({
                            image : character.thumbnail
                        }, {logging:false});
            const newData = charData.dataValues;
            console.log('oneDataInsert : ', newData);
            
            await charData.setCharacterImage(imageData);

            return newData;
        } catch (error) {
            console.error(error);
        }
    }

    // 목록 불러오기.
    async getCharacterList() {
        let returnValue;
        await Characters.findAll({})
        .then( results => {
            for (var item of results) {
                console.log('id:', item.id, ' name:', item.name);
            }
            returnValue = results;
        })
        .catch( error => {
            console.error('Error :', error);
        });
        return returnValue;
    }

    // 데이터 추가.
    async addCharacter(name, characteristic, explanation, latelySkin, thumbnail) {
        const newCharacter = {name, characteristic, explanation, latelySkin, thumbnail};
        try {
            const returnValue = await this.oneDataInsert(newCharacter);
            return returnValue;
        } catch (error) {
            console.error(error);
        }
    }

    // 캐릭터 상세 데이터 불러오기.
    async getCharacterDetail(characterId) {
        try {
            const ret = await Characters.findAll({
                where:{id:characterId},
                include: [{model:CharacterImage}]
            });

            if ( ret ) {
                return ret[0];
            }
            else {
                console.log('no data');
            }
        }
        catch (error) {
            console.log('Error :', error);
        }
    }

    // 캐릭터 정보를 변경하는 함수.
    async updateCharacter(characterId, name, characteristic, explanation, latelySkin, thumbnail) {
        try {
            let character = await this.getCharacterDetail(characterId); //  기존 상세 데이터를 찾아와서
            // 변경 값을 받아온 데이터만 수정. 그외에 기존 데이터는 유지.
            character.dataValues.name = !name ? character.name : name;
            character.dataValues.characteristic = !characteristic ? character.characteristic : characteristic;
            character.dataValues.explanation = !explanation ? character.explanation : explanation;
            character.dataValues.latelySkin = !latelySkin ? character.latelySkin : latelySkin;
            if(thumbnail)   //  이미지를 수정하였다면
            {
                const imageData = await CharacterImage.findByPk(character.CharacterImage.dataValues.id);
                imageData.image = thumbnail;
                await imageData.save(); //  CharacterImage 수정.

                character.CharacterImage.dataValues.image = thumbnail;  //  변경되지는 않으나 반환값을 위해 변경.
            }
            let ret = await character.save();   //  db 저장. 여기서 CharacterImage는 수정되지 않음.
            return ret;      
        } catch (error) {
            console.error(error);  
        }
    }

    // 해당 characterId 의 캐릭터를 삭제한다.
    async deleteCharacter(characterId) {
        try {
            let result = await Characters.destroy({where: {id:characterId}});
            console.log('Remove success :', characterId);
            return result;
        } catch (error) {
            console.error(error);  
            return null;
        }
    }
}

module.exports = new LOLCharacter();