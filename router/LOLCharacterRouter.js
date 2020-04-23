const express = require('express');
const router = express.Router();
const characters = require('../model/LOLCharacterModel');

router.get('/LOLCharacter', showCharacterList);
router.get('/LOLCharacter/:characterId', showCharacterDetail);
router.post('/LOLCharacter', addCharacter);
router.put('/LOLCharacter/:characterId', updateCharacter);
router.delete('/LOLCharacter/:characterId', deleteCharacter);

module.exports = router;

function showCharacterList(req, res) {
    const characterList = characters.getCharacterList();
    const result = { data:characterList, count:characterList.length };
    res.send(result);
}

// Async-await를 이용하기
async function showCharacterDetail(req, res) {
    try {
        // 영화 상세 정보 Id
        const characterId = req.params.characterId;
        console.log('characterId : ', characterId);
        const info = await characters.getCharacterDetail(characterId);
        res.send(info);
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

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
        res.send({msg:'success', data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}

// id 외에 수정할 정보를 받아와 model 로 전달.
async function updateCharacter(req, res) {
    const id = req.params.characterId;  //  데이터를 변경할 id를 받아온다.

    // 수정할 데이터.
    const name = req.body.name;
    const characteristic = req.body.characteristic;
    const explanation = req.body.explanation;
    const latelySkin = req.body.latelySkin;

    try {
        const result = await characters.updateCharacter(id, name, characteristic, explanation, latelySkin);
        res.send({msg:'update success', data:result});
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
        res.send({msg:'delete success'});
    }
    catch(error) {
        res.status(500).send(error.msg);
    }
}