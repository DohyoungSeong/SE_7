var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');

// MySQL 데이터베이스 연결 설정
var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', // MySQL 계정 사용자명
  password: '1234', // MySQL 계정 비밀번호
  database: 'tutorial' // 사용할 데이터베이스명
});

connection.connect(); // MySQL 연결

router.use(session({
  secret: 'mysecret', // 세션을 암호화하기 위한 비밀키
  resave: true,
  saveUninitialized: true
}));

// GET 요청에 대한 로그인 페이지 렌더링
router.get('/', function(req, res, next) {
  res.render('login', { title: '로그인', error: null }); // error 값을 null로 설정하여 초기화
});

// POST 요청에 대한 로그인 처리
router.post('/', function(req, res, next) {
  var id = req.body.id;
  var password = req.body.password;
  var job = req.body.job;

  // 사용자 정보 조회 쿼리
  var query = `SELECT * FROM users WHERE id = ? AND password = ? AND job = ?`;

  // 사용자 정보 조회
  connection.query(query, [id, password, job], function(error, results, fields) {
    if (error) {
      // 에러 처리
      console.error('데이터베이스 조회 에러:', error);
      res.render('login', { title: '로그인', error: '로그인 중 오류가 발생했습니다.' });
    } else {
      // 조회 결과 확인
      console.log('조회 결과:', results); // 결과를 출력합니다.
  
      if (results.length > 0) {
        // 로그인 성공적인 경우 세션을 생성합니다.
        req.session.user = { id: id };
  
        res.redirect('/dashboard');
      } else {
        // 로그인 실패한 경우 에러 메시지를 표시하고 다시 로그인 페이지로 이동합니다.
        console.log('로그인 실패: 아이디, 비밀번호 또는 직업이 잘못되었습니다.');
        res.render('login', { title: '로그인', error: '아이디, 비밀번호 또는 직업이 잘못되었습니다.' });
      }
    }
  });
});
module.exports = router;