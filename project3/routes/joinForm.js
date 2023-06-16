var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '1234',
  database: 'tutorial'
});

/* GET join form page. */
router.get('/', function(req, res, next) {
  res.render('joinForm', { title: '회원 가입' });
});

/* POST join form data. */
router.post('/', function(req, res, next) {
  var userData = req.body;

  // 중복 체크 쿼리
  var checkDuplicateQuery = 'SELECT id FROM users WHERE id = ?';
  var checkDuplicateValues = [userData.id];

  connection.query(checkDuplicateQuery, checkDuplicateValues, function(err, duplicateResults) {
    if (err) {
      console.error(err);
      res.status(500).send('회원가입에 실패했습니다.');
      return;
    }

    if (duplicateResults.length > 0) {
      // 중복된 아이디가 있는 경우
      res.render('joinForm', { title: '회원 가입', error: '아이디가 중복되었습니다.' });
      return;
    }

    // 중복된 아이디가 없는 경우 회원가입 수행
    var insertQuery = 'INSERT INTO users (id, password, name, email, tel, address, job, gender, birth) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    var insertValues = [
      userData.id,
      userData.password,
      userData.name,
      userData.email,
      userData.tel1+'-'+userData.tel2+'-'+userData.tel3,
      userData.address,
      userData.job,
      userData.gender,
      userData.birth
    ];

    connection.query(insertQuery, insertValues, function(err, insertResults) {
      if (err) {
        console.error(err);
        res.status(500).send('회원가입에 실패했습니다.');
      } else {
        console.log('회원가입이 완료되었습니다.');
        res.redirect('/login'); // 회원가입 성공 시 로그인 페이지로 리디렉션
      }
    });

    connection.end(); // 데이터베이스 연결 종료
  });
});

module.exports = router;