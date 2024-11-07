$(function() {

$(".index2").find('.zdxmdh').find('li').eq(0).addClass('active');
$(".index3").find('.s2left').find('li').eq(0).addClass('active');
$(".index3").find('.s2right').find('li').eq(0).addClass('active');
$(".index4").find('.dh').find('li').eq(0).addClass('active');







  $(".index2").find('.zdxmdh').find('li').click(function(event) {
    var num = $(this).index();
    $(".index2").find('.zdxmdh').find('li').removeClass('active');
    $(this).addClass('active');
    $(".index2").find('.gdjtnei').removeClass('neiavtive');
    $(".index2").find('.gdjtnei').eq(num).addClass('neiavtive');
  });

  $(".index3").find('.s2left').find('.zdxmdh').find('li').click(function(event) {
    var num = $(this).index();
    $(".index3").find('.s2left').find('.zdxmdh').find('li').removeClass('active');
    $(this).addClass('active');
    $(".index3").find('.s2left').find('.gdjtnei').removeClass('neiavtive');
    $(".index3").find('.s2left').find('.gdjtnei').eq(num).addClass('neiavtive');
  });

  $(".index3").find('.s2right').find('.zdxmdh').find('li').click(function(event) {
    var num = $(this).index();
    $(".index3").find('.s2right').find('.zdxmdh').find('li').removeClass('active');
    $(this).addClass('active');
    $(".index3").find('.s2right').find('.gdjtnei').removeClass('neiavtive');
    $(".index3").find('.s2right').find('.gdjtnei').eq(num).addClass('neiavtive');
  });
/*
  $(".index4").find('.xmy').find('li').hover(function(event) {
    $(".index4").find('.xmy').find('li').removeClass('active');
    $(this).addClass('active');
    var num = $(this).index();
    $(".index4").find('.jsy').find('li').removeClass('active');
    $(".index4").find('.jsy').find('li').eq(num).addClass('active');
  }, function() {});

  $(".xxgkul").find('.xmy').find('li').hover(function(event) {
    $(".xxgkul").find('.xmy').find('li').removeClass('active');
    $(this).addClass('active');
    var num = $(this).index();
    $(".xxgkul").find('.jsy').find('li').removeClass('active');
    $(".xxgkul").find('.jsy').find('li').eq(num).addClass('active');
  }, function() {});
*/

$(".index4").find('.xmy').find('li').hover(function(event) {
  $(".index4").find('.xmy').find('li').removeClass('active');
  $(this).addClass('active');
}, function() {});

$(".xxgkul").find('.xmy').find('li').hover(function(event) {
  $(".xxgkul").find('.xmy').find('li').removeClass('active');
  $(this).addClass('active');
}, function() {});




  $(".xxgkul").find(".dh").find('li').hover(function() {
    $(".dh").find('li').removeClass('active');
    $(this).addClass('active');
    var num = $(this).index();
    $(".xxgkul").find(".hd-nei").removeClass('active');
    $(".xxgkul").find(".hd-nei").eq(num).addClass('active');
  }, function() {});

  $(".index4").find(".dh").find('li').hover(function() {
    $(".dh").find('li').removeClass('active');
    $(this).addClass('active');
    var num = $(this).index();
    $(".index4").find(".hd-nei").removeClass('active');
    $(".index4").find(".hd-nei").eq(num).addClass('active');
  }, function() {});




  $(".head-dh").find('li').hover(function() {
    var num = $(this).index() - 1;

    if (num >= 0&&num<6) {
    var text1221 =   $("body").attr("loaded");
    if(text1221==1){
      return;
    }else{


	$(".xfc").show();
      $(".bai").find('.bai1').removeClass('active');
      $(".bai").find('.bai1').eq(num).addClass('active');
    }
    }
  }, function() {
      $(".xfc").hide();
  });
  $(".bai").hover(function() {
    $(".xfc").show();
  }, function() {
      $(".xfc").hide();
  });

  $(".index4").find('.dh').find('li').eq(0).addClass('active');


});
