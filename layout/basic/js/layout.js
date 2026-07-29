window.addEventListener('load', function(){
	bottomNav();
    fixedHeader();
    handleNav();
    //quickGoTop(); 사용안함 210805 서정환 수정
    //searchLayer(); 사용안함 210804 서정환 수정
    //toggleClass('.xans-layout-info.info__customer', '.xans-layout-info.info__customer .toggle', 'selected'); 사용안함 210805 서정환 수정
    //topBanner(); 사용안함 210804 서정환 수정
	handleScroll();
});

function handleScroll(){
	var scrollPosition = 0;
	var ticking = false;
	var quickMenu = document.querySelector('#quick');
	var scrollY = window.scrollY || window.pageYOffset;
	//setQuickScrollEvent(scrollY, quickMenu); 사용안함 210805 서정환 수정
	window.addEventListener('scroll', function(e) {
        scrollPosition = window.scrollY || window.pageYOffset;
        if (ticking) return;
        window.requestAnimationFrame(function() {
            fixedHeader()
            //setQuickScrollEvent(scrollPosition, quickMenu) 사용안함 210805 서정환 수정
            ticking = false;
        });
        ticking = true;
	});
}

function toggleClass(element, handler, className){
	var _handler = document.querySelector(handler);
	var _element = document.querySelector(element);

    _handler.addEventListener('click', function(){
        if ( _element.classList.contains(className) ) {
            _element.classList.remove( className );
        } else {
            _element.classList.add( className );
        }
    });
}

function fixedHeader() { // 210804 서정환 수정
    var header = document.getElementById("header");
	var fixed_margin = document.getElementById("contents");
	var scrollY = window.pageYOffset || document.documentElement.scrollTop;
	var header_height = document.getElementById("header").scrollHeight+'px';

	if(scrollY > header.offsetTop) {
        header.classList.add("fixed");
		fixed_margin.style.marginTop  = header_height;
    } else {
        header.classList.remove("fixed");
		fixed_margin.style.marginTop  = '0px';
    }
}

function handleNav() {
    var btnNavs = document.querySelectorAll('.eNavFold');
    var btnClose = document.querySelector('#aside .btnClose');
    var dimmed = document.querySelector('#layoutDimmed');
    var elements = document.getElementsByClassName("test");
    btnNavs.forEach( function(btnNav) {
        btnNav.addEventListener('click', function(){
            document.body.classList.add('expand');
        });
    });
    btnClose.addEventListener('click', function(){
        document.body.classList.remove('expand');
    });
    handleDimmed(dimmed, document.body, 'expand');
}


function searchLayer() {
    var btnSearchs = document.querySelectorAll('.eSearch');
    var btnClose = document.querySelector('.xans-layout-searchheader  .btnClose');
    btnSearchs.forEach( function(btnSearch) {
        btnSearch.addEventListener('click', function(){
            document.body.classList.add('searchExpand');
            var input = document.querySelector('#keyword');
            input.focus();
        });
    });
    btnClose.addEventListener('click', function(){
        document.body.classList.remove('searchExpand');
    });
    var dimmed = document.querySelector('#layoutDimmed');
    handleDimmed(dimmed, document.body, 'searchExpand');
}

function handleDimmed(target, element, className){
    target.addEventListener('click', function(){
        element.classList.remove(className);
    });
}

function bottomScroll(){
    var lastScrollTop = 0;
    var delta = 5;
    var fixBox = document.querySelector('.bottom-nav__top');
    var fixBoxHeight = fixBox.offsetHeight;
    var didScroll;

    window.onscroll = function(e) {
        didScroll = true;
    };

    setInterval(function(){
        if(didScroll){
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled(){
        var nowScrollTop = window.scrollY;
        if(Math.abs(lastScrollTop - nowScrollTop) <= delta){
            return;
        }
        if(nowScrollTop > lastScrollTop && nowScrollTop > fixBoxHeight){
            //Scroll down
            var scrollTop = window.scrollTop();
            var innerHeight = window.innerHeight();
            var scrollHeight = $('body').prop('scrollHeight');
            if (scrollTop + innerHeight >= scrollHeight) {
                fixBox.classList.add('bottom-nav--hide');
                return true;
            }
        }else{
            if(nowScrollTop + window.innerHeight < document.body.offsetHeight){
                //Scroll up
                fixBox.classList.remove('bottom-nav--hide');
            }
        }
        lastScrollTop = nowScrollTop;
    }
}

function bottomNav(){
    var lastScrollTop = 0;
    var btnTop = document.querySelector('.bottom-nav__top');
    var fixedButton = document.getElementById("orderFixArea");
    if(fixedButton){
        document.body.classList.add("button--fixed");
    };

	window.addEventListener("scroll", function(){
		var scroll = window.pageYOffset || document.documentElement.scrollTop;
        var nav = document.querySelector('.bottom-nav');
		if (scroll > lastScrollTop){
			nav.classList.add('bottom-nav--hide');
		} else {
			nav.classList.remove('bottom-nav--hide');
		}
		// scroll bottom
		if(scroll === document.body.scrollHeight - document.documentElement.offsetHeight){
			nav.classList.remove('bottom-nav--hide');
		}
		lastScrollTop = scroll <= 0 ? 0 : scroll;

        // top button
        var currentScrollPercentage = getCurrentScrollPercentage();
        if(currentScrollPercentage > 30){
        	btnTop.classList.add('bottom-nav__top--show');
        } else {
			btnTop.classList.remove('bottom-nav__top--show');
        }
	});

    btnTop.addEventListener('click', function(){
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
    });
}

function getOffset(element){
    if (!element.getClientRects().length)
    {
      return { top: 0, left: 0 };
    }

    var rect = element.getBoundingClientRect();
    var win = element.ownerDocument.defaultView;
    return (
    {
      top: rect.top + win.pageYOffset,
      left: rect.left + win.pageXOffset
    });
}

function getQuickPosition(){
	var role = document.querySelector("meta[name='path_role']").getAttribute('content');
	if (role === "MAIN") {
		return getMainQuickPosition();
	} else {
		return getSubQuickPosition();
	}
}

function getMainQuickPosition(){
	var quickMenu = document.querySelector('#quick');
	var collection = document.querySelector('.collection');
	var snsItem = document.querySelector('.snsItem');

	var mainTopSpace = 115;
	var mainFooterSpace = 34;

	var top = collection.offsetTop + collection.clientHeight + mainTopSpace;
    var footTop = getOffset(snsItem).top + mainFooterSpace;
	var maxY = footTop - quickMenu.offsetHeight;

	return [top, maxY]
}

function getSubQuickPosition(){
	var quickMenu = document.querySelector('#quick');
	var footer = document.querySelector("#footer");

	var footerSpace = 60;
	var top = 284;
    var footTop = getOffset(footer).top;
	var maxY = footTop - quickMenu.offsetHeight - footerSpace;

	return [top, maxY]
}

function setQuickScrollEvent(y, quick){
	var header = document.querySelector('#header');
	var position = getQuickPosition();
	var scrollY = y;
	if (scrollY >= position[0] - header.offsetHeight){
		if (scrollY < position[1]) {
			quick.classList.add('fixed');
			quick.removeAttribute('style');
        } else {
			quick.classList.remove('fixed');
			quick.style.position = 'absolute';
			quick.style.top = position[1] + 'px';
        }
	} else {
		quick.style.top = position[0] + 'px';
        quick.classList.remove('fixed');
    }
}

function quickGoTop(){
    var btnTop = document.querySelector('#quick .pageTop');
	btnTop.addEventListener('click', function(){
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
    });
}

function topBanner(){
    var banner = document.querySelector('#topBanner');
    if(!banner) return;
    var btnClose = banner.querySelector('.btnClose');
    btnClose.addEventListener('click', function(){
        banner.classList.add("hidden");
    });
}


function getCurrentScrollPercentage(){
	return (window.scrollY + window.innerHeight) / document.body.clientHeight * 100
}


jQuery(document).ready(function() {

	/* 카테고리가 대량일때 나머지 숨김
	jQuery("#header .inner .top_nav_box .top_category").each(function(){
		var top_category_length = jQuery(' > ul > li',this).length;
		if ( top_category_length > 20 ) {
			jQuery(this).append('<div class="cate_more"></div>');
		}
		jQuery(' > ul > li:lt(20)',this).show();
	}); */

	/* 카테고리가 대량일때 이상일때 출력버튼
	jQuery("#header .inner .top_nav_box .top_category .cate_more").click(function() {
		var cate_more_on = jQuery(this).hasClass('on');
		if ( cate_more_on == false )  {
			jQuery('#header .inner .top_nav_box .top_category > ul > li').show();
			jQuery('#header .inner .top_nav_box .top_category .cate_more').addClass("on");
		} else {
			jQuery('#header .inner .top_nav_box .top_category .cate_more').removeClass("on");
			jQuery('#header .inner .top_nav_box .top_category > ul > li').hide();
			jQuery('#header .inner .top_nav_box .top_category > ul > li:lt(20)').show();
		}
	}); */

	/* 최상단배너 하루동안 닫기 - 서정환 */
    jQuery(".main_top_banner .top_banner_box_inner .top_banner_close .icon").bind("click", function() {
		if(jQuery("#top_banner_box_cloase").is(":checked")){
			jQuery(".main_top_banner").slideUp("fast");
			setCookiem("top_banner_cookie", "top_banner_cookie", 1);
		 } else {
			jQuery(".main_top_banner").slideUp("fast");
		 }
    });
	var main_top_banner_diplay = jQuery(".main_top_banner").attr("data-ez-display");
	if (!getCookiem("top_banner_cookie") && (main_top_banner_diplay == 'visible')) {
		jQuery(".main_top_banner").slideDown("fast");
	}

	/* 최상단배너 닫기버튼 없을시 높이 수정 */
	if(jQuery(".top_banner_close").css("display") == "none"){
		jQuery(".main_top_banner").addClass('close_none');
		if (main_top_banner_diplay == 'visible') {
			jQuery(".main_top_banner").slideDown("fast");
		}
	}

	/* 상단 고객센터 - 서정환 */
	jQuery("#header .inner .toparea .toparea_state .toparea_state_board").click(function() {
		var theme_cl = jQuery(this).attr('class');
		jQuery(this).toggleClass('on');
	});

	/* 상단검색 팝업 - 서정환 */
	jQuery('#header .inner .top_nav_box .top_mypage .eSearch, .bottom-nav__tabBar li .eSearch').bind("click", function() {
		jQuery(".xans-layout-searchheader").css('display', 'block');
		jQuery("#layer_shadow").addClass('on');
		jQuery('body').addClass('not_scroll').bind('scroll touchmove mousewheel', function(e){ // 브라우저 스크롤막기
			e.preventDefault();
			e.stopPropagation();
			return false;
		});
	})
	jQuery('.xans-layout-searchheader .btnClose').bind("click", function() {
		jQuery(".xans-layout-searchheader").css('display', 'none');
		jQuery("#layer_shadow").removeClass('on');
		jQuery('body').removeClass('not_scroll').unbind('scroll touchmove mousewheel'); // 브라우저 스크롤풀기
	})

	/* 하단 정보 접었다 펴기 */
	jQuery('.bt_top  .bt_dummy').click(function(){
		jQuery(this).prev().toggleClass('open');
		if(jQuery(this).prev().hasClass('open')){
			jQuery(this).next().slideDown();
		} else {
			jQuery(this).next().slideUp();
		}
	})

	/* 로그인폼 placeholder 추가 - 서정환 */
	if (jQuery('.xans-member-login').val() != undefined) {
		jQuery('#member_passwd').attr('placeholder', '비밀번호');
	}

	/* 비회원 주문조회페이지 placeholder 추가 - 서정환 */
	setTimeout(function(){
		if (jQuery('.xans-myshop-orderhistorynologin').val() != undefined) {
			jQuery('#order_name').attr('placeholder', '주문자명');
			jQuery('#order_id').attr('placeholder', '주문번호(하이픈(-) 포함)');
			jQuery('#order_password').attr('placeholder', '비회원주문 비밀번호');
		}
	}, 100);

	/* 검색페이지 인풋박스에서 텍스트 삭제 - 서정환 */
	jQuery('#ec-product-searchdata-searchkeyword_form').find('button.btnDelete').bind('click', function() {
		jQuery('#ec-product-searchdata-keyword').val('').focus();
	});

	/* 검색페이지 정렬 텍스트 변경 */
	jQuery("#order_by").each(function(){
		jQuery('option:first-child', this).text('- 정렬방식 -');
	});

	/* 멀티샵 없을경우 숨김 */
	jQuery(".xans-layout-multishoplist").each(function(){
		var multishoplist_count = jQuery('li', this).length;
		if ( multishoplist_count == 1 ) {
			jQuery(this).hide();
		}
	});

	/* 하단 에스크로 사용하면 출력 */
	jQuery("#footer .inner .bt_escrow").each(function(){
		var bt_escrow = jQuery(this).attr("data-ez-escrow");
		if ( !bt_escrow == '' ) {
			var bt_escrow_name = jQuery("a img[data-ez-escrow-id="+ bt_escrow +"]", this).addClass('on');
			jQuery(this).css('display','flex');
		}
	});

	/* 로그인페이지 SNS 사용하면 출력 */
	jQuery(".xans-member-login .login__sns .wrap_sns_log a").each(function(){
		var wrap_sns_log = jQuery(this).hasClass('displaynone');
		if( wrap_sns_log == false){
			jQuery(".xans-member-login .login__sns").css('display','block');
		}
	});

	/* 모바일에서 쇼핑큐레이션 */
	jQuery('#shoppQbtn').click(function(){
		if (jQuery("#searchContent.xans-product-searchdata").is(":hidden")) {
			jQuery('#searchContent.xans-product-searchdata').slideDown('normal');
			jQuery(this).text('상세검색 닫기');
			jQuery(this).css('margin-top','0');
		} else {
			jQuery('#searchContent.xans-product-searchdata').slideUp('normal');
			jQuery(this).text('상세검색');
		}
	});

	/* 모바일에서 쇼핑큐레이션 없을시 버튼 숨김 */
	jQuery("#searchContent").each(function(){
		var prdCount_count = jQuery("#ec-searchdata-area", this).length;
		if ( prdCount_count == '0' ) {
			jQuery('#shoppQbtn').hide();
		}
	});

	/* 마이페이지 나의게시글 없을때 메시지 표시 */
	jQuery(".xans-myshop-boardpackage").each(function(){
		var boardlist = jQuery(".xans-myshop-boardlist table", this).length;
		if ( boardlist == '0' ) {
			jQuery('.myshop_boardlist_empty').css('display','flex');
		}
	});

	/* 더보기 클릭시 */
	jQuery('.btnMore').click(function(){
		setTimeout(function(){
			ifmore();
		},600)
	});
	setTimeout(function(){
		ifmore();
	},300)

	/* 상단 카테고리 변경 감지 */
	top_category(); // 상단카테고리
	observeTopCategory(); // 상단카테고리 변경 감지

	/* 기획전 레이아웃변경에 따른 타겟고정위치 변경 */
	var header_height = document.getElementById("header").scrollHeight;
	jQuery('.xans-project-list h3 span').css('top',-header_height+20);
});

/* 상단 카테고리 변경 감지 */
function observeTopCategory(){
	var targetNode = jQuery('#header .xans-layout-category > ul')[0];

	// MutationObserver 인스턴스 생성
	var observer = new MutationObserver(function(mutationsList, observer) {
			// 변경 감지된 경우 상단카테고리 실행
			top_category();
	});

	// 상단 카테고리가 있는 경우 변경 감지
	if (targetNode) {
			observer.observe(targetNode, { childList: true, subtree: true });
	}
}

/* 상단 카테고리 */
function top_category(){
	/* 상단카테고리 */
	jQuery('#header .top_category li').mouseenter(function(e) {
		var $this = jQuery(this).addClass('on')
	}).mouseleave(function(e) {
		jQuery(this).removeClass('on');
	});

	/* 상단카테고리 중분류체크 */
	jQuery('#header .top_category ul.sub_cate01 li').each(function() {
		if (jQuery(this).children('ul').length == 0) {
			jQuery(this).addClass('noChild');
		}
	});
}

/* 최상단배너 쿠키 스크립트 - 서정환 */
function setCookiem(cookie_name, cookie_value, expire_date) {
    var today = new Date();
    var expire = new Date();
    expire.setTime(today.getTime() + 3600000 * 24 * expire_date);
    cookies = cookie_name + '=' + cookie_value + '; path=/;';
    if (expire_date != 0) cookies += 'expires=' + expire.toGMTString();
    document.cookie = cookies;
}

function delCookiem(cookie_name) {
	var _today = new Date();
	var value = '';
	_today.setDate(_today.getDate() - 1);
	document.cookie = cookie_name + "=" + value + '; path=/;' + "; expires=" + _today.toGMTString();
}

function getCookiem(name) {
    lims = document.cookie;
    var index = lims.indexOf(name + "=");
    if (index == -1) {
        return null;
    }
    index = lims.indexOf("=", index) + 1; // first character
    var endstr = lims.indexOf(';', index);
    if (endstr == -1) {
        endstr = lims.length; // last character
    }
    return unescape(lims.substring(index, endstr));
}

/* 더보기 클릭시 */
function ifmore(){
	/* 상품 썸네일 관심상품 출력 & 숨김 */
	setTimeout(function(){
		jQuery('.ec-base-product .prdList .icon__box .wish').each(function(){
			var isstatus = jQuery(this).children('img').attr('icon_status');
			if ( isstatus == 'on' ) {
				jQuery(this).addClass('on');
			}
		});
		jQuery('.ec-base-product .prdList .icon__box .wish').click(function(){
			var isstatus = jQuery(this).children('img').attr('icon_status');
			if ( isstatus == 'off' ) {
				jQuery(this).addClass('on');
			} else {
				jQuery(this).removeClass('on');
			}
		});
	},200)
	jQuery('.ec-base-product .prdList > li').each(function(){
		/* 상품진열 장바구니 사용안할시 숨김 */
		if (jQuery(".icon__box .cart > .ec-admin-icon", this).length == 1) {
		} else {
			jQuery('.icon__box .cart', this).hide();
		}
		/* 상품진열 옵션미리보기 사용안할시 숨김 */
		if (jQuery(".icon__box .option > a", this).length == 1) {
		} else {
			jQuery('.icon__box .option', this).hide();
		}
		/* 상품진열 관심상품 사용안할시 숨김 */
		if (jQuery(".icon__box .wish > .ec-product-listwishicon", this).length == 1) {
		} else {
			jQuery('.icon__box .wish', this).hide();
		}
	});
}


  // ── 탭 전환 + 스크롤 ──
  const tabs = document.querySelectorAll('.ap-tabs');
  tabs.forEach(tab => {
    const buttons = tab.querySelectorAll('.ap-tabs__item');
    const list = tab.querySelector('.ap-tabs__list');

    // 로드 시 활성 탭을 애니메이션 없이 즉시 가운데로 정렬
    const centerActiveOnLoad = () => {
      if (!list) return;
      // is-active가 붙은 아이템, 또는 부모(li 등)에 selected 클래스가 붙은 아이템을 찾음
      const activeBtn = tab.querySelector('.ap-tabs__item.is-active')
        || tab.querySelector('.selected .ap-tabs__item');
      if (!activeBtn) return;

      const prevBehavior = list.style.scrollBehavior;
      list.style.scrollBehavior = 'auto'; // smooth 끄고 즉시 이동
      activeBtn.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
      // 다음 프레임에 원래 smooth 설정으로 복구 (이후 클릭 시엔 부드럽게 동작하도록)
      requestAnimationFrame(() => { list.style.scrollBehavior = prevBehavior; });
    };
    centerActiveOnLoad();

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const panels = tab.querySelectorAll('.ap-tabs__panel');
        if (panels.length) {
          panels.forEach(panel => panel.classList.remove('is-active'));
          const target = tab.querySelector(`#${btn.dataset.target}`);
          if (target) target.classList.add('is-active');
        }

        btn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      });
    });

    if (list) {
      let isDown = false, startX = 0, scrollLeft = 0, moved = false;
      let pendingWalk = null; // rAF로 넘길 최신 walk값
      let rafId = null;

      const applyScroll = () => {
        rafId = null;
        if (pendingWalk === null) return;
        list.scrollLeft = scrollLeft - pendingWalk;
        pendingWalk = null;
      };

      list.addEventListener('mousedown', (e) => {
        isDown = true;
        moved = false;
        list.classList.add('is-dragging');
        list.style.scrollBehavior = 'auto'; // 진행중인 smooth 애니메이션 즉시 중단
        startX = e.pageX - list.offsetLeft;
        scrollLeft = list.scrollLeft;
      });

      const endDrag = () => {
        if (!isDown) return;
        isDown = false;
        list.classList.remove('is-dragging');
        list.style.scrollBehavior = ''; // CSS의 smooth 값으로 복귀
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } // 잔여 스크롤 방지
        pendingWalk = null;
      };
      list.addEventListener('mouseleave', endDrag);
      window.addEventListener('mouseup', endDrag);

      // 네이티브 드래그(고스트 이미지/타이틀 툴팁) 자체를 시작하지 못하게 차단
      list.addEventListener('dragstart', (e) => e.preventDefault());
      buttons.forEach(btn => { btn.draggable = false; });

      list.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - list.offsetLeft;
        const walk = x - startX;
        if (Math.abs(walk) > 5) moved = true;
        pendingWalk = walk;
        if (rafId === null) rafId = requestAnimationFrame(applyScroll); // 프레임당 1회로 스로틀링
      });

      list.addEventListener('click', (e) => {
        if (moved) { e.stopPropagation(); e.preventDefault(); }
      }, true);

      list.addEventListener('wheel', (e) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        list.style.scrollBehavior = 'auto';
        list.scrollLeft += e.deltaY;
        list.style.scrollBehavior = '';
      }, { passive: false });
    }
  });

//스크롤 확대
document.addEventListener('DOMContentLoaded', function () {

  const sections = document.querySelectorAll('.revealing-image');

  if (!sections.length) return;

  function checkVisibility() {
    const triggerPoint = window.innerHeight * 0.9;

    sections.forEach(section => {
      section.classList.toggle(
        'is-visible',
        section.getBoundingClientRect().top < triggerPoint
      );
    });
  }

  window.addEventListener('scroll', checkVisibility);
  window.addEventListener('resize', checkVisibility);

  checkVisibility();
});


/* ==========================
   Share Toggle
========================== */

document.addEventListener('click', function(e){

    const opener = e.target.closest('.ap-share__opener');

    if(opener){

        const share = opener.closest('.ap-share');

        share.classList.toggle('is-open');

        return;
    }


    document.querySelectorAll('.ap-share.is-open').forEach(function(el){

        if(!el.contains(e.target)){
            el.classList.remove('is-open');
        }

    });

});



/* ==========================
   URL Copy
========================== */

document.addEventListener('click', async function(e){

    const copyBtn = e.target.closest('.btn-copy-url');

    if(!copyBtn) return;


    const url = window.location.href;


    try{

        await navigator.clipboard.writeText(url);

        alert('현재 페이지 URL이 복사되었습니다.');

    }catch(err){

        const textarea = document.createElement('textarea');

        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';

        document.body.appendChild(textarea);

        textarea.select();

        document.execCommand('copy');

        document.body.removeChild(textarea);


        alert('현재 페이지 URL이 복사되었습니다.');

    }

});



/* ==========================
  Facebook Share
========================== */

document.addEventListener('click', function(e){
    const btn = e.target.closest('.btn-facebook-share');
    if(!btn) return;
    const url = encodeURIComponent(window.location.href);
    window.open(
        'https://www.facebook.com/sharer/sharer.php?u=' + url,
        '_blank'
    );
});

/* ==========================
  X Share
========================== */

document.addEventListener('click', function(e){
    const btn = e.target.closest('.btn-x-share');
    if(!btn) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open(
        'https://twitter.com/intent/tweet?url=' + url + '&text=' + text,
        '_blank'
    );

});