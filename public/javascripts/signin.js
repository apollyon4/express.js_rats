// --------- signin --------- //
var id =    { $data : $('input[name=id]'),
              $info : $('#idinfo'),
              pattern : /^[0-9a-zA-Z]{6,12}$/,
              emptyErr : '아이디를 입력해주세요.',
              wrongErr : '아이디는 6자리 이상, 12자리 이하, 영문 및 숫자입니다.'},
    pw =    { $data : $('input[name=pw]'),
              $info : $('#pwinfo'),
              pattern : /^.{6,15}$/,
              emptyErr : '비밀번호를 입력해주세요.'},
    names =  { $data : $('input[name=name]'),
              $info : $('#nameinfo'),
              emptyErr : '이름을 입력해주세요.',
              pattern : /^[가-힣]{2,6}$/,
              wrongErr : '잘못된 입력입니다.'},
    phone = { $data : $('input[name=phone]'),
              $info : $('#phoneinfo'),
              pattern : /^[0-9\-]{8,16}$/,
              emptyErr : '전화번호를 입력해주세요.',
              wrongErr : '잘못된 입력입니다.'},
    email = { $data : $('input[name=email]'),
              $info : $('#emailinfo'),
              pattern : /^[0-9a-zA-Z][0-9a-zA-Z\_\-\.\+]+[0-9a-zA-Z]@[0-9a-zA-Z][0-9a-zA-Z\_\-]*[0-9a-zA-Z](\.[a-zA-Z]{2,6}){1,2}$/i,
              emptyErr : '이메일을 입력해주세요.',
              wrongErr : '잘못된 입력입니다.'},
    $idDup = $('input[name=idDup]'),
    $confirm = $('input[name=confirm]'),
    url = 'http://localhost:9000' + '/accounts/duplicate';

// 페이지 기본 설정
function initSelect() {
  var today = new Date(),
      year = today.getFullYear(), month = today.getMonth()+1, day = today.getDate(),
      $frag = $(document.createDocumentFragment());
  var initBirth = function($target, start, end, init) {
    var inc = start < end ? +1 : -1;
    for(var count = start-end; count != 0; count += inc) {
      $frag.append('<option value='+(end+count)+'>'+(end+count)+'</option>');
    }
    $target.append($frag);
    $target.val(init).prop("selected", true);
  }
  initBirth($('select[name=year]'),   year, 1900, year);
  initBirth($('select[name=month]'),  1,    13,   month);
  initBirth($('select[name=day]'),    1,    32,   day);
  initBirth($('select[name=grade]'),  1,    99,   (year%1000%100));
}
initSelect();

// 잘못된 입력에 대한 안내 설정
function setMsg($data, info, msg) {
  info.text(msg);
  if(msg == '') {
    $data.addClass('green').removeClass('red');
  } else {
    $data.addClass('red').removeClass('green');
  }
}

// 비밀번호 검사
var pwValidate = function() {
  var data = pw.$data.val(),
      conf = $confirm.val(),
      permission = false;
  if(data == '') {
    setMsg(pw.$data, pw.$info, '비밀번호를 입력해주세요.');
  } else if(data.length < 6 || data.length > 15) {
    setMsg(pw.$data, pw.$info, '비밀번호는 6자리 이상, 15자리 이하입니다.');
  } else if(conf == '') {
    setMsg($confirm, pw.$info, '비밀번호 확인을 입력해주세요.');
  } else if(data != conf) {
    setMsg(pw.$data, pw.$info, '비밀번호 확인이 일치하지 않습니다.');
    $confirm.addClass('red').removeClass('green');
  } else {
    setMsg(pw.$data, pw.$info, '');
    $confirm.addClass('green').removeClass('red');
    permission = true;
  }
  return permission;
}
// 데이터 검증하기
pw.$data.add($confirm).on('blur', function() {
  pwValidate();
});
[email, phone, names].forEach(function(item) {
  item.$data.on('blur', function() {
    validate(item);
  });
});

// 아이디 중복 체크
$('#duplicate').on('click', function() {
  var data = id.$data.val();
  if(validate(id) == false) {
    return;
  }
  data = {'id' : data};
  data = JSON.stringify(data);
  // 데이터 송신
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(data);
  // 데이터 수신
  xhr.addEventListener('load', function(){
    var result = JSON.parse(xhr.responseText);
    if(result.exists == false) {
      $idDup.val(id.$data.val());
      setMsg(id.$data, id.$info, '');
    } else {
      setMsg(id.$data, id.$info, '이미 사용중인 아이디입니다.');
    }
  });
});

// 입력을 검사하는 특수문자의 정규식
var validate = function(item) {
  var data = item.$data.val();
      permission = false;
  if(data == '') {
    setMsg(item.$data, item.$info, item.emptyErr);
  } else if(!data.match(item.pattern)) {
    setMsg(item.$data, item.$info, item.wrongErr);
  } else {
    setMsg(item.$data, item.$info, '');
    permission = true;
  }
  return permission;
}

// 회원가입 제출
$('form').on('submit', function(event) {
  // submit을 막아 놓고, 모든 값이 정상일 경우 submit을 한다.
  var permission = true;
  event.preventDefault();
  // 입력이 비정상인 경우
  [email, phone, names, id].forEach(function(item) {
    if(validate(item) == false) {
      permission = false;
    }
  });
  // id중복 확인을 안한 경우
  if(id.$data.val() != $idDup.val()) {
    setMsg(id.$data, id.$info, '중복 확인을 해주세요.');
    permission = false;
  }
  // 비밀번호 비정상인 경우
  if(pwValidate() == false) {
    permission = false;
  }
  // 정상적인 경우
  if(permission == true) {
    var $year = $('select[name=year]'),
        $month = $('select[name=month]'),
        $day = $('select[name=day]');
    $('input[name=birth]').val($year.val()+pad($month.val())+pad($day.val()));
    $year.add($month).add($day).add($confirm).attr('disabled', 'true');

    $(this).submit();
  }
});
