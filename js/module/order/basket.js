$(function(){
    var $selectAll = $('#product_select_all');
    var userChangedCheck = false;

    function syncSelectAllButton() {
        var $boxes = $('[id^="basket_chk_id_"]');
        var total = $boxes.length;
        var checked = $boxes.filter(':checked').length;
        var allOn = total > 0 && checked === total;
        var status = allOn ? 'on' : 'off';
        $selectAll.data('status', status).attr('data-status', status).attr('data-onoff', status);
        $selectAll.find('.ap-cart-select-count').text(checked > 0 ? (checked + '/' + total) : '');
        $('.ap-cart-buy__count').text(checked);
        $('.ap-cart-mobile-bar__count').toggleClass('displaynone', checked < 1);
    }

    function paymentPriceNodes() {
        return $('.ap-cart-side .ap-summary-row--final .paymentPrice');
    }

    function productTotalNodes() {
        return $('.ap-cart-side .ap-summary-row__heading').filter(function () {
            return $.trim($(this).children('.title').text()).replace(/\s/g, '') === '총상품금액';
        }).children('.ap-summary-row__value');
    }

    function refreshCartToast() {
        var source = document.querySelector('.ap-cart-side .ap-summary-card');
        var panel = document.getElementById('apCartToastPanel');
        if (!source || !panel) return;
        var clone = source.cloneNode(true);
        clone.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
        clone.querySelectorAll('[onclick]').forEach(function (el) { el.removeAttribute('onclick'); });
        clone.querySelectorAll('.ap-cart-order-buttons').forEach(function (el) { el.remove(); });
        panel.replaceChildren(clone);
    }

    function restorePriceUnit(node) {
        var nodes = node.childNodes;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeType === 3 && nodes[i].__apWon) {
                nodes[i].nodeValue = nodes[i].__apWon;
            }
        }
    }

    function clearPriceUnit(node) {
        var nodes = node.childNodes;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeType === 3 && nodes[i].nodeValue.indexOf('원') !== -1) {
                if (!nodes[i].__apWon) nodes[i].__apWon = nodes[i].nodeValue;
                nodes[i].nodeValue = nodes[i].nodeValue.replace(/원/g, '');
            }
        }
    }

    function selectedProductSum() {
        var sum = 0;
        $('[id^="basket_chk_id_"]:checked').each(function () {
            var $value = $(this).closest('.ap-cart-item').find('.ap-cart-item__sum-value').first().clone();
            $value.find('.refer, .displaynone').remove();
            var digits = $value.text().replace(/[^0-9]/g, '');
            if (digits) sum += parseInt(digits, 10);
        });
        return sum;
    }

    function formatAmount(amount) {
        return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function setSelectedProductTotal() {
        productTotalNodes().each(function () {
            $(this).children('strong').first().text(formatAmount(selectedProductSum()));
            restorePriceUnit(this);
        });
        refreshCartToast();
    }

    function zeroProductTotals() {
        productTotalNodes().each(function () {
            var $strong = $(this).children('strong').first();
            if (!$strong.data('apOriginSet')) {
                $strong.data('apOriginPrice', $strong.text());
                $strong.data('apOriginSet', 1);
            }
            $strong.text('0');
            clearPriceUnit(this);
        });
    }

    function restorePaymentUnit() {
        paymentPriceNodes().each(function () {
            restorePriceUnit(this);
        });
    }

    function setPaymentExpectedZero() {
        if ($('[id^="basket_chk_id_"]:checked').length > 0) {
            restorePaymentUnit();
            setSelectedProductTotal();
            return;
        }
        paymentPriceNodes().each(function () {
            $(this).children('strong').first().text('0');
            clearPriceUnit(this);
        });
        zeroProductTotals();
        syncBuyButtonPrice();
    }

    function syncBuyButtonPrice() {
        var amount = '';
        $('.ap-cart-side .ap-summary-row--final .paymentPrice').each(function () {
            if (!$(this).is(':visible')) return;
            var $clone = $(this).clone();
            $clone.find('.refer').remove();
            var text = $.trim($clone.text()).replace(/\s+/g, '');
            if (text) amount = text;
        });
        if (amount && amount.indexOf('원') === -1) amount += '원';
        $('.ap-cart-mobile-bar .ap-cart-buy__price').text(amount);
        refreshCartToast();
    }

    // 상품리스트 전체선택
    $selectAll.on('click', function() {
        var turnOn = $(this).data('status') == 'off';
        userChangedCheck = true;

        $('[id^="basket_chk_id_"]').prop('checked', turnOn);
        syncSelectAllButton();
        fixedLayerPriceSet();
        /* trigger('click')은 체크박스를 다시 뒤집는다. 핸들러만 호출한다. */
        if (window.bCheckedProductCalc === true) {
            $('[id^="basket_chk_id_"]').first().triggerHandler('click');
        }
        if (turnOn) {
            restorePaymentUnit();
            setSelectedProductTotal();
        } else setPaymentExpectedZero();
    });

    // 고정영역에 상품정보 세팅
    var fixedLayerPriceSet = function() {
        var iSumPrice = 0;
        var iCheckPrdCnt = 0;
        $('[id^="basket_chk_id_"]').each(function(){
            if ($(this).prop('checked') == true) {
                var sCheckId = $(this).attr('id');
                var aTemp = sCheckId.split('_');
                var iCheckId = aTemp[3];
                if (typeof aBasketProductData === 'undefined' || !aBasketProductData[iCheckId]) return;
                var iQuantity = $('#quantity_id_'+iCheckId).val();
                var iProductPrice = aBasketProductData[iCheckId].product_sum_price * iQuantity;
                iSumPrice = iSumPrice + iProductPrice;
                iCheckPrdCnt = iCheckPrdCnt + 1;
            }
        });
        if (iCheckPrdCnt > 0) {
            restorePaymentUnit();
            setSelectedProductTotal();
            var sTotalPrice = SHOP_PRICE_FORMAT.toShopPrice(iSumPrice);
            $('#checked_order_count').html('<strong>' + sprintf(__('%s'),iCheckPrdCnt) + '</strong>' +'개 상품선택').css('padding-bottom','5px');
            $('#checked_order_price').html('결제예정금액 <strong><em><span id="checked_total_order_price">'+sTotalPrice+'</span></em></strong>').css('padding-bottom','5px');
            var sPriceRef = SHOP_PRICE_FORMAT.shopPriceToSubPrice(iSumPrice);
            if (sPriceRef != '') $('#checked_order_price').find('strong').append(sPriceRef);
        } else {
            fixLayerPriceRest();
            setPaymentExpectedZero();
        }
    };

    // 고정영역 상품합계초기화
    var fixLayerPriceRest = function() {
        $('#checked_order_count, #checked_order_price').html('').css('padding-bottom','0');
    };

    function selectAllOnLoad() {
        if (userChangedCheck) return;
        var $boxes = $('[id^="basket_chk_id_"]');
        if (!$boxes.length) return;
        $boxes.prop('checked', true);
        syncSelectAllButton();
    }

    document.addEventListener('ap-toast-beforeopen', function (e) {
        if (!e.detail || !e.detail.toast || e.detail.toast.id !== 'apCartToast') return;
        refreshCartToast();
    });

    $('#apCartToast').on('click', '.ap-mileage-accordion__head', function () {
        var wrap = this.closest('.ap-mileage-accordion');
        if (!wrap) return;
        var body = wrap.querySelector('.ap-mileage-accordion__body');
        if (!body) return;
        var expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        body.classList.toggle('is-open', !expanded);
    });
    $('#apCartToast').on('click', '.shippingFee > a.btnText', function (e) {
        e.preventDefault();
        var tooltip = this.closest('.shippingFee').querySelector('.ap-tooltip');
        if (tooltip) tooltip.classList.toggle('is-open');
    });
    $('#apCartToast').on('click', '.ap-tooltip__close', function () {
        var tooltip = this.closest('.ap-tooltip');
        if (tooltip) tooltip.classList.remove('is-open');
    });

    fixLayerPriceRest();
    selectAllOnLoad();
    syncBuyButtonPrice();

    // 장바구니 체크박스 체크시 상품총합계, 체크한 숫자 구하기
    $('[id^="basket_chk_id_"]').on('click', function() {
        userChangedCheck = true;
        fixedLayerPriceSet();
        syncSelectAllButton();
    });

    /* 다른 스크립트보다 나중에 전체선택을 한 번 더 맞춘다. 금액을 다시 계산하지는 않는다. */
    setTimeout(function () {
        selectAllOnLoad();
        syncBuyButtonPrice();
    }, 0);
    $(window).on('load', function () {
        selectAllOnLoad();
        syncBuyButtonPrice();
    });

    /* 선택 상품이 없으면 카페24 재계산 응답이 이전 금액을 남겨도 0원으로 맞춘다 */
    $(document).ajaxComplete(function () {
        if (!userChangedCheck) {
            syncBuyButtonPrice();
            return;
        }
        if ($('[id^="basket_chk_id_"]').length && $('[id^="basket_chk_id_"]:checked').length === 0) {
            setPaymentExpectedZero();
            return;
        }
        setSelectedProductTotal();
        syncBuyButtonPrice();
    });
});

// 장바구니 선택상품 삭제
function selBasketDel(id) {
    $('[id^="'+BASKET_CHK_ID_PREFIX+'"]').prop('checked', false);
    $('[id="'+id+'"]').prop('checked', true);
    Basket.deleteBasket();
}

//pc 일때 cart-total 스크롤시 오른쪽 고정 스크립트
function handleScrollEvent() {        
    var cartEl = document.querySelector('.cart-container .cart-total');
    if(cartEl){
        var marginNum = 54;

        if (window.innerWidth >= 1024) {
            var scrollPosition = (window.scrollY-marginNum);
            var divElement = document.querySelector('.xans-order-basketpackage');

            if(divElement){
                var divY = divElement.getBoundingClientRect().top;                
                var divHeight = (divElement.offsetHeight-marginNum);
                var cul = Math.ceil((scrollPosition+divY)-marginNum);
                
                if(scrollPosition > cul){
                    if(divHeight > scrollPosition){
                        cartEl.style.top = (scrollPosition-cul)+'px';
                    }else {
                        cartEl.style.top = (divHeight-cul)+'px';
                    }
                }else{
                    cartEl.style.top = '';
                }
            }
        }else{
            cartEl.style.top = '';
        }
    }
}

handleScrollEvent();

window.addEventListener('scroll', handleScrollEvent);
window.addEventListener('resize', handleScrollEvent);