# Insooth Cafe24 스킨

사이트 관리자가 페이지와 레이아웃을 수정할 때 여는 폴더·파일 목록입니다.

브랜드·고객지원·안내 페이지, 공통 레이아웃, 커스텀 스타일(`ap-`), 상품·주문·회원·마이쇼핑의 대표 화면, 게시판 종류를 수록합니다. 
Cafe24 module CSS/JS, SVG, 스킨 이미지, 주문서 내부 조각, 파일명에 `copy`가 있는 사본은 목록에서 뺍니다.

cursor ai
목록을 다시 맞출 때는 스킬 `update readmefile`을 실행합니다. 프로젝트 루트에서 다음 명령과 같습니다.

```bash
node .cursor/skills/update-readmefile/scripts/update-readme-tree.js
```

최상위 표와 유지보수 파일 트리는 그 실행 결과로만 바뀝니다. 설명 문구는 `.cursor/skills/update-readmefile/scripts/update-readme-tree.js`의 `DESCRIPTIONS`, `NOTES`에서 고칩니다.

## 최상위

<!-- folder-overview:start -->
| 경로 | 설명 | 수록 |
| --- | --- | --- |
| `index.html` | 메인 페이지 | 메인 |
| `robots.txt` | 검색 로봇 정책 | 검색 로봇 |
| `README.md` | 이 문서 | 이 문서 |
| `layout/` | 공통 레이아웃 | 레이아웃·ap 스타일 |
| `about/` | 브랜드 소개 | 페이지 |
| `support/` | 고객지원 | 페이지 |
| `shopinfo/` | 쇼핑몰 안내 | 페이지 |
| `styleguide/` | 스타일가이드 | 페이지 |
| `product/` | 상품 | 대표 화면 |
| `order/` | 장바구니·주문서 | 대표 화면 |
| `member/` | 회원 | 대표 화면 |
| `myshop/` | 마이쇼핑 | 대표 화면 |
| `board/` | 게시판 | 게시판 폴더 |
| `intro/` | 인트로·성인인증 | 페이지 |
| `coupon/` | 쿠폰 | 페이지 |
| `attend/` | 출석체크 | 페이지 |
| `estimate/` | 견적 | 페이지 |
| `supply/` | 공급사 | 페이지 |
| `config/` | 스킨 설정 | 설정 파일 |
| `css/` | Cafe24 module CSS | 폴더만 |
| `ez/` | 이지디자인 설정 | 폴더만 |
| `js/` | Cafe24 module JavaScript | 폴더만 |
| `preference/` | 환경설정 | 폴더만 |
| `SkinImg/` | 스킨 이미지 | 폴더만 |
| `smart-banner/` | 스마트배너 | 폴더만 |
| `svg/` | SVG 아이콘 | 폴더만 |
<!-- folder-overview:end -->

## 유지보수 파일

<!-- maint-tree:start -->
```text
.
├── index.html — 메인
├── robots.txt — 검색 로봇 정책
├── README.md — 폴더 구조
├── layout/
│   └── basic/
│       ├── detail_layout.html — 상세 레이아웃
│       ├── footer.html — 푸터
│       ├── header.html — 헤더
│       ├── intro.html — 인트로 레이아웃
│       ├── layout.html — 공통 레이아웃
│       ├── main_supply.html — 공급사 메인
│       ├── main.html — 메인 본문
│       ├── navigation.html — 내비게이션
│       ├── popup.html — 팝업
│       ├── quick.html — 퀵메뉴
│       ├── sidebar.html — 사이드바
│       ├── state_login.html — 로그인 상태
│       ├── topbanner.html — 상단 배너
│       ├── css/
│       │   ├── ap-footer.css — 푸터
│       │   ├── ap-header.css — 헤더
│       │   ├── ap-layout.css — 공통 레이아웃
│       │   ├── ap-main.css — 메인
│       │   ├── ap-order-basket.css — 장바구니
│       │   ├── ap-product-detail.css — 상품 상세
│       │   ├── ap-product.css — 상품 목록
│       │   ├── ap-sidebar.css — 사이드바
│       │   ├── ap-story.css — 브랜드 스토리
│       │   ├── ap-support-shell.css — 고객지원 셸
│       │   └── ap-support.css — 고객지원
│       └── js/
│           ├── basic.js — 기본 스크립트
│           ├── common.js — 공통 스크립트
│           ├── layout.js — 레이아웃 동작
│           ├── main.js — 메인 동작
│           ├── popup.js — 팝업
│           └── slide_menu.js — 슬라이드 메뉴
├── about/
│   ├── heritage.html — 헤리티지
│   ├── history.html — 히스토리
│   ├── insooth_story.html — 브랜드 스토리
│   ├── share_value.html — 공유가치
│   └── technology.html — 기술
├── support/
│   ├── authentication.html — 정품인증
│   ├── faq.html — FAQ
│   ├── nav.html — 고객지원 메뉴
│   ├── warranty.html — 보증
│   ├── where-to-buy.html — 구매처
│   └── authentication/
│       └── index.html — 정품인증
├── shopinfo/
│   ├── company.html — 회사 소개
│   └── guide.html — 이용안내
├── styleguide/
│   ├── index.html — 스타일가이드
│   └── styleguide.css — 스타일가이드 스타일
├── product/
│   ├── detail.html — 상품 상세
│   ├── list_product.html — 목록 상품 항목
│   ├── list.html — 상품 목록
│   ├── project.html — 프로젝트
│   ├── search.html — 검색
│   └── sizeguide.html — 사이즈 가이드
├── order/
│   ├── basket.html — 장바구니
│   ├── order_result.html — 주문 완료
│   └── orderform.html — 주문서
├── member/
│   ├── join.html — 회원가입
│   ├── login.html — 로그인
│   └── modify.html — 회원정보 수정
├── myshop/
│   ├── index.html — 마이쇼핑
│   ├── myshop_main.html — 마이쇼핑 메인
│   ├── wish_list.html — 관심상품
│   └── order/
│       ├── detail.html — 주문 상세
│       └── list.html — 주문 내역
├── board/
│   ├── index.html — 게시판 홈
│   ├── consult/ — 상담
│   ├── free/ — 자유게시판
│   ├── gallery/ — 갤러리
│   ├── inquiry/ — 문의
│   ├── memo/ — 메모
│   ├── opdiary/ — 운영일기
│   ├── product/ — 상품 게시판
│   └── urgency/ — 긴급
├── intro/
│   ├── adult_certification.html — 성인인증
│   ├── adult_i_recommend.html — 성인인증 추천
│   ├── adult_i.html — 성인인증
│   ├── adult_im.html — 성인인증
│   └── member.html — 회원 인트로
├── coupon/
│   ├── coupon_down_result.html — 쿠폰 다운로드 결과
│   ├── coupon_list.html — 쿠폰 목록
│   ├── coupon_productdetail.html — 상품 상세 쿠폰
│   ├── coupon_select.html — 쿠폰 선택
│   └── coupon_zone.html — 쿠폰존
├── attend/
│   ├── comment.html — 출석 댓글
│   └── stamp.html — 출석 스탬프
├── estimate/
│   ├── print.html — 견적 출력
│   └── userform.html — 견적 작성
├── supply/
│   ├── index.html — 공급사
│   └── main.html — 공급사 메인
└── config/
    └── settings_data.json — 스킨 설정
```
<!-- maint-tree:end -->
