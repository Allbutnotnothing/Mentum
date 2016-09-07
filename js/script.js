(function(){

  var currentSlide = 0;
  var lastSlide = $('#sliderContent li').length-1;
  var slideTimer;
  $('#sliderContent li').hide();
  
  function showThenHideCurrent(){
    var $currentSlideIndicator = $('#sliderIndicators a').eq(currentSlide);
    $currentSlideIndicator.addClass('current');
    var $currentSlide = $('#sliderContent li').eq(currentSlide);
    /*
    $currentSlide.fadeIn(500);
    setTimeout(function(){
      $currentSlide.fadeOut(500);
    },1500);
    setTimeout(function(){
      $currentSlideIndicator.removeClass('current');
    },2000);
    */
    $currentSlide.fadeIn(300, function(){
      $currentSlide.animate({opacity: 1},1400, function(){
        $currentSlide.fadeOut(300,function(){
          $currentSlideIndicator.removeClass('current');
        });
      });
    });
  }
  function startSlide(){
    showThenHideCurrent();
    slideTimer = setInterval(function(){
      currentSlide = currentSlide===lastSlide?0:currentSlide+1;
      showThenHideCurrent();
    },2010);
  }
  function responseToSlideChange(newSlide){
    clearInterval(slideTimer);
    
    var $currentSlide = $('#sliderContent li').eq(currentSlide);
    var $currentSlideIndicator = $('#sliderIndicators a').eq(currentSlide);
    
    $currentSlide.stop();
    $currentSlide.fadeOut(300, function(){
      $currentSlideIndicator.removeClass('current');
      currentSlide = newSlide;
      startSlide();
    });
  }
  
  startSlide();
  $('#sliderContent').hover(
    function(){
      var $currentSlide = $('#sliderContent li').eq(currentSlide);
      $currentSlide.finish(); // necessary
      
      $currentSlide.show();
      var $currentSlideIndicator = $('#sliderIndicators a').eq(currentSlide);
      $currentSlideIndicator.addClass('current');
      
      clearInterval(slideTimer);
    },
    function(){
      startSlide();
    }
  );
  
  $('#sliderIndicators a').click(function(e){
    e.preventDefault(); //以免页面滚动位置改变
    responseToSlideChange($('#sliderIndicators a').index(this));
  });
  $('#sliderLeft a').click(function(e){
    e.preventDefault();
    var newSlide = currentSlide===0?lastSlide:currentSlide-1;
    responseToSlideChange(newSlide);
  });
  $('#sliderRight a').click(function(e){
    e.preventDefault();
    var newSlide = currentSlide===lastSlide?0:currentSlide+1;
    responseToSlideChange(newSlide);
  });

})();
  
$('.portfolioItem').hover(
  function(){
   $(this).find('.portfolioItemCaption').animate({
     top:215,
   },400);
  },
  function(){
    $(this).find('.portfolioItemCaption').animate({
     top:280,
   },400);
  }
);
  
//draw the skill level bars
$('.levelBarFull').each(function(){
  $(this).width($(this).data('percentage') + '%');
});

//点击跳转到页面指定位置
$('.js-scrollTo').click(function(){
  var $this = $(this);
  var targetPosition = $('#'+$this.data('target')).offset().top;
  var scrollDistance = Math.abs(targetPosition - $this.offset().top);
  $('html, body').animate(
    {scrollTop: targetPosition},
    13 * Math.sqrt(scrollDistance)
  );
});

// response to scrolling into view
/*
(function(){
  var prePos = 0;
  var curPos = 0;
  // var RANGE = 300; 用户可能调整窗口
  var $targetEle = $('.priceItem').has('.premium');
  $targetEle.css('transition', 'all 0.6s');
  var targetPos = $targetEle.offset().top + $targetEle.height()/2;
  function isInRange(pos, vh, range){
    return pos+(vh-range)/2 < targetPos && pos+(vh-range)/2 > targetPos - range;
  }
  $(window).scroll(function(){
    
    prePos = curPos;
    curPos = $(window).scrollTop();
    var vh = $(window).height();
    var range = vh * 0.4;
    if(isInRange(prePos, vh, range)) return;
    if(isInRange(curPos, vh, range)){
      //console.log('x');
      $targetEle.addClass('turnBig');
      setTimeout(function(){
        $targetEle.removeClass('turnBig');
      },900);
    }
  });
})();
*/
// response to scrolling into view--improvement
(function(){
  var curPos = 0;
  var wasAnimated = false;
  var vh, range;
  
  var $targetEle = $('.priceItem').has('.premium');
  $targetEle.css('transition', 'all 0.6s');
  var targetTopPos = $targetEle.offset().top;
  var targetHeight = $targetEle.height();
  var targetPos = targetTopPos + targetHeight/2;
  function isInRange(pos, vh, range){
    return pos+(vh-range)/2 < targetPos && pos+(vh-range)/2 > targetPos - range;
  }
  function targetIsVisible(){
    //variables needing to be updated before executed: curPos, vh
    return curPos+vh > targetTopPos && curPos < targetTopPos+targetHeight;
  }
  
  $(window).scroll(function(){
    curPos = $(window).scrollTop();
    vh = $(window).height();
    if(!targetIsVisible()){
      wasAnimated = false;
      return;
    }
    range = vh * 0.4;
    if(!wasAnimated && isInRange(curPos, vh, range)){
      $targetEle.addClass('turnBig');
      setTimeout(function(){
        $targetEle.removeClass('turnBig');
      },900);
      wasAnimated = true;
    }
  });
})();