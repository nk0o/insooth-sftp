function removePagingArea(oTarget)
{
    if ($(oTarget).length < 1 && (oTarget != '#prdReview' || oTarget != '#prdQna')) return;

    if ($(oTarget).css('display') == 'block') {
        if (oTarget == '#prdReview') {
            var record = $('.xans-record-', '.xans-product-review').first();
            if (record.length < 1 || record.is(':not(:visible)')) {
                $('.xans-product-reviewpaging').remove();
             }
         } else if (oTarget == '#prdQnA') {
            var record = $('.xans-record-', '.xans-product-qna').first();
            if (record.length < 1 || record.is(':not(:visible)')) {
                $('.xans-product-qnapaging').remove();
            }
         }
     }
}

$(function() {

    $('#actionCartClone, #actionWishClone, #actionBuyClone, #actionWishSoldoutClone').off().on('click', function() {
        try {
            var id = $(this).attr('id').replace(/Clone/g, '');
            if (typeof(id) !== 'undefined') $('#' + id).trigger('click');
            else return false;
        } catch(e) {
            return false;
        }
    });

    function productDetailOrigin(){
        var imgChk = $('#prdDetailContent').find('img').length;
        if(imgChk <= 0){
            $('#prdDetailBtn').remove();
        }
    }
    productDetailOrigin();

    // Add Image
    var oTarget = $('.xans-product-mobileimage ul li');
    var oAppend = oTarget.first().children('p').clone();

    oTarget.slice(1).each(function() {
        this.innerHTML = '<p class="thumbnail">' + oAppend.html() + this.innerHTML + '</p>';
        if ($(this).children('p').children('img').length > 1) {
            $(this).children('p').children('img').first().remove();
        }
    });
});


/* 210519 정환 */
jQuery(document).ready(function() {

	/* 상세 관련상품 */
	if (jQuery('.xans-product-relation').val() != undefined) {	//관련상품 모듈 있을떄만 실행(없으면 주문서페이지에서 오류) -정환
		var relation_slide = new Swiper('.relation_slide', {
			slidesPerView: 4,
			spaceBetween: 20,
			observer: true,
			observeParents: true,
			watchOverflow: 'true', // 스와이프가 한개일때 버튼 라인 비활성
			speed:700,
			navigation: {
				nextEl: '.swiper-button-next-rel',
				prevEl: '.swiper-button-prev-rel',
			},
			scrollbar: {
				el: ".swiper-scrollbar",
				hide: false,
				draggable: true,
			},
			autoplay: {
				delay: 5000,
				disableOnInteraction: false,
			},
			breakpoints: {
				768: {
					slidesPerView: 2,
					spaceBetween: 6,
				},
			}
		});
	}

	/* 할인율 없을시 상품명길이 수정 */
	setTimeout(function(){
		jQuery(".sale_box").each(function(){
			jQuery(".xans-product-detail .headingArea").addClass('sale_on');
		});
	},500)

    // 상품상세정보
	jQuery('.info_fold').each(function(){
		jQuery(this).children('.info_title').click(function(){
			jQuery(this).parent('.info_fold').toggleClass('open');
			if(jQuery(this).parent('.info_fold').hasClass('open')){
				jQuery(this).next('.info_content').slideDown();
			} else {
				jQuery(this).next('.info_content').slideUp();
			};
		});
	});

});