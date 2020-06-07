const express = require('express');
const router = express.Router();
const characters = require('../model/LOLCharacterModel');

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'./uploads') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
  });
const upload = multer({ storage : storage });

const secretKey = 'Inhye23';

const user = {
    id : 'pih',
    password : '202012723',
    name : '박인혜',
 }

 function tokenVerifier(req, res, next) {
    let token = req.headers['authorization'];
    
    if (token) {
        console.log('token :', token);
        jwt.verify(token, secretKey, (err, decoded) => {
            if (decoded) {
                req.user = decoded;
                next();
            }
            else {
                next({code: 401, msg: 'UnAuthorized'});
            }            
        });
    }
    else {
        next({code: 401, msg: 'UnAuthorized'});
    }    
}

router.get('/LOLCharacter', showCharacterList);
router.get('/LOLCharacter/:characterId', showCharacterDetail);
router.get('/LOLCharacterAdd', showAddForm);
router.get('/LOLCharacterUpdate/:characterId', showUpdateForm);
router.post('/LOLCharacter', upload.single('thumbnail'), addCharacter);
router.post('/LOLCharacterUpdate/:characterId', upload.single('thumbnail'), updateCharacter);
router.post('/LOLCharacter/:characterId', deleteCharacter);

router.get('/tokenCheck', tokenVerifier, sendProfile);
router.post('/LOLCharacterLogin', handleLogin);

module.exports = router;

function handleLogin(req, res) {
    const id = req.body.id;
    const pw = req.body.password;

    console.log('trying to login:', id, pw);

    // 로그인 성공
    if (id === user.id && pw === user.password) {
        // 토큰 생성
        const token = jwt.sign({ id: user.id, name: user.name }, secretKey);
        console.log('Login Success :', token);

        //res.render('CharacterList', { data:{ msg: 'success', token: token } });
        res.send({ msg: 'success', token: token });
    }
    else {
        res.sendStatus(401);
    }
}

function sendProfile(req, res) {
    const user = req.user;
    const id = user.id;
    const name = user.name;

    res.send({id: user.id, name: user.name, photo: user.photo});
};

async function showCharacterList(req, res) {
    try {
        const characterList = await characters.getCharacterList();
        const result = { data:characterList, count:characterList.length };
        res.render('CharacterList', { data:characterList });
    } catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

// Async-await를 이용하기
async function showCharacterDetail(req, res) {
    try {
        const characterId = req.params.characterId;
        console.log('characterId : ', characterId);
        const info = await characters.getCharacterDetail(characterId);
        console.log(info.CharacterImage.dataValues);
        res.render('CharacterDetail', { data:info.dataValues, image:info.CharacterImage.dataValues });
    } catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

// 정보를 추가할 수 있는 폼으로 이동.
function showAddForm(req, res) {
    res.render('AddCharacter');
}

// 기존 데이터를 수정하기 위한 폼으로 이동.
async function showUpdateForm(req, res) {
    try {
        const characterId = req.params.characterId;
        console.log('characterId : ', characterId);
        const info = await characters.getCharacterDetail(characterId);
        console.log('name : ', info.name);
        res.render('UpdateCharacter', { data:info.dataValues, image:info.CharacterImage.dataValues });
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

// 캐릭터 정보 추가.
async function addCharacter(req, res) {
    const name = req.body.name;

    if (!name) {
        res.status(400).send({error:'name 누락'});
        return;
    }

    const characteristic = req.body.characteristic;
    const explanation = req.body.explanation;
    const latelySkin = req.body.latelySkin;

    const image = req.file;
    if(!image) {
        res.status(400).send({error:'이미지 누락'});
        return;
    }
    const thumbnail = image.originalname;

    try {
        const result = await characters.addCharacter(name, characteristic, explanation, latelySkin, thumbnail);
        console.log('데이터 추가 완료');
        showCharacterList(req, res);
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}

// id 외에 수정할 정보를 받아와 model 로 전달.
async function updateCharacter(req, res) {
    const id = req.params.characterId;  //  데이터를 변경할 id를 받아온다.
    console.log("update : " + id);
    // 수정할 데이터.
    const name = req.body.name;
    const characteristic = req.body.characteristic;
    const explanation = req.body.explanation;
    const latelySkin = req.body.latelySkin;

    const image = req.file;
    const thumbnail = !image ? null : image.originalname;

    try {
        const result = await characters.updateCharacter(id, name, characteristic, explanation, latelySkin, thumbnail);
        res.render('CharacterDetail', { data:result.dataValues, image:result.CharacterImage.dataValues });
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}

// 삭제할 id 를 받아 model 로 전달.
async function deleteCharacter(req, res) {
    const id = req.params.characterId;
    try {
        const result = await characters.deleteCharacter(id);
        res.sendStatus(200);
    }
    catch(error) {
        res.status(500).send(error.msg);
    }
}