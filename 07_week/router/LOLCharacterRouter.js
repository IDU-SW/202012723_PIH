const express = require('express');
const router = express.Router();
const characters = require('../model/LOLCharacterModel');

router.get('/LOLCharacter', showCharacterList);
router.get('/LOLCharacter/:characterId', showCharacterDetail);
router.get('/LOLCharacterAdd', showAddForm);
router.get('/LOLCharacterUpdate/:characterId', showUpdateForm);
router.post('/LOLCharacter', addCharacter);
router.post('/LOLCharacterUpdate/:characterId', updateCharacter);
router.post('/LOLCharacter/:characterId', deleteCharacter);

module.exports = router;

function showCharacterList(req, res) {
    const characterList = characters.getCharacterList();
    const result = { data:characterList, count:characterList.length };
    res.render('CharacterList', { data:characterList });
}

// Async-await를 이용하기
async function showCharacterDetail(req, res) {
    try {
        const characterId = req.params.characterId;
        console.log('characterId : ', characterId);
        const info = await characters.getCharacterDetail(characterId);
        res.render('CharacterDetail', { data:info });
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

// 정보를 추가할 수 있는 폼으로 이동.
function showAddForm(req, res) {
    res.render('AddCharacter', {test:10});
}

// 기존 데이터를 수정하기 위한 폼으로 이동.
async function showUpdateForm(req, res) {
    try {
        const characterId = req.params.characterId;
        console.log('characterId : ', characterId);
        const info = await characters.getCharacterDetail(characterId);
        console.log('name : ', info.name);
        res.render('UpdateCharacter', { data:info });
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

    try {
        const result = await characters.addCharacter(name, characteristic, explanation, latelySkin);
        //res.send({msg:'success', data:result});
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

    try {
        const result = await characters.updateCharacter(id, name, characteristic, explanation, latelySkin);
        res.render('CharacterDetail', { data:result });
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
        showCharacterList(req, res);
    }
    catch(error) {
        res.status(500).send(error.msg);
    }
}