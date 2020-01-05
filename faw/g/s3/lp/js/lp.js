;(function($) {

	lp_init = function (block_wrapper) {

		var $win = $(window),
			$doc = $(document),
			$html = $(document.documentElement),
			$htmlLang = window._s3Lang.code,
			isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			timerDays,
			timerHours,
			timerMinutes,
			timerSeconds,
			IOs = /iPhone|iPad|iPod/i.test(navigator.userAgent),
			iOs = /iPhone|iPad|iPod/i.test(navigator.userAgent),
        	clickEvent = iOs ? 'touchend' : 'click';
				
				
		// Menu
		
		(function(){
		
			var menuFirst = block_wrapper.find('.menuDesktop__menuTop'),
				menuSecond = block_wrapper.find('.top-menu-two'),
				menuThird = block_wrapper.find('.top-menu-five');
			
			menuSecond.oneLineMenu().menuLP();

			menuThird.oneLineMenu({
				minWidth: 740
			}).menuLP();
	
	        menuFirst.oneLineMenu({
		    	left: -160,
	            minWidth  : 1023
			}).menuLP({
				menuHeight: 49,
				fixedClass: 'fixed',
                fixedMenuElement: '.menu_wrapper'
			});
			
			menuFirst.on('click', 'a', function(){
				$(this).closest('[data-block-layout]').find('.menuDesktop').removeClass('opened');
				$('html').removeClass('overFlow');
			});
		})();
		
		// Menu End
				
		block_wrapper.find('.tariffs_wrapper .tariff .tariff_but .tariff_form').on('click', function(){
			var $this = $(this),
				$thisTitle = $this.parents('.tariff').find('.title').text(),
				interval;
			
			interval = setInterval(function(){
				var $target = $('.popover-body').find('.input-product_name input[type=text]');
				
				if ($target.length) {
					$target.val($thisTitle);
					clearInterval(interval);
				}
			}, 100);
		});
		
		
		
	    block_wrapper.find('.one-good-form .productSlider').slick({
	      slidesToShow: 1,
	      slidesToScroll: 1,
	      arrows: false,
	      fade: true,
	      asNavFor: '.pager-wrap'
	    });
	    
	    (function(){
	    	var linkTop = block_wrapper.find('.link-top')
				documentScroll = $(document).scrollTop();
				
			documentScroll>200? linkTop.addClass('show'): linkTop.removeClass('show');
			
			$(document).on('scroll', function(){
				var nowScroll = $(document).scrollTop();
				
				nowScroll>200? linkTop.addClass('show'):linkTop.removeClass('show');
			});
			linkTop.on('click', function(e){
				e.preventDefault();
				$('html, body').animate({scrollTop: 0});
			});
	    })();
  
    /*one-good-form BEGIN*/


    var slickSlider = block_wrapper.find('.one-good-form_productSlider'),
        slickNav = block_wrapper.find('.one-good-form_pager-wrap');


    slickSlider.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: slickNav
    });
    slickNav.slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      asNavFor: slickSlider,
      dots: false,
      autoplay:false,
      autoplaySpeed:1500,
      centerMode: false,
      vertical: true,
      focusOnSelect: true,
      responsive: [
        {
          breakpoint: 940,
          settings: {
            slidesToShow: 4,
            vertical: true,
            centerMode: false
          }
        },

        {
          breakpoint: 750,
          settings: {
            vertical: false,
            slidesToShow: 4,
            centerMode: false

          }
        },
        {
          breakpoint: 721,
          settings: {
            slidesToShow: 3,
            vertical: false,
            centerMode: false,
            infinite: true
          }
        },
        {
          breakpoint: 450,
          settings: {
            slidesToShow: 4,
            vertical: false,
            centerMode: false,
            infinite: true,
          }
        },
        {
          breakpoint: 400,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            vertical: false,
            infinite: true,

          }
        }

      ]
    });

    
    block_wrapper.find('.one-good-form_inner .button').on(IOs ? "touchend" : "click", function(){
      $(this).closest('.one-good-form_inner').find('.tpl-anketa-popup').addClass('expand');
    });

    block_wrapper.find(".one-good-form_inner .tpl-anketa_close").on(IOs ? "touchend" : "click", function(){
     $(this).closest(".one-good-form_inner").find(".tpl-anketa-popup").removeClass("expand");
    });

    block_wrapper.find('.one-good-form2_inner .button').on(IOs ? "touchend" : "click", function(){
      $(this).closest('.one-good-form2_inner').find('.tpl-anketa-popup').addClass('expand');
    });

    block_wrapper.find(".one-good-form2_inner .tpl-anketa_close").on(IOs ? "touchend" : "click", function(){
     $(this).closest(".one-good-form2_inner").find(".tpl-anketa-popup").removeClass("expand");
    });

    $(document).on(IOs ? "touchend" : "click", function(formClose) {
      if ($(formClose.target).closest('.tpl-anketa_wrap').length || $(formClose.target).closest('.button').length) {
        return
      } else {
        $('.tpl-anketa-popup').removeClass('expand');
      }
    });

    $(this).keydown(function(eventObject){
        if (eventObject.which == 27)
          $(".tpl-anketa-popup").removeClass("expand");
    });

    /*one-good-form END*/
	
	
		
    block_wrapper.on(IOs ? "touchend" : "click", '.faq_ver2 .button_read' , function(){
      $(this).removeClass('active');
      $(this).siblings('.button_hide').addClass('active');
      $(this).parent().prev('.faq-item_text').slideToggle(200);
      $(this).closest('.faq-item').addClass('shadow');
    });


    block_wrapper.on(IOs ? "touchend" : "click", '.faq_ver2 .button_hide' , function(){
		$(this).removeClass('active');
		$(this).siblings('.button_read').addClass('active');
		$(this).parent().prev('.faq-item_text').slideToggle(200);
		$(this).closest('.faq-item').removeClass('shadow');
    });
    

	block_wrapper.find(".horizontal-gallery").lightGallery({
		thumbnail: false,
		download: false,
		loop: false,
		selector: '.horizontal-gallery .picture'
	});

    

	block_wrapper.find('.vertical-gallery').lightGallery({
		thumbnail: false,
		download: false,
		loop: false,
		selector: '.vertical-gallery a'
	});
	
	block_wrapper.find('.good-img').lightGallery({
	  thumbnail: false,
	  download: false,
	  loop: false,
	  selector: '.good-img a',
	  counter: false 
	});
	
	
	block_wrapper.find('.one-good-icon__img').lightGallery({
	  thumbnail: false,
	  download: false,
	  loop: false,
	  selector: '.one-good-icon__img a',
	  counter: false 
	});
	
	block_wrapper.find('.pic-part').lightGallery({
		thumbnail: false,
		download: false,
		loop: false,
		selector: '.pic-part a',
		counter: false 
	});
	
	block_wrapper.find('.roundpic_inner').lightGallery({
	  thumbnail: false,
	  download: false,
	  loop: false,
	  selector: '.roundpic-part a'
	});
	
	block_wrapper.find(".popup_video_block_wrap").lightGallery({
	  thumbnail: false,
	  download: false,
	  loop: false,
	  zoom: false,
	  actualSize: false,
	  selector: '.button',
	  youtubePlayerParams: {
	        autoplay: 0,
	        modestbranding: 1,
	        showinfo: 0,
	        rel: 0
	    },
	    vimeoPlayerParams: {
	        byline : 0,
	        portrait : 0,
	        color : 'A90707'     
	    }
	});
	
	block_wrapper.find(".square-photo-blocks_inner").lightGallery({
		thumbnail: false,
		selector: '.square-photo-blocks_picture'
	});
	
	    // Gallery with thumbnails slider begin
  
    resizeController([951, Infinity], function() {
          
      var slide_count = 8;
      var $pagerElements = block_wrapper.find('.gallery-with-preview_Pager');
      
      while ($pagerElements.children('.gallery-with-preview_pagerElement').not('.wrap').length) {
        $pagerElements.children('.gallery-with-preview_pagerElement').not('.wrap').filter(':lt(' + slide_count + ')').wrapAll('<div>');
      }
    
    }); 
    
    if (block_wrapper.find('.gallery-with-preview_Slider').length) {
      block_wrapper.find('.gallery-with-preview_Slider').bxSlider({
        pagerCustom: '.gallery-with-preview_Pager',
        controls: false,
        touchEnabled: false,
        mode: 'fade'
      });
    }
    
    if (block_wrapper.find('.gallery-with-preview_Pager div').length>1){
    
      block_wrapper.find('.gallery-with-preview_Pager').owlCarousel({
        items:1,
        loop: true,
        nav: true,
        dots: false,
        navSpeed: 500
      });
    
    };
    
    resizeController([601, 950], function() {
    
      block_wrapper.find('.gallery-with-preview_Pager').owlCarousel({
        items:4,
        loop: true,
        nav: true,
        dots: false,
        navSpeed: 500
      });
    
    });
    
    resizeController([0, 600], function() {
    
      block_wrapper.find('.gallery-with-preview_Pager').owlCarousel({
        items:3,
        loop: true,
        nav: true,
        dots: false,
        navSpeed: 500
      });
    
    });
    
    block_wrapper.find(".gallery-with-preview_slider-wrap").lightGallery({
      thumbnail: false,
      download: true,
      loop: true,
      selector: '.gallery-with-preview_img a'
    }); 
    
    resizeController([951, Infinity], function() {
    
      block_wrapper.find('.gallery-with-preview_pagerElement').on(IOs ? "touchend" : "click", function(){
        block_wrapper.find('.gallery-with-preview_pagerElement').siblings().removeClass('shadow');
        $(this).addClass('shadow'); 
      });    
    
    });
    
    resizeController([0, 950], function() {
    
      block_wrapper.find('.gallery-with-preview_pagerElement').on(IOs ? "touchend" : "click", function(){
        block_wrapper.find('.owl-stage .gallery-with-preview_pagerElement').removeClass('shadow');
        $(this).addClass('shadow'); 
      });    
    
    });
  
  // Gallery with thumbnails slider end
  
  //TABS with slider BEGIN

     block_wrapper.find(".tabs-block_wrap_box").lightGallery({
        thumbnail: false,
        download: true,
        loop: true,
        selector: '.box-inner .img_wrap a'
    });
    
        

    $(function () {
        var tabsWrapWidth = block_wrapper.find('.tabs-block_wrap_tabs').width(),
            tabsWidth = 0;
            tabsCountTotal = 0;
            tabAverage = 0;
            tabsCountInWrap = 0;

        block_wrapper.find(".tabs-block_wrap_tabs li").each(function(){
            tabsCountTotal+=1;
            tabsWidth+=$(this).outerWidth();
        });
        tabAverage = tabsWidth/tabsCountTotal;
        tabsCountInWrap = Math.floor(tabsWrapWidth/tabAverage);

        if (tabsWrapWidth <= tabsWidth) {
            setTimeout(function () {
                block_wrapper.find('.tabs-block_wrap_tabs').slick({
                    infinite: false,
                    variableWidth: true,
                    slidesToShow: tabsCountInWrap
                });
            },500);
        }
    });

	//TABS with slider END
	
	
	//Contacts with map, text and image BEGIN

	      block_wrapper.find(".multy_offices_map_button").on(IOs ? "touchend" : "click", function(){
	        block_wrapper.find(".multy_offices_map-wrap").addClass("expand");
	      });
	  
	      block_wrapper.find(".multy_offices_map_close").on(IOs ? "touchend" : "click", function(){
	        block_wrapper.find(".multy_offices_map-wrap").removeClass("expand");
	      });
	  
	      $(this).keydown(function(eventObject){
	          if (eventObject.which == 27)
	            block_wrapper.find(".multy_offices_map-wrap").removeClass("expand");
	      });
	  
	      block_wrapper.find(".single-office_inner").lightGallery({
	        thumbnail: false,
	        download: true,
	        loop: true,
	        selector: '.single-office_picture'
	      }); 
	  
	  //Contacts with map, text and image END
	

	
	resizeController([650, Infinity], function() {
		setTimeout(function() {
			var mainDivs = block_wrapper.find(".multy_blocks_block-height"); 
			var maxHeight = 0;
			for (var i = 0; i < mainDivs.length; ++i) {
				if (maxHeight < $(mainDivs[i]).height()) { 
				maxHeight = $(mainDivs[i]).height(); 
			}
			}
			for (var i = 0; i < mainDivs.length; ++i) {
				$(mainDivs[i]).height(maxHeight); 
			}
		}, 100);
	});
	
	block_wrapper.find(".service-item").lightGallery({
		thumbnail: false,
		download: false,
		loop: false,
		selector: '.service-img a',
	});
		
		block_wrapper.find('.one-good-wrapper .good-desc-block .buy-good').on('click', function(){
			var $this = $(this),
				$thisTitle = $this.parents('.good-desc-block').find('.good-title').text(),
				interval;
			
			interval = setInterval(function(){
				var $target = $('.popover-body').find('.input-product_name input[type=text]');
				
				if ($target.length) {
					$target.val($thisTitle);
					clearInterval(interval);
				}
			}, 100);
		});
		
		block_wrapper.find('.one-good-icon__list .one-good-icon__buy').on('click', function(){
			var $this = $(this),
				$thisTitle = $this.parents('.one_good_wrap').find('.one-good-icon__title').text(),
				interval;
			
			interval = setInterval(function(){
				var $target = $('.popover-body').find('.input-product_name input[type=text]');
				
				if ($target.length) {
					$target.val($thisTitle);
					clearInterval(interval);
				}
			}, 100);
		});
		
		block_wrapper.find('.one-good-horizontal__wrapper .buy-good').on('click', function(){
			var $this = $(this),
				$thisTitle = $this.parents('.one-good-horizontal__wrapper').find('.good-title').text(),
				interval;
				
			interval = setInterval(function(){
				var $target = $('.popover-body').find('.input-product_name input[type=text]');
				
				if ($target.length) {
					$target.val($thisTitle);
					clearInterval(interval);
				}
			}, 100);
		});
		
		block_wrapper.find('.products--theme9 .button a').on('click', function(){
			var $this = $(this),
				$thisTitle = $this.parents('.product-inner').find('.name').text(),
				interval;
				
			interval = setInterval(function(){
				var $target = $('.popover-body').find('.input-product_name input[type=text]');
				
				if ($target.length) {
					$target.val($thisTitle);
					clearInterval(interval);
				}
			}, 100);
		});
		
		block_wrapper.find('.products-with-pic--theme9 .button a').on('click', function(){
			var $this = $(this),
				$thisTitle = $this.parents('.bottom-part').find('.title').text(),
				interval;
				
			interval = setInterval(function(){
				var $target = $('.popover-body').find('.input-product_name input[type=text]');
				
				if ($target.length) {
					$target.val($thisTitle);
					clearInterval(interval);
				}
			}, 100);
		});
		
		block_wrapper.find('.only-one-product .button a').on('click', function(){
			var $this = $(this),
				$thisTitle = $this.parents('.text-part').find('.title').text(),
				interval;
				
			interval = setInterval(function(){
				var $target = $('.popover-body').find('.input-product_name input[type=text]');
				
				if ($target.length) {
					$target.val($thisTitle);
					clearInterval(interval);
				}
			}, 100);
		});

		block_wrapper.find('.menu-button-two').on(IOs?'touchend':'click', function(){
			block_wrapper.find('.menu-fixed-two').addClass('animit').addClass('opened');
			$html.addClass('overflowHidden');
		});

		block_wrapper.find('.menu-close-two').on(IOs?'touchend':'click', function(){
			block_wrapper.find('.menu-fixed-two').removeClass('opened');
			$html.removeClass('overflowHidden');
		});

		$doc.on(IOs?'touchend':'click', function(e){
			if( $(e.target).closest('.menu-button-two, .menu-fixed-two, .popover-body').length) return;

			block_wrapper.find('.menu-fixed-two').removeClass('opened');
			$html.removeClass('overflowHidden');
		});

		if ($htmlLang=='de' || $htmlLang=='en') {
			timerDays = 'days';
			timerHours = 'hours';
			timerMinutes = 'minutes';
			timerSeconds = 'seconds'
		} else if ($htmlLang=='es') {
			timerDays = 'dias';
			timerHours = 'horas';
			timerMinutes = 'minutos';
			timerSeconds = 'segundos'
		} else {
			timerDays = 'Дни';
			timerHours = 'чаcы';
			timerMinutes = 'минуты';
			timerSeconds = 'секунды'
		}

		block_wrapper.find('table').wrap('<div class="table-wrapper"></div>');
                
                
                block_wrapper.find('.arrow-down').on(IOs ? "touchend" : "click", function(){
                    var blockPosition = $(this).closest('.sale-block-two, .sale-block-three').offset().top,
	            blockHeight = $(this).closest('.sale-block-wrapper').height(),
	            newScroll = blockPosition + blockHeight;
				
	            $('html, body').animate({
	            scrollTop: newScroll
	            }, 850);
			
                });


		setTimeout(function() {
            block_wrapper.find('[data-api-type=popup-form]').on(clickEvent, function(e) {
                var $this = $(this);

                if (myo.show) {
                    myo.show({
                        json: $this.data('api-url'),
                        onContentLoad: function(w) {
                            s3LP.initForms($(this.bodyDiv));
                        },
                        afterOpen: function() {
                        	$('html').addClass('overflowHidden');
                        	if (iOs) {
                        		$('body').addClass('overflowHidden')
                        	}
                        },
                        afterClose: function() {
                            $('html, body').removeClass('overflowHidden');
                        }
                    });
                } else if (myo.open) {
                    myo.open({
                        json: $this.data('api-url'),
                        onLoad: function(w) {
                            s3LP.initForms($(this.bodyDiv));
                        },
                        afterOpen: function() {
                        	$('html').addClass('overflowHidden');
                        	if (iOs) {
                        		$('body').addClass('overflowHidden')
                        	}
                        },
                        afterClose: function() {
                            $('html, body').removeClass('overflowHidden');
                        }
                    });
                }
                e.preventDefault();
            });
        }, 200);

        block_wrapper.find('.gallery-inline').lightGallery({
			selector: '.item .pic a',
			thumbnail: false,
			download: false
		});

		function setEqualHeight(columns) {
		    var tallestcolumn = 0;
		    columns.removeAttr('style');
		    columns.each(function(){
		        currentHeight = $(this).height();
		            if(currentHeight > tallestcolumn) {
		                tallestcolumn = currentHeight;
		            }
		        }
		    );
		    columns.height(tallestcolumn);
		};

		resizeController([980, Infinity], function() {
		    setTimeout(function(){
		        setEqualHeight($(".tariffs_wrapper .tariff .text"));
		        setEqualHeight($(".tariffs_wrapper .tariff .title"));
		        setEqualHeight($(".tariffs_wrapper .tariff .price_wr .pr_title"));
		        setEqualHeight($(".tariffs_wrapper .tariff .price_wr"));
		    }, 300);
		});

                block_wrapper.on('click','.accordion .item .title', function(){
	            $(this).toggleClass('opened');
	            $(this).next().slideToggle();
                });
	

       setTimeout(function(){
            block_wrapper.find('.tariffs_wrapper .tariff .text').equalHeightResponsive();
		    block_wrapper.find('.tariffs_wrapper .tariff .title').equalHeightResponsive();
		    block_wrapper.find('.tariffs_wrapper .tariff .price_wr .pr_title').equalHeightResponsive();
            block_wrapper.find('.tariffs_wrapper .tariff .price_wr').equalHeightResponsive();
            block_wrapper.find('.clients_slider .cl_item').equalHeightResponsive();
        },150);
        
        /* blocksMatchHeight */
		
		function blocksMatchHeight(arr) {
			for (var i = 0; i< arr.length; i++) {
				block_wrapper.find(arr[i]).matchHeight();
			}
		}
		
		var allignBlocks = function(){
			blocksMatchHeight([
				'.products-with-pic--theme9 .product .bottom-part .title',
				'.products-with-pic--theme9 .product .bottom-part .text',
				'.tariff-blocks_block-height',
				'.txt_bl3_wrapper_txt_item_text'
			]);	
		}
		
		allignBlocks();

		block_wrapper.find('.burger_button').on('click', function(menu){
			block_wrapper.find('.menuDesktop').addClass('animit opened');
			$('html').addClass('overFlow');
		});

		block_wrapper.find('.menu_close').on('click', function(menu){
			block_wrapper.find('.menuDesktop').removeClass('opened');
			$('html').removeClass('overFlow');
		});

		$(document).on('click touchstart', function(menu){
		    if( $(menu.target).closest('.burger_button').length || $(menu.target).closest('.menuDesktop').length)
		      return;
		    block_wrapper.find('.menuDesktop').removeClass('opened');
			$('html').removeClass('overFlow');
		});

        if (block_wrapper.find('.menuDesktop__menuTop li').length < 1) {
            block_wrapper.find(".menu_wrapper_wr").hide();
            block_wrapper.find(".burger_button").hide();
        } else {
            block_wrapper.find(".menu_wrapper_wr").show();
            block_wrapper.find(".burger_button").show();
        };

		block_wrapper.find('.dropdown-wrap').prepend('<span></span><span></span><span></span>');

		$(window).resize(function() {
			block_wrapper.find('.dropdown-wrap').prepend('<span></span><span></span><span></span>');
		});

		$(function(){
			block_wrapper.find('.time').timer({
				format_in : '%d.%M.%y %h:%m',
				format_out:'<div class="timePart">%d<span>' + timerDays + '</span></div><span class="colon">:</span><div class="timePart">%h<span>' + timerHours + '</span></div><span class="colon">:</span><div class="timePart">%m<span>' + timerMinutes + '</span></div><span class="colon">:</span><div class="timePart">%s<span>' + timerSeconds + '</span></div>',
				onEnd: function() {
					$(this).hide();
	                block_wrapper.find(".topBlock__countdownBlock .timeBlock").hide();
				}
			});
		});

		$(function(){
			block_wrapper.find('.timer2').timer({
				format_in : '%d.%M.%y %h:%m',
				format_out:'<div class="timePart">%d<span>' + timerDays + '</span></div><span class="colon">:</span><div class="timePart">%h<span>' + timerHours + '</span></div><span class="colon">:</span><div class="timePart">%m<span>' + timerMinutes + '</span></div><span class="colon">:</span><div class="timePart">%s<span>' + timerSeconds + '</span></div>',
				onEnd: function() {
					$(this).hide();
	                block_wrapper.find(".bot_timer_title").hide();
				}
			});
		});

		/* TARIFFS SLIDER */
		
		var tariffSlider = block_wrapper.find('.tariffs'),
			tariffSliderParent = tariffSlider.closest('.tariffs_wrapper');
			
		if (!tariffSliderParent.data('noinit')) {
			resizeController([0, 979], function() {
				if (block_wrapper.find('.tariffs .tariff').length>1){
				    tariffSlider.owlCarousel({
				        loop: true,
				        margin: 20,
				        nav: true,
				        dots: true,
				        smartSpeed: 600,
				        center:true,
				        items: 3,
				        autoWidth:true,
				        autoplay: block_wrapper.find('.tariffs[data-loop="false"]').length ? false : true,
				        autoHeight : false,
				        responsive:{
						    0:{
						    	margin: 7
						    },
	
						    380:{
						    	margin: 20
						    }
						  }
				    });
				};
			});
	
			resizeController([980, Infinity], function() {
				tariffSlider.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
				tariffSlider.find('.owl-stage-outer').children().unwrap();
			});
		}

		/* CLIENTS SLIDER */

		if (block_wrapper.find('.clients_slider .cl_item').length>1){
		    block_wrapper.find('.clients_slider').owlCarousel({
		        loop: true,
		        margin: 0,
		        nav: true,
		        dots: false,
		        smartSpeed: 600,
		        autoplay:true,
		        autoHeight : false,
		        responsive:{
				    0:{
				    	items: 1
				    },

				    480:{
				    	items: 2
				    },
				    700:{
				    	items: 3
				    },
				    980:{
				    	items: 4
				    }
				}
		    });
		};

		/* REVIEWS SLIDER */

		(function(){
			var reviews_slider = block_wrapper.find('.rev_slider');

			if (reviews_slider.length) {
				reviews_slider.each(function(){
					var $this = $(this),
						$thisSlidesCount = $this.find('.rev_slide').length,
						thisAutoplay = $this.data('autoplay'),
						thisSpeed = $this.data('speed'),
						thisPause = $this.data('pause');

					if ($thisSlidesCount > 1) {
						$this.owlCarousel({
							loop: true,
							margin: 0,
							nav: true,
							dots: true,
							smartSpeed: thisSpeed ? thisSpeed : 600,
							autoplay: thisAutoplay ? true : false,
							autoplayTimeout: thisPause ? thisPause : 5000,
							autoHeight : false,
							responsive:{
								0:{
									items: 1,
									autoHeight : true,
								},
								769:{
									items: 1,
									autoHeight : false
								}
							}
						});
					}
				});
			}

		})();

		if (block_wrapper.find('.rev_slider .rev_slide').length>1){
		    block_wrapper.find('.rev_slider').owlCarousel({
		        loop: true,
		        margin: 0,
		        nav: true,
		        dots: true,
		        smartSpeed: 600,
		        autoplay: false,
		        autoHeight : false,
		        responsive:{
				    0:{
				    	items: 1,
				    	autoHeight : true,
				    },
				    769:{
				    	items: 1,
				    	autoHeight : false
				    }
				}
		    });
		};

		/* REVIEWS SLIDER */
		
		(function(){
			var teamSlider = block_wrapper.find('.team_slider');
			
			if (teamSlider.length) {
				teamSlider.each(function(){
					var $this = $(this),
						thisSlidesItems = $this.find('.t_slide').length;
						
					if (thisSlidesItems > 1) {
						$this.owlCarousel({
					        loop: true,
					        margin: 0,
					        nav: false,
					        dots: true,
					        items: 4,
					        smartSpeed: 600,
					        autoplay:true,
					        autoHeight : false,
					        responsive:{
							    0:{
							    	items: 1
							    },
			
							    480:{
							    	items: 2
							    },
							    640:{
							    	items: 3
							    },
							    980:{
							    	items: 4
							    }
							}
					    });
					}
				});
			}
		})();
		
		(function(){
			var sertBlock = block_wrapper.find('.sert_block-two');
		
			if (sertBlock.length) {
				sertBlock.each(function(){
					var $this = $(this),
						thisSlidesLength = $this.find('.sert').length;
		
					if (thisSlidesLength > 1) {
						$this.owlCarousel({
						    loop: false,
						    nav: false,
						    dots: true,
						    smartSpeed: 600,
						    autoplay:true,
						    responsive:{
							    0:{
							    	margin: 17,
							    	items: 3,
							    	autoWidth: true,
							    	center: true
							    },
		
							    480:{
							    	items: 2,
							    	margin: 15,
							    	autoWidth: false,
							    	center: false
							    },
		
							    640:{
							    	items: 3,
							    	margin: 16
							    },
		
							    768:{
							    	items: 4,
							    	margin: 20
							    },
							    
							    940:{
							    	items: 5,
							    	margin: 20
							    }
							  }
						});
					}
				});
			}
		})();

		/* SERTIFICATES SLIDER */

		resizeController([0, 979], function() {
			if (block_wrapper.find('.sert_block .sert').length>=1){
			    block_wrapper.find('.sert_block').owlCarousel({
			        loop: false,
			        nav: true,
			        dots: true,
			        smartSpeed: 600,
			        autoplay:true,
			        autoHeight : true,
			        responsive:{
					    0:{
					    	margin: 17,
					    	items: 3,
					    	autoWidth: true,
					    	center: true
					    },

					    480:{
					    	items: 2,
					    	margin: 15,
					    	autoWidth: false,
					    	center: false
					    },

					    640:{
					    	items: 3,
					    	margin: 16
					    },

					    768:{
					    	items: 4
					    }
					  },
					onInitialized : function() {
						block_wrapper.find('.sert_wrap').lightGallery({
							selector: '.owl-item > div > a',
							thumbnail: false,
							download: false
						});
					}
			    });
			};
		});
		
	
		(function(){
			var reviewsSlider = block_wrapper.find('.reviews-and-feedback_inner');
			
			if (reviewsSlider.length) {
				reviewsSlider.each(function(){
					var $this = $(this),
						thisSlidesLength = $this.find('.reviews-and-feedback-item').length;
						
					if (thisSlidesLength > 1) {
						$this.owlCarousel({
							items:1,
							loop: true,
							nav: true,
							dots: false,
							navSpeed: 500
						});
					}
				});
			}
		})();

		block_wrapper.find('.show-map').on(IOs?'touchend':'click', function(event){
			event.preventDefault();
			$(this).next('.map-inner').addClass('fixed');
			$('html').addClass('overflowHidden');
		});
		
		block_wrapper.find('.all-map a').on(IOs?'touchend':'click', function(event){
			event.preventDefault();
			$(this).closest('.map-with-contacts-wrapper').find('.map-fixed').addClass('fixed');
			$('html').addClass('overflowHidden');
			$(window).trigger('resize');
		});
		
		block_wrapper.find('.close-map').on(IOs?'touchend':'click', function(event){
			block_wrapper.find('.map-inner').removeClass('fixed');
			$('html').removeClass('overflowHidden');
		});
		
		block_wrapper.find('.close-map2').on(IOs?'touchend':'click', function(event){
			block_wrapper.find('.map-fixed').removeClass('fixed');
			$('html').removeClass('overflowHidden');
		});

		resizeController([980, Infinity], function() {
			block_wrapper.find('.sert_block').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
			block_wrapper.find('.sert_block').find('.owl-stage-outer').children().unwrap();

            block_wrapper.find('.sert_wrap').lightGallery({
			    selector: 'div > a',
			    thumbnail: false,
					download: false
			});
		});

		/* GALLERY SLIDER */

		resizeController([0, 767], function() {

			block_wrapper.find('.gallery_but.inner').remove();

			if (block_wrapper.find('.gallery_block .gallery_pic').length>=1){
			    block_wrapper.find('.gallery_block').owlCarousel({
			        loop: true,
			        nav: true,
			        dots: true,
			        autoWidth: true,
			        smartSpeed: 600,
			        items: 3,
			        autoplay:true,
			        autoHeight : true,
			        center: true,
			        responsive:{
					    0:{
					    	margin: 10
					    },

					    480:{
					    	margin: 16
					    }
					},
					onInitialized : function() {
						block_wrapper.find('.gallery_block').lightGallery({
							selector: '.owl-item > div > a',
							thumbnail: false,
							download: false
						});
					}
			    });
			};
		});

		resizeController([768, Infinity], function() {
			block_wrapper.find('.gallery_block').trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
			block_wrapper.find('.gallery_block').find('.owl-stage-outer').children().unwrap();

			block_wrapper.find('.gallery_block').lightGallery({
				selector: 'div.gallery_pic > a',
				thumbnail: false,
				download: false
			});
		});
		
		function blocksMatchHeight(arr) {
			for (var i = 0; i< arr.length; i++) {
				block_wrapper.find(arr[i]).matchHeight();
			}
		}
		
		blocksMatchHeight(['.horizontal_blocks .service-item .service-desc-block .service-title', '.horizontal_blocks .service-item .service-desc-block .service-desc']);
	}

	function coords(str) {
		return str.split(',');
	}

	function init(options) {
		options.center = coords(options.center);

		$.each(options.data, function(key, item) {
			item.coords = coords(item.coords);
		});

		if (options.type == 'google') {

			google.maps.event.addDomListener(window, 'load', function() {

				var map = new google.maps.Map(document.getElementById(options.id), {
					zoom: parseInt(options.zoom),
					scrollwheel: false,
					mapTypeId: options.mapTypeId ? options.mapTypeId : "roadmap",
					center: new google.maps.LatLng(options.center[0], options.center[1])
				});

				$(window).resize(function(){
					google.maps.event.trigger(mjsMap, 'resize');
					
					$('#' + options.id).parent().find('.close-map').on('click', function(event){
						google.maps.event.trigger(mjsMap, 'resize');
					});
					
					$('#' + options.id).parent().find('.close-map2').on('click', function(event){
						google.maps.event.trigger(mjsMap, 'resize');
					});
				});

				$('.all-map a').on('click', function(event){
					setTimeout(function(){
						google.maps.event.trigger(mjsMap, 'resize');
					}, 100);
				});

				$.each(options.data, function(key, item) {

					var marker = new google.maps.Marker({
						position: new google.maps.LatLng(item.coords[0], item.coords[1]),
						map: map,
						title: item.name
					});

					var infowindow = new google.maps.InfoWindow({
						content: '<div class="baloon-content">' +
									'<h3 style="margin: 0; padding-bottom: 3px;">' + item.name + '</h3>' +
									item.desc +
								 '</div>'
					});

					google.maps.event.addListener(marker, 'click', function() {
						infowindow.open(map, marker);
					});

				});
			});

		} else {

			ymaps.ready(function() {

				var map = new ymaps.Map(options.id, {
					center: options.center,
					zoom: options.zoom,
					behaviors: [options.behaviors , 'drag', 'rightMouseButtonMagnifier'],
				});

				map.controls.add(
					new ymaps.control.ZoomControl()
				);

				$(window).resize(function(){
					map.container.fitToViewport();
					
					$('#' + options.id).parent().find('.close-map').on('click', function(event){
						map.container.fitToViewport();
					});
					
					$('#' + options.id).parent().find('.close-map2').on('click', function(event){
						map.container.fitToViewport();
					});
				});

				var MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
					'<div class="baloon-content" style="padding: 0 10px;">' +
						'<h3 style="margin: 0;">$[properties.name]</h3>' +
						'<p>$[properties.desc]</p>' +
					'</div>'
				);

				var myCollection = new ymaps.GeoObjectCollection();

				$.each(options.data, function(key, item) {
					myCollection.add(new ymaps.Placemark(
						item.coords,
						item,
						{balloonContentLayout: MyBalloonContentLayoutClass}
					));
				});

				map.geoObjects.add(myCollection);

			});
		}
	}

	window.mjsMap = init;

})(jQuery);