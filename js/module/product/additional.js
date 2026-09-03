/**
* 모바일 상품상세 더보기
* @package app/Shop
* @subpackage Front/Disp/Product
* @since 2014. 5. 12.
* @version 1.0
*/
$(function () {
  var $DetailMore = {
   
    /**
    
    * module
    
    */
    $module: null,
    /**
    
    * detail
    
    */
    $detail: null,
    /**
    
    * more
    
    */
    $more: null,
    /**
    
    * real height
    
    */
    realHeight: 0,
    /**
    
    * fake height
    
    */
    fakeHeight: 0,
    /**
    
    * init
    
    */
    init: function () {
      // validate
      if (this.validate === false) return;
      // set object
      this.setObject();
      // set detail height
      this.setDetailHeight();
      // set more
      this.setMore();
    },
    /**
    
    * set event
    
    */
    setMore: function () {
      if (this.realHeight <= this.fakeHeight) {
        this.$more.remove();
      } else {
        this.$more.unbind().bind('click', function () {/*  if (this.validate === false) return; */ $DetailMore.load(); console.log('zmfflr') });
      }
    },
    /**
    
    * set detail height
    
    */
    setDetailHeight: function () {
      this.$detail.css({ 'max-height': 500 + 'px', overflow: 'hidden' });
      this.fakeHeight = this.$detail.height();
    },
    /**
    
    * validate
    
    */
   /*  validate: function () {
      if (mobileWeb === false) return false;
    }, */
    /**
    
    * set object
    
    */
    setObject: function () {
      try {
        this.$module = $('#prdDetail');
        this.$detail = this.$module.find('.prdDetailView');
        this.$more = this.$module.find('#btnMore');
        this.realHeight = this.$detail.height();
      } catch (e) { console.log(e); }
    },
    /**
    
    * load detail
    
    */
    load: function () {
      this.$detail.css({ 'max-height': '100px' });
      this.$more.remove();
    }
  };
  
  $DetailMore.init();
});