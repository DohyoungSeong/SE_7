var express = require('express');
var router = express.Router();
var mysql = require('mysql');

// MySQL 데이터베이스 연결 설정
var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '1234',
  database: 'tutorial'
});

connection.connect(); // MySQL 연결

// 로그인 검사 미들웨어
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// GET 요청에 대한 마이 페이지 렌더링
router.get('/', isAuthenticated, function(req, res, next) {
  // 세션에서 사용자 ID를 가져옵니다.
  var userId = req.session.user.id;

  // 사용자 정보 조회 쿼리
  var query = 'SELECT * FROM users WHERE id = ?';

  // 사용자 정보 조회
  connection.query(query, [userId], function(error, results, fields) {
    if (error) {
      // 에러 처리
      console.error('데이터베이스 조회 에러:', error);
      res.render('mypage', { title: '마이페이지', error: '사용자 정보를 불러오는 중 오류가 발생했습니다.' });
    } else {
      // 조회 결과를 사용하여 마이 페이지 렌더링
      res.render('mypage', { title: '마이페이지', user: results[0] });
    }
  });
});

module.exports = router;