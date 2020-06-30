var dbConfig = require('./dbconfig');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    dialect: 'mysql', host: dbConfig.host, port: 3000
});

class UserProfile extends Sequelize.Model {}
UserProfile.init({
    id: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true
    },
    image: Sequelize.STRING
}, {tableName:'userProfile', sequelize, timestamps: false});

class User {
    constructor() {
        try {
            this.prepareModel(); //  테이블 준비
        } catch (error) {
            console.error(error);    
        }
    }

    async prepareModel() {
        try {
            await UserProfile.sync({force:true});

            await UserProfile.create({
                id : "pih",
                image : "https://idu-202012723.s3.ap-northeast-2.amazonaws.com/userThumbnail.jpg"
            }, {logging:false});

            await UserProfile.create({
                id : "user",
                image : "https://idu-202012723.s3.ap-northeast-2.amazonaws.com/userThumbnail.jpg"
            }, {logging:false});
        } catch (error) {
            console.log('User.sync Error ', error);
        }
    }

    async getUserProfile(userId) {
        try {
            const ret = await UserProfile.findAll({
                where:{id:userId}
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

    // 유저 프로필 데이터를 변경한 후 값을 반환.
    async updateUserProfile(userId, thumbnail) {
        try {
            let userData = await this.getUserProfile(userId);
            userData.dataValues.image = thumbnail;
            let returnValue = await userData.save();
            return returnValue;
        } catch (error) {
            console.error(error);  
        }
    }
}

module.exports = new User();