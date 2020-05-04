const fs = require('fs');
const pool = require('../dbConnection');

exports.prepareTable = () => {
    const sql = 'drop table if exists characters; create table characters (id int primary key auto_increment, name varchar(50), characteristic varchar(500), explanation TEXT(5000), latelySkin varchar(200));';
    pool.query(sql).then(ret => {
        console.log('characters 테이블 준비 완료');
        allDataInsert();
    }).catch(err => {
        console.log('characters 테이블 준비 실패 :', err);
        pool.end();
    });
}

// oneDataInsert함수를 호출하여 json 파일의 모든 데이터를 db에 저장.
async function allDataInsert() {
    const data = fs.readFileSync('./model/data.json');
    const characters = JSON.parse(data);

    for (var character of characters ) {
        await oneDataInsert(character);
    }
}

// json 파일의 데이터를 하나씩 db에 저장.
async function oneDataInsert(character) {
    let conn;
    try {
        conn = await pool.getConnection();
        const sql = 'INSERT INTO characters SET ?;';
        const data = { 
                        name : character.name, 
                        characteristic : character.characteristic, 
                        explanation : character.explanation, 
                        latelySkin : character.latelySkin 
                    };
        const ret = await conn.query(sql, data);
        console.log('insert success:', character.id);
    } catch (error) {
        console.error(error);
    } finally {
        if ( conn )
            conn.release();
    } 
}