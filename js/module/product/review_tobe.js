$(document).ready(function(){
    // .xans-product-review 클래스가 붙은 메타 영역 클릭 시 토글 이벤트
    $(document).on('click', '.xans-product-review', function(e) {
        e.preventDefault();
        var $trigger = $(this);

        REVIEW.getReadData($trigger);
    });
});
var PARENT = '';
var OPEN_REVIEW = '';

var REVIEW = {
    getReadData : function(obj, eType, callback)
    {
        if (obj != undefined) {
            PARENT = obj;
            var sHref = obj.attr('data-href');
            var pNode = obj.closest('tr.ap-review-card');
            var pass_check = '&pass_check=F';
        } else {
            var sHref = PARENT.attr('data-href');
            var pNode = PARENT.closest('tr.ap-review-card');
            var pass_check = '&pass_check=T';
        }

        if (!sHref) return;

        var sQuery = sHref.split('?');
        var sQueryNo = sQuery[1].split('=');
        
        // sHref에서 추출한 번호(예: board_no=117&...) 중 순수 숫자만 추출
        var reviewKey = sQueryNo[1] ? sQueryNo[1].split('&')[0] : '';
        var $summaryMeta = PARENT;

        // 이미 열려있는 동일 리뷰 클릭 시 접기(토글 닫기)
        if (OPEN_REVIEW == reviewKey) {
            $('#product-review-read' + reviewKey).remove();
            OPEN_REVIEW = '';
            $summaryMeta.attr('aria-expanded', 'false');
            return false;
        } else {
            $('.xans-product-review').attr('aria-expanded', 'false');
            OPEN_REVIEW = reviewKey;
        }

        $.ajax({
            url : '/exec/front/board/product/4?'+sQuery[1]+pass_check,
            dataType: 'json',
            success: function(data) {
              // ★ 여기에 콘솔 찍어보기 추가
                console.log("서버에서 받아온 전체 데이터:", data);
                // 기존 열린 읽기 Row 삭제
                $('[id^="product-review-read"]').remove();

                var sPath = document.location.pathname;
                var sPattern = /^\/product\/(.+)\/([0-9]+)(\/.*)/;
                var aMatchResult = sPath.match(sPattern);
                var iProductNo = aMatchResult ? aMatchResult[2] : getQueryString('product_no');
                
                var aHtml = [];

                // 읽기 권한 체크
                if (false === data.read_auth && eType == undefined) {
                    alert(decodeURIComponent(data.alertMSG));
                    if (data.returnUrl != undefined) {
                        location.replace("/member/login.html?returnUrl=" + data.returnUrl);
                    }
                    return false;
                }

                // -------------------------------------------------------------
                // Expand 본문/댓글 영역 생성
                // -------------------------------------------------------------
                aHtml.push('<div class="ap-review-card__expand">');

                if (data.is_secret == true) {
                    aHtml.push('<form name="SecretForm_4" id="SecretForm_4">');
                    aHtml.push('<input type="text" name="a" style="display:none;">');
                    aHtml.push('<div class="ap-review-card__content"><p>비밀번호 <input type="password" id="secure_password" name="secure_password" onkeydown="if (event.keyCode == 13) '+data.action_pass_submit+'"> <input type="button" value="확인" onclick="'+data.action_pass_submit+'"></p></div>');
                    aHtml.push('</form>');
                } else {
                    // ★ [수정] 기존 참고 JS 방식(data.read)을 반영한 본문 및 이미지 출력
                    var sContent = '';
                    var sImg = '';

                    if (data.read != undefined) {
                        if (data.read['content'] != undefined) {
                            sContent = data.read['content'];
                        }
                        if (data.read['content_image'] != null) {
                            sImg = data.read['content_image'];
                        }
                    } else if (data.content != undefined) {
                        // 혹시 data.read가 없을 경우를 대비한 예외 처리
                        sContent = data.content;
                        if (data.content_image != undefined) {
                            sImg = data.content_image;
                        }
                    }

                    // 본문과 이미지를 감싸서 출력
                    aHtml.push('<div class="ap-review-card__full-content view">');
                    aHtml.push('<p>' + sContent + '</p>');
                    if (sImg != '') {
                        aHtml.push('<div class="ap-review-card__photos">' + sImg + '</div>');
                    }
                    aHtml.push('</div>');

                    // 댓글 목록
                    if (data.comment != undefined && data.comment.length != undefined) {
                        aHtml.push('<ul class="ap-review-card__comments">');
                        for (var i=0; data.comment.length > i; i++) {
                            if (data.comment[i]['comment_reply_css'] == undefined) {
                                aHtml.push('<li>');
                                aHtml.push('<strong class="name">'+data.comment[i]['member_icon']+' '+data.comment[i]['comment_name']+'</strong>');
                                aHtml.push('<span class="date">'+data.comment[i]['comment_write_date']+'</span>');
                                aHtml.push('<span class="grade '+data.use_point+'"><img src="//img.echosting.cafe24.com/skin/base_ko_KR/board/ico_point'+data.comment[i]['comment_point_count']+'.gif" alt="'+data.comment[i]['comment_point_count']+'점" /></span>');
                                aHtml.push('<p class="comment">'+data.comment[i]['comment_icon_lock']+' '+data.comment[i]['comment_content']+'</p>');
                                aHtml.push('</li>');
                            } else {
                                aHtml.push('<li class="replyArea">');
                                aHtml.push('<strong class="name">'+data.comment[i]['member_icon']+' '+data.comment[i]['comment_name']+'</strong>');
                                aHtml.push('<span class="date">'+data.comment[i]['comment_write_date']+'</span>');
                                aHtml.push('<p class="comment">'+data.comment[i]['comment_icon_lock']+' '+data.comment[i]['comment_content']+'</p>');
                                aHtml.push('</li>');
                            }
                        }
                        aHtml.push('</ul>');
                    }
                }

                aHtml.push('</div>'); // .ap-review-card__expand

                // 서버에서 내려온 data.key가 있다면 안전하게 파싱해서 사용, 없으면 기존 reviewKey 사용
                var activeKey = data.key ? String(data.key).split('&')[0] : reviewKey;

                var $newRow = $('<tr id="product-review-read'+activeKey+'"><td class="ap-review-card__cell" colspan="3">'+aHtml.join('')+'</td></tr>');
                $(pNode).after($newRow);

                if (typeof PRODUCT_COMMENT !== 'undefined' && PRODUCT_COMMENT.comment_colspan) {
                    PRODUCT_COMMENT.comment_colspan(pNode);
                }

                $summaryMeta.attr('aria-expanded', 'true');

                if (typeof callback === 'function') {
                    callback($newRow, data, iProductNo);
                }
            }
        });
    },

    END : function() {}
};