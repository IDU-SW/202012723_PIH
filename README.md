# 202012723_박인혜
========================================================

통신 규약

========================================================

**전체 캐릭터 리스트 받아오기**

[[요청]]
- URL : /LOLCharacter
- 메소드 : Get
- URL 예 : /LOLCharacter

[[응답]]
- 컨텐트 타입: JSON
- 메세지 구조
id : 데이터의 유일한 값. index.
name : 캐릭터의 이름.
characteristic : 캐릭터의 특징.
explanation : 캐릭터의 상세 설명.
latelySkin : 캐릭터의 가장 최신 스킨 이름.
count : 전체 항목의 갯수.

- 응답 메세지 예
{
    "data": [
        {
            "id": 0,
            "name": "티모",
            "characteristic": "거리, 암살자, 실명, 정찰, 둔화, 은신",
            "explanation": "티모는 원거리 공격수로 성향에 다양한 성장이 가능...",
            "latelySkin": "꿀잼 티모"
        },
        {
            "id": 1,
            "name": "베인",
            "characteristic": "원거리, 암살자, 탈출, 밀치기, 은신, 기절",
            "explanation": "베인은 원거리 딜러로 사정거리는 짧지만...",
            "latelySkin": "불꽃놀이 베인 프레스티지 에디션"
        },
        {
            "id": 2,
            "name": "마스터 이",
            "characteristic": "암살자, 전사, 치유",
            "explanation": "마스터 이는 전형적인 근접 딜러로...",
            "latelySkin": "불의 축제 마스터 이"
        }
    ],
    "count": 3
}
========================================================

**특정 캐릭터 정보 받아오기**

[[요청]]
- URL : /LOLCharacter/:characterId
- 메소드 : Get
- URL 예 : /LOLCharacter/0

[[응답]]
- 컨텐트 타입: JSON
- 메세지 구조
id : 데이터의 유일한 값. index.
name : 캐릭터의 이름.
characteristic : 캐릭터의 특징.
explanation : 캐릭터의 상세 설명.
latelySkin : 캐릭터의 가장 최신 스킨 이름.

- 응답 메세지 예
{
    "id": 0,
    "name": "티모",
    "characteristic": "거리, 암살자, 실명, 정찰, 둔화, 은신",
    "explanation": "티모는 원거리 공격수로 성향에 다양한 성장이 가능합니다. 빠른 이동속도로 치고 빠지는 게릴라식 전투에 능하며 버섯을 이용한 맵 정찰로 팀에 기여할 수 있습니다. 물리 공격 챔피언을 잠시동안 무력화 시킬 수 있으며 패시브를 이용한 매복 공격도 가능합니다.",
    "latelySkin": "꿀잼 티모"
}
========================================================

**캐릭터 정보 추가하기**

[[요청]]
- URL : /LOLCharacter
- 메소드 : Post
- URL 예 : /LOLCharacter
- 메세지 구조
name : 추가 할 캐릭터 이름.
characteristic : 추가 할 캐릭터의 특징.
explanation : 추가 할 캐릭터의 상세 설명.
latelySkin : 추가 할 캐릭터의 가장 최신 스킨 이름.
- 요청 메세지 예
{
    "name": "이름",
    "characteristic": "특징",
    "explanation": "설명",
    "latelySkin": "스킨 이름"
}

[[응답]]
- 컨텐트 타입: JSON
- 메세지 구조
msg : 성공, 실패 메세지.
data.id : 데이터의 유일한 값. index.
data.name : 추가 된 캐릭터의 이름.
data.characteristic : 추가 된 캐릭터의 특징.
data.explanation : 추가 된 캐릭터의 상세 설명.
data.latelySkin : 추가 된 캐릭터의 가장 최신 스킨 이름.

- 응답 메세지 예
{
    "msg": "success",
    "data": {
        "id": 3,
        "name": "이름",
        "characteristic": "특징",
        "explanation": "설명",
        "latelySkin": "스킨 이름"
    }
}
========================================================

**특정 캐릭터 정보 수정하기**

[[요청]]
- URL : /LOLCharacter/:characterId
- 메소드 : Put
- URL 예 : /LOLCharacter/3
- 메세지 구조
name : 변경 할 캐릭터 이름. 변경하지 않는다면 입력하지 않아도 된다.
characteristic : 변경 할 캐릭터의 특징. 변경하지 않는다면 입력하지 않아도 된다.
explanation : 변경 할 캐릭터의 상세 설명. 변경하지 않는다면 입력하지 않아도 된다.
latelySkin : 변경 할 캐릭터의 가장 최신 스킨 이름. 변경하지 않는다면 입력하지 않아도 된다.
- 요청 메세지 예
{
    "latelySkin": "새로운 스킨 이름"
}

[[응답]]
- 컨텐트 타입: JSON
- 메세지 구조
msg : 성공, 실패 메세지.
data.id : 데이터의 유일한 값. index.
data.name : 캐릭터의 이름.
data.characteristic : 캐릭터의 특징.
data.explanation : 캐릭터의 상세 설명.
data.latelySkin : 캐릭터의 가장 최신 스킨 이름.

- 응답 메세지 예
{
    "msg": "update success",
    "data": {
        "id": 3,
        "name": "이름",
        "characteristic": "특징",
        "explanation": "설명",
        "latelySkin": "새로운 스킨 이름"
    }
}
========================================================

**특정 캐릭터 정보 삭제하기**

[[요청]]
- URL : /LOLCharacter/:characterId
- 메소드 : Delete
- URL 예 : /LOLCharacter/3

[[응답]]
- 컨텐트 타입: JSON
- 메세지 구조
msg : 성공, 실패 메세지.

- 응답 메세지 예
{
    "msg": "delete success"
}


========================================================

등록된 유저 아이디 : pih
등록된 유저 비밀번호 : 202012723

메인인 전체 목록을 보여주는 페이지에서 로그인을 하지 않으면 추가, 수정, 삭제 기능을 이용할 수 없습니다.
이외에 전체 목록과 상세 보기는 인증 없이 이용할 수 있습니다.