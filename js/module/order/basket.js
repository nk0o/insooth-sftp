$(function(){
    var $selectAll = $('#product_select_all');
    var userChangedCheck = false;

    function syncSelectAllButton() {
        var $boxes = $('[id^="basket_chk_id_"]');
        var allOn = $boxes.length > 0 && $boxes.filter(':checked').length === $boxes.length;
        var status = allOn ? 'on' : 'off';
        $selectAll.data('status', status).attr('data-status', status).attr('data-onoff', status);
    }

    function paymentPriceNodes() {
        return $('.ap-summary-row--final .paymentPrice');
    }

    function restorePaymentUnit() {
        paymentPriceNodes().each(function () {
            var nodes = this.childNodes;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].nodeType === 3 && nodes[i].__apWon) {
                    nodes[i].nodeValue = nodes[i].__apWon;
                }
            }
        });
    }

    function setPaymentExpectedZero() {
        if ($('[id^="basket_chk_id_"]:checked').length > 0) {
            restorePaymentUnit();
            return;
        }
        paymentPriceNodes().each(function () {
            $(this).children('strong').first().text('0');
            var nodes = this.childNodes;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].nodeType === 3 && nodes[i].nodeValue.indexOf('원') !== -1) {
                    if (!nodes[i].__apWon) nodes[i].__apWon = nodes[i].nodeValue;
                    nodes[i].nodeValue = nodes[i].nodeValue.replace(/원/g, '');
                }
            }
        });
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
        if (turnOn) restorePaymentUnit();
        else setPaymentExpectedZero();
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

    fixLayerPriceRest();
    selectAllOnLoad();

    // 장바구니 체크박스 체크시 상품총합계, 체크한 숫자 구하기
    $('[id^="basket_chk_id_"]').on('click', function() {
        userChangedCheck = true;
        fixedLayerPriceSet();
        syncSelectAllButton();
    });

    /* 다른 스크립트보다 나중에 전체선택을 한 번 더 맞춘다. 금액을 다시 계산하지는 않는다. */
    setTimeout(selectAllOnLoad, 0);
    $(window).on('load', selectAllOnLoad);

    /* 선택 상품이 없으면 카페24 재계산 응답이 이전 금액을 남겨도 0원으로 맞춘다 */
    $(document).ajaxComplete(function () {
        if (!userChangedCheck) return;
        if ($('[id^="basket_chk_id_"]').length && $('[id^="basket_chk_id_"]:checked').length === 0) {
            setPaymentExpectedZero();
        }
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