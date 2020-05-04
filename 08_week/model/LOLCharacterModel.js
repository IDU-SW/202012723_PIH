const pool = require('../dbConnection');
const {prepareTable} = require('./prepareTable');

class LOLCharacter {
    constructor() {
        try {
            prepareTable(); //  테이블 준비
        } catch (error) {
            console.error(error);    
        }
    }

    // 목록 불러오기.
    async getCharacterList() {
        const sql = 'SELECT * FROM characters';
        let conn;
        try {
            conn = await pool.getConnection();
            const [rows, metadata] = await conn.query(sql);
            conn.release();
            return rows;
        } catch (error) {
            console.error(error);
        } finally {
            if ( conn ) conn.release();
        }
    }

    // 데이터 추가.
    async addCharacter(name, characteristic, explanation, latelySkin) {
        const sql = 'INSERT INTO characters SET ?';
        const newCharacter = {name, characteristic, explanation, latelySkin};

        let conn;
        try {
            conn = await pool.getConnection();
            await conn.query(sql, newCharacter);
            conn.release();

            return newCharacter;
        } catch (error) {
            console.error(error);
        } finally {
            if ( conn ) conn.release();
        }
    }

    // 캐릭터 상세 데이터 불러오기.
    async getCharacterDetail(characterId) {
        const sql = 'SELECT * FROM characters WHERE id = ?';
        let conn;

        try {
            conn = await pool.getConnection();
            const [rows, metadata] = await conn.query(sql, characterId);
            conn.release();
            return rows[0];
        } catch (error) {
            console.error(error);
        } finally {
            if ( conn ) conn.release();
        }
    }

    // 캐릭터 정보를 변경하는 함수.
    async updateCharacter(characterId, name, characteristic, explanation, latelySkin) {
        const sql = 'UPDATE characters SET ? WHERE id = ?';
        // 변경 값을 받아온 데이터만 수정. 그외에 기존 데이터는 유지.
        const param = {
                        name: !name ? character.name : name,
                        characteristic: !characteristic ? character.characteristic : characteristic,
                        explanation: !explanation ? character.explanation : explanation,
                        latelySkin: !latelySkin ? character.latelySkin : latelySkin
                    };

        let conn;

        try {
            conn = await pool.getConnection();
            // 파라미터 순서는 SET의 값, Where 조건의 값
            const ret = await conn.query(sql, [param, characterId] );
            const info = ret[0];
            
            console.log('수정 대상 Row(affectedRows) :', info['affectedRows']);
            console.log('수정된 Row(changedRows) :', info['changedRows']); 
            console.log('메세지 :', info['info']);  
            param.id = characterId;
            return param;      
        } catch (error) {
            console.error(error);  
        } finally {
            if ( conn ) conn.release();
        }
    }

    // 해당 characterId 의 캐릭터를 삭제한다.
    async deleteCharacter(characterId) {
        const sql = 'DELETE FROM characters WHERE id = ?';

        let conn;
        try {
            conn = await pool.getConnection();        
            const ret = await conn.query(sql, characterId);
            const info = ret[0];
            console.log('삭제 대상 Row(affectedRows) :', info['affectedRows']);
        } catch (error) {
            console.error(error);  
        } finally {
            if ( conn ) conn.release();
        }
    }
}

module.exports = new LOLCharacter();