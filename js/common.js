//window popup script
function winPop(url) {
    window.open(url, "popup", "width=300,height=300,left=10,top=10,resizable=no,scrollbars=no");
}
/**
 * document.location.href split
 * return array Param
 */
function getQueryString(sKey)
{
    var sQueryString = document.location.search.substring(1);
    var aParam       = {};

    if (sQueryString) {
        var aFields = sQueryString.split("&");
        var aField  = [];
        for(var i=0; i<aFields.length; i++){
            aField = aFields[i].split('=');
            aParam[aField[0]] = aField[1];            
        }
    }

    aParam.page = aParam.page ? aParam.page : 1;
    return sKey ? aParam[sKey] : aParam;
};

/**
  *  구매버튼
*/
var globalBuyBtnScrollFunc = function() {
    // 구매버튼 관련변수
    var sFixId = $('#orderFixItem').length > 0  ? 'orderFixItem' : 'fixedActionButton',
        $area = $('#orderFixArea'),
        $item = $('#' + sFixId + '').not($area);

    $(window).scroll(function(){
        try {
             // 구매버튼 관련변수
            var iCurrentHeightPos = $(this).scrollTop() + $(this).height(),
                iButtonHeightPos = $item.offset().top;

            if (iCurrentHeightPos > iButtonHeightPos || iButtonHeightPos < $(this).scrollTop() + $item.height()) {
                if (iButtonHeightPos < $(this).scrollTop() - $item.height()) {
                    $area.fadeIn('fast');
                } else {
                    $area.hide();
                }
            } else {
                $area.fadeIn('fast');
            }
        } catch(e) { }
    });
};

$(function(){
    // tab
    $.eTab = function(ul) {
        $(ul).find('a').on('click', function() {
            var _li = $(this).parent('li').addClass('selected').siblings().removeClass('selected'),
                _target = $(this).attr('href'),
                _siblings = '.' + $(_target).attr('class');
            $(_target).show().siblings(_siblings).hide();
            return false
        });
    }
    if ( window.call_eTab ) {
        call_eTab();
    };
    globalBuyBtnScrollFunc();

    function apToastBar(toggle) {
        return toggle.closest('.ap-toast__bar, .ap-cart-mobile-bar');
    }

    function apToastOffset(toast, toggle) {
        var bar = apToastBar(toggle);
        if (!bar) return;
        toast.style.setProperty('--ap-toast-offset', bar.offsetHeight + 'px');
    }

    function apSetToast(toast, toggle, open) {
        if (!toast) return;
        if (open) {
            document.dispatchEvent(new CustomEvent('ap-toast-beforeopen', { detail: { toast: toast } }));
        }
        apToastOffset(toast, toggle);
        toast.classList.toggle('is-open', open);
        var expanded = open ? 'true' : 'false';
        if (toast.id) {
            document.querySelectorAll('.ap-toast__toggle[aria-controls="' + toast.id + '"]').forEach(function (btn) {
                btn.setAttribute('aria-expanded', expanded);
            });
        } else {
            toggle.setAttribute('aria-expanded', expanded);
        }
    }

    $(document).on('click', '.ap-toast__toggle', function (e) {
        e.preventDefault();
        var id = this.getAttribute('aria-controls');
        var toast = id ? document.getElementById(id) : this.closest('.ap-toast');
        apSetToast(toast, this, this.getAttribute('aria-expanded') !== 'true');
    });

    $(window).on('resize', function () {
        document.querySelectorAll('.ap-toast.is-open').forEach(function (toast) {
            var toggle = toast.id ? document.querySelector('.ap-toast__toggle[aria-controls="' + toast.id + '"]') : null;
            if (toggle) apToastOffset(toast, toggle);
        });
    });

    /* 장바구니 담기 레이어(add_basket2)는 AJAX로 붙으므로, 열린 뒤에 추천상품 스와이퍼를 켠다. */
    function apInitLayerBasketSwiper() {
        if (typeof Swiper !== 'function') return;
        document.querySelectorAll('.xans-order-layerbasket .ap-basket-swiper').forEach(function (el) {
            if (!el.querySelector('.swiper-slide')) return;
            if (el.swiper) {
                el.swiper.update();
                return;
            }
            var paginationEl = el.querySelector('.swiper-pagination');
            var swiper = new Swiper(el, {
                slidesPerView: 2.1,
                spaceBetween: 8,
                simulateTouch: true,
                watchOverflow: true,
                observer: true,
                observeParents: true,
                pagination: paginationEl ? { el: paginationEl, clickable: true } : false
            });
            el.querySelectorAll('img').forEach(function (img) {
                if (img.complete) return;
                img.addEventListener('load', function () {
                    if (swiper && !swiper.destroyed) swiper.update();
                }, { once: true });
            });
        });
    }

    function apSideLayerOpen() {
        var layers = document.querySelectorAll('.ec-base-layer.typeSide');
        for (var i = 0; i < layers.length; i++) {
            var node = layers[i];
            var open = true;
            while (node && node !== document.documentElement) {
                if (window.getComputedStyle(node).display === 'none') {
                    open = false;
                    break;
                }
                node = node.parentElement;
            }
            if (open) return true;
        }
        return false;
    }

    function apSyncSideLayerScroll() {
        document.body.classList.toggle('ap-scroll-lock', apSideLayerOpen());
    }

    function apMutationAffectsSideLayer(mutations) {
        for (var i = 0; i < mutations.length; i++) {
            var m = mutations[i];
            var t = m.target;
            if (t.nodeType === 1 && (
                (t.closest && t.closest('.ec-base-layer.typeSide, .ec-base-layer-area')) ||
                (t.querySelector && t.querySelector('.ec-base-layer.typeSide'))
            )) return true;
            var lists = [m.addedNodes, m.removedNodes];
            for (var k = 0; k < lists.length; k++) {
                var nodes = lists[k];
                if (!nodes) continue;
                for (var j = 0; j < nodes.length; j++) {
                    var n = nodes[j];
                    if (n.nodeType !== 1) continue;
                    if (n.matches && (n.matches('.ec-base-layer.typeSide, .ec-base-layer-area') || (n.querySelector && n.querySelector('.ec-base-layer.typeSide')))) return true;
                }
            }
        }
        return false;
    }

    apInitLayerBasketSwiper();
    apSyncSideLayerScroll();
    if (window.MutationObserver && document.body) {
        var layerSwiperFrame = 0;
        var layerDomDirty = false;
        var layerScrollDirty = false;
        new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                if (mutations[i].type === 'childList') layerDomDirty = true;
            }
            if (apMutationAffectsSideLayer(mutations)) layerScrollDirty = true;
            if (!layerDomDirty && !layerScrollDirty) return;
            if (layerSwiperFrame) return;
            layerSwiperFrame = window.requestAnimationFrame(function () {
                layerSwiperFrame = 0;
                if (layerDomDirty) {
                    layerDomDirty = false;
                    apInitLayerBasketSwiper();
                }
                if (!layerScrollDirty) return;
                layerScrollDirty = false;
                apSyncSideLayerScroll();
            });
        }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    }
});