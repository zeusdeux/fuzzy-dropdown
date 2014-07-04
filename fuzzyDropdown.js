(function($, Fuse) {

  function makeList2Json(iterable) {
    var locationArr = [];
    var $this;
    $.each(iterable, function() {
      $this = $(this);
      locationArr.push({
        value: $this.val(),
        text: $this.text().trim()
      });
    });
    return locationArr;
  }
  /**
   * Adds a fuzzy search enabled dropdown
   * @param  {Object} options
   * The options parameter takes the following values:
   * - mainContainer: {a valid jQuery selector}
   * - arrowUpClass: { class [optional]}
   * - threshold: { float between 0 and 1. Control fuse's fuzzy threshold}
   */
  $.fn.fuzzyDropdown = function(options) {
    var _opts           = $.extend({}, options);
    var $this           = $(this);
    var $currentSelected;
    var $mainContainer  = $(_opts.mainContainer);
    var $currentValCont = $($mainContainer.children('div')[0]);
    var $currentValSpan = $currentValCont.children('span:first');
    var $arrowSpan      = $($currentValCont.children('span')[1]);
    var $dropdownCont   = $($mainContainer.children('div')[1]);
    var $searchInput    = $dropdownCont.children('input:first');
    var $dropdownUL     = $dropdownCont.children('ul:first');
    var $lis;
    var list            = $this.children('option');
    var locations       = makeList2Json(list);
    var noResultsId     = +new Date() + '-no-results-found';
    var html;
    var fuse            = new Fuse(locations, {
                            keys: ['text'],
                            id: 'value',
                            threshold: _opts.threshold || 0.61,
                            shouldSort: true,
                            distance: 120,
                            maxPatternLength: 64
                          });

    console.debug('fuzzyDropdown: threshold is '+_opts.threshold);

    //hide the select box
    $this.hide();

    //show our container if hidden
    if ($(_opts.mainContainer+':hidden').length){
      $mainContainer.show();
    }

    //get current selected option
    $currentSelected = $this.children('option[selected]');
    $currentSelected = $currentSelected.length ? $currentSelected : $this.children('option:first');

    //setup current selected
    $currentValSpan.attr('data-val', $currentSelected.val());
    $currentValSpan.text($currentSelected.text());

    //add search image to search bar
    //todo

    //populate the search list
    for (var i = 0; i < list.length; i++) {
      html = '<li data-val="' + list[i].value + '">' + list[i].text + '</li>';
      $dropdownUL.append(html);
    }
    //add the no results element
    $dropdownUL.append('<li id="' + noResultsId + '" style="display:none;">No results found yet. Keep typing for more matches.</li>');

    //store lis for future use
    $lis = $dropdownUL.children('li');

    //set position values and width for the dropdown to appear correctly
    $mainContainer.css('position', 'relative');
    $dropdownCont.css('position', 'fixed');
    $dropdownCont.width($currentValCont.width());

    //resize the dropdown when window is resized
    $(window).resize(function(){
      $dropdownCont.width($currentValCont.width());
    });

    //add handler for search function
    $searchInput.keyup(function(evt) {
      var $this = $(this);
      var val   = $this.val();
      var results;
      if (val === '') {
        $lis.css('display', 'list-item');
        $('#' + noResultsId).css('display', 'none');
      }
      else {
        results = fuse.search(val);
        if (results.length) {
          $lis.css('display', 'none');
          $lis.each(function() {
            var $this = $(this);
            for (var i = 0; i < results.length; i++) {
              if ($this.attr('data-val') === '' + results[i]) {
                $this.css('display', 'list-item');
              }
            }
          });
        }
        else {
          $lis.css('display', 'none');
          $('#' + noResultsId).css('display', 'list-item');
        }
      }
    });

    //add toggle dropdown function
    $currentValCont.click(function() {
      $arrowSpan.toggleClass(_opts.arrowUpClass);
      $dropdownCont.slideToggle(100);
      if ($dropdownCont.is(':visible')) $searchInput.focus();
    });

    //add handlers for click on li
    $dropdownCont.on('click', 'li', function(evt) {
      var $self = $(this);
      $currentValSpan.attr('data-val', $self.attr('data-val'));
      $currentValSpan.text($self.text());
      $this.children('option[value=' + $self.attr('data-val') + ']').attr('selected', 'selected').change();
      $currentValCont.click();
    });
  };
})(jQuery, window.Fuse);
