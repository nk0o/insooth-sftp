/* =========================================================
   상품사용후기 동적 데이터 선행 바인딩 및 즉시 노출 스크립트 (이미지 중복 제거 최종판)
   ========================================================= */

$(document).ready(function(){
    preloadAndRenderAllReviews();

    var container = document.querySelector('.xans-product-reviewpaging');
    if (container) {
        container.addEventListener('click', function(e) {
            var link = e.target.closest('a');
            if (!link) return;
            var href = link.getAttribute('href');
            if (!href || href === '#none' || href.indexOf('page_4') === -1) return;
            e.preventDefault();
            e.stopPropagation();
            window.location.href = location.pathname + href;
        });
    }
});

function preloadAndRenderAllReviews() {
    $('.ap-review-card').each(function() {
        var $card = $(this);
        var $summaryMeta = $card.find('.xans-product-review');
        var sHref = $summaryMeta.attr('data-href');

        if (!sHref) return;

        var sQuery = sHref.split('?');
        if (!sQuery[1]) return;

        var sQueryNo = sQuery[1].split('=');
        var reviewKey = sQueryNo[1] ? sQueryNo[1].split('&')[0] : '';
        
        if (reviewKey) {
            $card.attr('data-review-key', reviewKey);
        }

        var ajaxUrl = '/exec/front/board/product/4?' + sQuery[1] + '&pass_check=F';

        $.ajax({
            url: ajaxUrl,
            dataType: 'json',
            success: function(data) {
                if (!data || data.read_auth === false) return;

                var aHtml = [];
                aHtml.push('<div class="ap-review-card__expanded-content">');

                if (data.is_secret === true) {
                    aHtml.push('<form name="SecretForm_' + reviewKey + '" id="SecretForm_' + reviewKey + '">');
                    aHtml.push('<input type="text" name="a" style="display:none;">');
                    aHtml.push('<div class="ap-review-card__content"><p>비밀번호 <input type="password" id="secure_password" name="secure_password" onkeydown="if (event.keyCode == 13) ' + data.action_pass_submit + '"> <input type="button" value="확인" onclick="' + data.action_pass_submit + '"></p></div>');
                    aHtml.push('</form>');
                } else {
                    var sContent = '';
                    var sImg = '';

                    var targetData = data.read || data;
                    
                    if (targetData['content'] !== undefined && targetData['content'] !== null) {
                        sContent = targetData['content'];
                    }
                    if (targetData['content_image'] !== undefined && targetData['content_image'] !== null) {
                        sImg = targetData['content_image'];
                    }

                    // 본문 노출 영역 추가 (fr-view fr-view-article 클래스를 포함시켜 에디터 스타일 유지)
                    aHtml.push('<div class="ap-review-card__full-content view fr-view fr-view-article">');
                    aHtml.push(sContent);
                    aHtml.push('</div>');

                    // 이미지 중복 제거
                    var combinedImages = '';
                    
                    if (sImg !== '') {
                        var $tempImgDiv = $('<div>').html(sImg);
                        var $tempContentDiv = $('<div>').html(sContent);
                        
                        var filteredImgHtml = '';
                        $tempImgDiv.find('img').each(function(){
                            var imgSrc = $(this).attr('src');
                            var isAlreadyInContent = false;
                            if (imgSrc) {
                                $tempContentDiv.find('img').each(function(){
                                    if ($(this).attr('src') === imgSrc) {
                                        isAlreadyInContent = true;
                                    }
                                });
                            }
                            
                            if (!isAlreadyInContent) {
                                filteredImgHtml += $(this).prop('outerHTML');
                            }
                        });

                        if (filteredImgHtml !== '') {
                            combinedImages += '<div class="ap-review-card__photos">' + filteredImgHtml + '</div>';
                        }
                    }

                    // 중복이 제거된 순수 첨부 이미지만 추가
                    if (combinedImages !== '') {
                        aHtml.push('<div class="ap-review-card__preview-injected">' + combinedImages + '</div>');
                    }

                    // 댓글 목록 노출 영역 추가
                    if (data.comment !== undefined && data.comment.length !== undefined && data.comment.length > 0) {
                        aHtml.push('<ul class="ap-review-card__comments">');
                        for (var i = 0; i < data.comment.length; i++) {
                            var com = data.comment[i];
                            var replyClass = (com['comment_reply_css'] === undefined) ? '' : ' class="replyArea"';
                            aHtml.push('<li' + replyClass + '>');
                            aHtml.push('<strong class="name">' + (com['member_icon'] || '') + ' ' + com['comment_name'] + '</strong>');
                            aHtml.push('<span class="date">' + com['comment_write_date'] + '</span>');
                            if (com['comment_point_count']) {
                                aHtml.push('<span class="grade"><img src="//img.echosting.cafe24.com/skin/base_ko_KR/board/ico_point' + com['comment_point_count'] + '.gif" alt="' + com['comment_point_count'] + '점" /></span>');
                            }
                            aHtml.push('<p class="comment">' + (com['comment_icon_lock'] || '') + ' ' + com['comment_content'] + '</p>');
                            aHtml.push('</li>');
                        }
                        aHtml.push('</ul>');
                    }
                }

                aHtml.push('</div>'); // .ap-review-card__expanded-content

                // 기존 '더보기' 영역은 숨기고 생성한 전체 HTML을 셀에 즉시 주입
                $card.find('.xans-product-review').hide();
                $card.find('.ap-review-card__cell').append(aHtml.join(''));
            }
        });
    });
}