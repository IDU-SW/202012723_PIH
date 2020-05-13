const mysql = require('mysql2');
const dbConfig = {
    host: 'localhost',
    user: 'dev',
    password: 'secret',
    port: 3306,
    database: 'LOLCharacter'
};

async function connectByAwait() {
    const conn = mysql.createConnection(dbConfig).promise();
    try {
        await conn.connect();
        console.log('DB 연결 성공');
        conn.end();
    }
    catch (err) {
        console.log('DB 연결 실패', err);
    }
}

connectByAwait();