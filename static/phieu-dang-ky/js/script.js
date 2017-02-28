$(document).ready(function () {
	//	setDisplayStatus();
	// [EVENT] 
	$('.tab-control button').click(function () {
		var me = $(this),
			role = me.attr('data-role'),
			currTab = $('.nav-tabs .active');
		var isValidForm = validateSurveyForm() || true;
		// console.log('--- tab-control button: CLICK' + role + isValidForm);

		if (role == 'prev-tab' && !currTab.is(':first-child')) {
			// console.log('----------------prev-tab');
			currTab.prev().find('a').tab('show');
		} else if (role == 'next-tab' && !currTab.is(':last-child') && isValidForm) {
			// console.log('----------------next-tab');
			currTab.next().find('a').tab('show');
		}
		setDisplayStatus();
	});

	// [EVENT] Scroll to input (form control) when click on it (mobile)
	$('.form-control').click(function () {
		var me = $(this);
		setTimeout(function () {
			$('body, html').scrollTop(me.offset().top);
		}, 100);
	});

	// [EVENT] Auto focus to textbox when tab is shown
	$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function () {
		var $question = $('.tab-pane.active .ss-item');
		if ($question.hasClass('ss-text')) {
			$question.find('input').focus();
		}
		//		$('body, html').scrollTop(0);
		//		var me = $(this),
		//			TIMEOUT = 10000;
		//		if (me.attr('data-tab') == 'question' && !me.parent().is(':last-child')) {
		//			if (window.timeout) clearTimeout(window.timeout);
		//			window.timeout = setTimeout(function () {
		//				$('[data-role="next-tab"]').click();
		//			}, TIMEOUT);
		//		}
	});

	// [EVENT] Validate form before submit form
	$('#btnSurveySubmit').click(function () {
		if (validateSurveyForm()) {
			$('.loading-gif').fadeIn();
			$('#formSurvey').submit();
		}
	});


    $("div.bhoechie-tab-menu>div.list-group>a").click(function(e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
    });

	// $(document).on('change', '.ss-form-question input[type=radio]', function () {
		// 	// console.log('--- radio: CHANGE');
		// 	$('[data-role="next-tab"]').click();
		// });

		//	$(document).on('focusout', 'input[type=text], input[type=tel], input[type=email]', function (e) {
		//		// console.log('--- textbox: FOCUSOUT');
		//		if (!$('.tab-control').has($(e.relatedTarget)).length) {
		//			// console.log('----------------Not hit button');
		//			$('[data-role="next-tab"]').click();
		//		}
		//	});

	$('.js-select2').select2();
	renderSurvey();

	// Score Level range slider
    $( "#sliderScoreLevel" ).slider({
      range: true,
      min: 0,
      max: 50,
      values: [ 40, 49 ],
      slide: function( event, ui ) {
      	var s =  "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] ;
        $("#inputScoreLevel").val(s);
        $("#spanScoreLevel").html(s);
      }
    });
    var $sliderScoreLevel = $( "#sliderScoreLevel" );
    var s =  $sliderScoreLevel.slider( "values", 0 ) + " - " + $sliderScoreLevel.slider( "values", 1 ) ;
    $( "#inputScoreLevel" ).val(s);
    $("#spanScoreLevel").html(s);

	// Fee Level range slider
    $( "#sliderFeeLevel" ).slider({
      range: true,
      min: 0,
      max: 50000,
      values: [ 40, 49 ],
      slide: function( event, ui ) {
	    var minFee = ui.values[0] * 1000;
	    var maxFee = ui.values[1] * 1000;
	    $("#spanFeeLevel .min").html(minFee);
	    $("#spanFeeLevel .max").html(minFee);
	    $("#inputFeeLevel").val(minFee + " - " + maxFee);
      }
    });
    var $sliderFeeLevel = $( "#sliderFeeLevel" );
    var minFee = $sliderFeeLevel.slider( "values", 0 ) * 1000;
    var maxFee = $sliderFeeLevel.slider( "values", 1 ) * 1000;
    $("#spanFeeLevel .min").html(minFee);
    $("#spanFeeLevel .max").html(minFee);
    $("#inputFeeLevel").val(minFee + " - " + maxFee);
});

function validateSurveyForm() {
	function validateInput(input) {
		if (input.val() == null || input.val() == '')
			return false;
		return true;
	}

	function validateRadio(choices) {
		var isValid = false;
		$.each(choices.find('input'), function (i, e) {
			if ($(e).is(':checked')) {
				isValid = true;
				return;
			}
		});
		return isValid;
	}

	var $requiredInputs = $('#formSurvey .tab-pane.active .ss-item-required'),
		isValidForm = true,
		isPageFocus = false;

	$.each($requiredInputs, function (i, e) {
		var isValidInput;
		// Check input type cases
		if ($(e).hasClass('ss-text'))
			isValidInput = validateInput($(e).find('input'));
		else if ($(e).hasClass('ss-radio'))
			isValidInput = validateRadio($(e).find('.ss-choices'));
		else if ($(e).hasClass('ss-select'))
			isValidInput = validateInput($(e).find('select'));

		// Show/hide message
		if (isValidInput) {
			$(e).find('.required-message').hide();
		} else {
			isValidForm = false;
			$(e).find('.required-message').css('display', 'inline-block');

			// Focus on page that contain invalid question
			//			if (!isPageFocus) {
			//				var pageId = $(e).parents('.tab-pane').attr('id');
			//				$('a[href="#' + pageId + '"]').tab('show')
			//				setTimeout(function () {
			//					$('body, html').scrollTop($(e).offset().top);
			//
			//				}, 100);
			//				isPageFocus = true;
			//			}
		}
	});

	return isValidForm;
}

function setDisplayStatus() {
	var currTab = $('.nav-tabs .active'),
		btnPrev = $('[data-role="prev-tab"]'),
		btnNext = $('[data-role="next-tab"]'),
		btnSubmit = $('[data-role="submit"]'),
		pageInfo = $('#pageInfo');
	if (currTab.is(':first-child')) {
		btnPrev.hide();
		btnNext.show();
		btnSubmit.hide();
	} else if (currTab.is(':last-child')) {
		btnPrev.show();
		btnNext.hide();
		btnSubmit.show();
	} else {
		btnPrev.show();
		btnNext.show();
		btnSubmit.hide();
	}

	var pageNumber = currTab.data('page-number');
	pageInfo.html(pageNumber + '/20');
}

function restructureChoices() {
	var $choices = $('.ss-choices');
	$.each($choices, function (i, e) {
		$.each($(e).children(), function (j, k) {
			var $itemCtrl = $(k).find('.ss-choice-item-control');
			$itemCtrl.after($(k).find('input[type=checkbox], input[type=radio]'));
			$itemCtrl.remove();
		});
	});
}

function getData() {
	return '<body dir="ltr" class="ss-base-body"><div itemscope="" itemtype="http://schema.org/CreativeWork/FormObject"><meta itemprop="name" content="Coex Mall"><meta itemprop="url" content="https://docs.google.com/forms/d/1zvabN4vLza9aDKB5pytzsNsClyB6jmmha_4cfueb4AE/viewform"><meta itemprop="embedUrl" content="https://docs.google.com/forms/d/1zvabN4vLza9aDKB5pytzsNsClyB6jmmha_4cfueb4AE/viewform?embedded=true"><meta itemprop="faviconUrl" content="https://ssl.gstatic.com/docs/spreadsheets/forms/favicon_qp2.png"><div class="ss-form-container"><div class="ss-header-image-container"><div class="ss-header-image-image"><div class="ss-header-image-sizer"></div></div></div><div class="ss-top-of-page"><div class="ss-form-heading"><h1 class="ss-form-title" dir="ltr">Coex Mall</h1><div class="ss-required-asterisk" aria-hidden="true">* Required</div></div></div><div class="ss-form"><form action="https://docs.google.com/forms/d/1zvabN4vLza9aDKB5pytzsNsClyB6jmmha_4cfueb4AE/formResponse" method="POST" id="ss-form" target="_self" onsubmit=""><ol role="list" class="ss-question-list" style="padding-left: 0"><div class="ss-form-question errorbox-good" role="listitem"><div dir="auto" class="ss-item ss-item-required ss-text"><div class="ss-form-entry"><label class="ss-q-item-label" for="entry_1712865040"><div class="ss-q-title">First Name (Tên)<label for="itemView.getDomIdToLabel()" aria-label="(Required field)"></label><span class="ss-required-asterisk" aria-hidden="true">*</span></div><div class="ss-q-help ss-secondary-text" dir="auto"></div></label><input type="text" name="entry.1712865040" value="" class="ss-q-short" id="entry_1712865040" dir="auto" aria-label="First Name (Tên) " aria-required="true" required="" title=""><div class="error-message" id="1236216492_errorMessage"></div><div class="required-message">This is a required question</div></div></div></div><div class="ss-form-question errorbox-good" role="listitem"><div dir="auto" class="ss-item ss-item-required ss-text"><div class="ss-form-entry"><label class="ss-q-item-label" for="entry_58108750"><div class="ss-q-title">Last Name (Họ)<label for="itemView.getDomIdToLabel()" aria-label="(Required field)"></label><span class="ss-required-asterisk" aria-hidden="true">*</span></div><div class="ss-q-help ss-secondary-text" dir="auto"></div></label><input type="text" name="entry.58108750" value="" class="ss-q-short" id="entry_58108750" dir="auto" aria-label="Last Name (Họ) " aria-required="true" required="" title=""><div class="error-message" id="468430928_errorMessage"></div><div class="required-message">This is a required question</div></div></div></div><div class="ss-form-question errorbox-good" role="listitem"><div dir="auto" class="ss-item ss-item-required ss-radio"><div class="ss-form-entry"><label class="ss-q-item-label" for="entry_353134239"><div class="ss-q-title">Title (Danh xưng)<label for="itemView.getDomIdToLabel()" aria-label="(Required field)"></label><span class="ss-required-asterisk" aria-hidden="true">*</span></div><div class="ss-q-help ss-secondary-text" dir="auto"></div></label><ul class="ss-choices" role="radiogroup" aria-label="Title (Danh xưng) "><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.1601763622" value="Ms (Cô)" id="group_1601763622_1" role="radio" class="ss-q-radio" aria-label="Ms (Cô)" required="" aria-required="true"></span><span class="ss-choice-label">Ms (Cô)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.1601763622" value="Mrs (Bà)" id="group_1601763622_2" role="radio" class="ss-q-radio" aria-label="Mrs (Bà)" required="" aria-required="true"></span><span class="ss-choice-label">Mrs (Bà)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.1601763622" value="Mr (Ông)" id="group_1601763622_3" role="radio" class="ss-q-radio" aria-label="Mr (Ông)" required="" aria-required="true"></span><span class="ss-choice-label">Mr (Ông)</span></label></li></ul><div class="error-message" id="353134239_errorMessage"></div><div class="required-message">This is a required question</div></div></div></div><div class="ss-form-question errorbox-good" role="listitem"><div dir="auto" class="ss-item ss-item-required ss-radio"><div class="ss-form-entry"><label class="ss-q-item-label" for="entry_188347165"><div class="ss-q-title">Age Group (Độ tuổi)<label for="itemView.getDomIdToLabel()" aria-label="(Required field)"></label><span class="ss-required-asterisk" aria-hidden="true">*</span></div><div class="ss-q-help ss-secondary-text" dir="auto"></div></label><ul class="ss-choices" role="radiogroup" aria-label="Age Group (Độ tuổi) "><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.778137647" value="Twenties (20 tuổi)" id="group_778137647_1" role="radio" class="ss-q-radio" aria-label="Twenties (20 tuổi)" required="" aria-required="true"></span><span class="ss-choice-label">Twenties (20 tuổi)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.778137647" value="Thirties (30 tuổi)" id="group_778137647_2" role="radio" class="ss-q-radio" aria-label="Thirties (30 tuổi)" required="" aria-required="true"></span><span class="ss-choice-label">Thirties (30 tuổi)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.778137647" value="Forties (40 tuổi)" id="group_778137647_3" role="radio" class="ss-q-radio" aria-label="Forties (40 tuổi)" required="" aria-required="true"></span><span class="ss-choice-label">Forties (40 tuổi)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.778137647" value="Fifties (50 tuổi)" id="group_778137647_4" role="radio" class="ss-q-radio" aria-label="Fifties (50 tuổi)" required="" aria-required="true"></span><span class="ss-choice-label">Fifties (50 tuổi)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.778137647" value="Over sixties (60 tuổi trở lên)" id="group_778137647_5" role="radio" class="ss-q-radio" aria-label="Over sixties (60 tuổi trở lên)" required="" aria-required="true"></span><span class="ss-choice-label">Over sixties (60 tuổi trở lên)</span></label></li></ul><div class="error-message" id="188347165_errorMessage"></div><div class="required-message">This is a required question</div></div></div></div><div class="ss-form-question errorbox-good" role="listitem"><div dir="auto" class="ss-item ss-item-required ss-text"><div class="ss-form-entry"><label class="ss-q-item-label" for="entry_1549689610"><div class="ss-q-title">Phone Number (Số điện thoại)<label for="itemView.getDomIdToLabel()" aria-label="(Required field)"></label><span class="ss-required-asterisk" aria-hidden="true">*</span></div><div class="ss-q-help ss-secondary-text" dir="auto"></div></label><input type="text" name="entry.1549689610" value="" class="ss-q-short" id="entry_1549689610" dir="auto" aria-label="Phone Number (Số điện thoại) " aria-required="true" required="" title=""><div class="error-message" id="199115508_errorMessage"></div><div class="required-message">This is a required question</div></div></div></div><div class="ss-form-question errorbox-good" role="listitem"><div dir="auto" class="ss-item ss-item-required ss-text"><div class="ss-form-entry"><label class="ss-q-item-label" for="entry_298737151"><div class="ss-q-title">Email Address (Địa chỉ email)<label for="itemView.getDomIdToLabel()" aria-label="(Required field)"></label><span class="ss-required-asterisk" aria-hidden="true">*</span></div><div class="ss-q-help ss-secondary-text" dir="auto"></div></label><input type="text" name="entry.298737151" value="" class="ss-q-short" id="entry_298737151" dir="auto" aria-label="Email Address (Địa chỉ email) " aria-required="true" required="" title=""><div class="error-message" id="1404972133_errorMessage"></div><div class="required-message">This is a required question</div></div></div></div><div class="ss-form-question errorbox-good" role="listitem"><div dir="auto" class="ss-item ss-item-required ss-radio"><div class="ss-form-entry"><label class="ss-q-item-label" for="entry_918336198"><div class="ss-q-title">Position (Chức vụ)<label for="itemView.getDomIdToLabel()" aria-label="(Required field)"></label><span class="ss-required-asterisk" aria-hidden="true">*</span></div><div class="ss-q-help ss-secondary-text" dir="auto"></div></label><ul class="ss-choices" role="radiogroup" aria-label="Position (Chức vụ) "><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.782435591" value="Management (Quản lý)" id="group_782435591_1" role="radio" class="ss-q-radio" aria-label="Management (Quản lý)" required="" aria-required="true"></span><span class="ss-choice-label">Management (Quản lý)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.782435591" value="Sales/Marketing (Bán hàng/ Tiếp thị)" id="group_782435591_2" role="radio" class="ss-q-radio" aria-label="Sales/Marketing (Bán hàng/ Tiếp thị)" required="" aria-required="true"></span><span class="ss-choice-label">Sales/Marketing (Bán hàng/ Tiếp thị)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.782435591" value="Administrative/Secretary (Hành chính/ Thư ký)" id="group_782435591_3" role="radio" class="ss-q-radio" aria-label="Administrative/Secretary (Hành chính/ Thư ký)" required="" aria-required="true"></span><span class="ss-choice-label">Administrative/Secretary (Hành chính/ Thư ký)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.782435591" value="Design (Thiết kế)" id="group_782435591_4" role="radio" class="ss-q-radio" aria-label="Design (Thiết kế)" required="" aria-required="true"></span><span class="ss-choice-label">Design (Thiết kế)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.782435591" value="Planning (Hoạch định)" id="group_782435591_5" role="radio" class="ss-q-radio" aria-label="Planning (Hoạch định)" required="" aria-required="true"></span><span class="ss-choice-label">Planning (Hoạch định)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.782435591" value="Procurement (Thu mua)" id="group_782435591_6" role="radio" class="ss-q-radio" aria-label="Procurement (Thu mua)" required="" aria-required="true"></span><span class="ss-choice-label">Procurement (Thu mua)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.782435591" value="Production/Manufacturing (Chế tạo/ Sản xuất)" id="group_782435591_7" role="radio" class="ss-q-radio" aria-label="Production/Manufacturing (Chế tạo/ Sản xuất)" required="" aria-required="true"></span><span class="ss-choice-label">Production/Manufacturing (Chế tạo/ Sản xuất)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.782435591" value="Advertisement/PR (Quảng cáo/ Quan hệ công chúng)" id="group_782435591_8" role="radio" class="ss-q-radio" aria-label="Advertisement/PR (Quảng cáo/ Quan hệ công chúng)" required="" aria-required="true"></span><span class="ss-choice-label">Advertisement/PR (Quảng cáo/ Quan hệ công chúng)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.782435591" value="Design (Thiết kế)" id="group_782435591_9" role="radio" class="ss-q-radio" aria-label="Design (Thiết kế)" required="" aria-required="true"></span><span class="ss-choice-label">Design (Thiết kế)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.782435591" value="__other_option__" id="group_782435591_10" role="radio" class="ss-q-radio ss-q-other-toggle" required="" aria-required="true"></span><span class="ss-choice-label">Other:</span></label><span class="ss-q-other-container goog-inline-block"><input type="text" name="entry.782435591.other_option_response" value="" class="ss-q-other" id="entry_782435591_other_option_response" dir="auto" aria-label="Other"></span></li></ul><div class="error-message" id="918336198_errorMessage"></div><div class="required-message">This is a required question</div></div></div></div><div class="ss-form-question errorbox-good" role="listitem"><div dir="auto" class="ss-item ss-checkbox"><div class="ss-form-entry"><label class="ss-q-item-label" for="entry_1640109934"><div class="ss-q-title">How did you come to know (Bạn biết đến Triển lãm qua hình thức nào)?</div><div class="ss-q-help ss-secondary-text" dir="auto"></div></label><ul class="ss-choices" role="group" aria-label="How did you come to know (Bạn biết đến Triển lãm qua hình thức nào)? "><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="checkbox" name="entry.351742749" value="Invitation (Giấy mời)" id="group_351742749_1" role="checkbox" class="ss-q-checkbox"></span><span class="ss-choice-label">Invitation (Giấy mời)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="checkbox" name="entry.351742749" value="E-mail" id="group_351742749_2" role="checkbox" class="ss-q-checkbox"></span><span class="ss-choice-label">E-mail</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="checkbox" name="entry.351742749" value="Vendor/Supplier (Nhà bán hàng/ Nhà cung cấp)" id="group_351742749_3" role="checkbox" class="ss-q-checkbox"></span><span class="ss-choice-label">Vendor/Supplier (Nhà bán hàng/ Nhà cung cấp)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="checkbox" name="entry.351742749" value="Newspaper (Báo chí)" id="group_351742749_4" role="checkbox" class="ss-q-checkbox"></span><span class="ss-choice-label">Newspaper (Báo chí)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="checkbox" name="entry.351742749" value="Telephone (Điện thoại)" id="group_351742749_5" role="checkbox" class="ss-q-checkbox"></span><span class="ss-choice-label">Telephone (Điện thoại)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="checkbox" name="entry.351742749" value="Exhibition’Homepage (Trang web của triển lãm)" id="group_351742749_6" role="checkbox" class="ss-q-checkbox"></span><span class="ss-choice-label">Exhibition’Homepage (Trang web của triển lãm)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="checkbox" name="entry.351742749" value="Other Internet Sites (Các trang web)" id="group_351742749_7" role="checkbox" class="ss-q-checkbox"></span><span class="ss-choice-label">Other Internet Sites (Các trang web)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="checkbox" name="entry.351742749" value="Related Association/Organization(Hiệp hội liên quan/ Tổ chức liên quan)" id="group_351742749_8" role="checkbox" class="ss-q-checkbox"></span><span class="ss-choice-label">Related Association/Organization(Hiệp hội liên quan/ Tổ chức liên quan)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="checkbox" name="entry.351742749" value="Industry Magazine (Tạp chí chuyên ngành)" id="group_351742749_9" role="checkbox" class="ss-q-checkbox"></span><span class="ss-choice-label">Industry Magazine (Tạp chí chuyên ngành)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="checkbox" name="entry.351742749" value="General Magazine (Tạp chí tổng hợp)" id="group_351742749_10" role="checkbox" class="ss-q-checkbox"></span><span class="ss-choice-label">General Magazine (Tạp chí tổng hợp)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="checkbox" name="entry.351742749" value="__other_option__" id="group_351742749_11" role="checkbox" class="ss-q-checkbox ss-q-other-toggle"></span><span class="ss-choice-label">Other:</span></label><span class="ss-q-other-container goog-inline-block"><input type="text" name="entry.351742749.other_option_response" value="" class="ss-q-other" id="entry_351742749_other_option_response" dir="auto" aria-label="Other"></span></li></ul><div class="error-message" id="1640109934_errorMessage"></div><div class="required-message">This is a required question</div></div></div></div><div class="ss-form-question errorbox-good" role="listitem"><div dir="auto" class="ss-item ss-item-required ss-radio"><div class="ss-form-entry"><label class="ss-q-item-label" for="entry_1870811353"><div class="ss-q-title">Which exhibition are you interested in? (Anh/chị quan tâm đến triển lãm nào?)<label for="itemView.getDomIdToLabel()" aria-label="(Required field)"></label><span class="ss-required-asterisk" aria-hidden="true">*</span></div><div class="ss-q-help ss-secondary-text" dir="auto"></div></label><ul class="ss-choices" role="radiogroup" aria-label="Which exhibition are you interested in? (Anh/chị quan tâm đến triển lãm nào?) "><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.179518407" value="Vietnam Int’ Retail &amp; Franchise Exhibition (Triển lãm Nhượng quyền TH và Ngành Bán lẻ)" id="group_179518407_1" role="radio" class="ss-q-radio" aria-label="Vietnam Int’ Retail &amp; Franchise Exhibition (Triển lãm Nhượng quyền TH và Ngành Bán lẻ)" required="" aria-required="true"></span><span class="ss-choice-label">Vietnam Int’ Retail &amp; Franchise Exhibition (Triển lãm Nhượng quyền TH và Ngành Bán lẻ)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.179518407" value="Vietnam Int’ Maternity.Baby.Kids Fair (Triển lãm SPDV cho Mẹ và Trẻ em)" id="group_179518407_2" role="radio" class="ss-q-radio" aria-label="Vietnam Int’ Maternity.Baby.Kids Fair (Triển lãm SPDV cho Mẹ và Trẻ em)" required="" aria-required="true"></span><span class="ss-choice-label">Vietnam Int’ Maternity.Baby.Kids Fair (Triển lãm SPDV cho Mẹ và Trẻ em)</span></label></li><li class="ss-choice-item"><label><span class="ss-choice-item-control goog-inline-block"><input type="radio" name="entry.179518407" value="Korea Sourcing Fair (Triển lãm Sản phẩm Hàn Quốc)" id="group_179518407_3" role="radio" class="ss-q-radio" aria-label="Korea Sourcing Fair (Triển lãm Sản phẩm Hàn Quốc)" required="" aria-required="true"></span><span class="ss-choice-label">Korea Sourcing Fair (Triển lãm Sản phẩm Hàn Quốc)</span></label></li></ul><div class="error-message" id="1870811353_errorMessage"></div><div class="required-message">This is a required question</div></div></div></div><input type="hidden" name="draftResponse" value="[,,&quot;-4975040132330506516&quot;]"><input type="hidden" name="pageHistory" value="0"><input type="hidden" name="fvv" value="0"><input type="hidden" name="fbzx" value="-4975040132330506516"><div class="ss-item ss-navigate"><table id="navigation-table"><tbody><tr><td class="ss-form-entry goog-inline-block" id="navigation-buttons" dir="ltr"><input type="submit" name="submit" value="Submit" id="ss-submit" class="jfk-button jfk-button-action "><div class="ss-password-warning ss-secondary-text">Never submit passwords through Google Forms.</div></td></tr></tbody></table></div></ol></form></div><div class="ss-footer"><div class="ss-attribution"></div><div class="ss-legal"><div class="disclaimer-separator"></div><div class="disclaimer" dir="ltr"><div class="powered-by-logo"><span class="powered-by-text">Powered by</span><a href="https://www.google.com/forms/about/?utm_source=product&amp;utm_medium=forms_logo&amp;utm_campaign=forms"><div class="ss-logo-container ss-logo-css-container"><div class="ss-logo-image"></div><span class="aria-only-help">Google Forms</span></div></a></div><div class="ss-terms"><span class="disclaimer-msg">This content is neither created nor endorsed by Google.</span><br><a href="https://docs.google.com/forms/d/1zvabN4vLza9aDKB5pytzsNsClyB6jmmha_4cfueb4AE/reportabuse?source=https://docs.google.com/forms/d/1zvabN4vLza9aDKB5pytzsNsClyB6jmmha_4cfueb4AE/viewform">Report Abuse</a>-<a href="http://www.google.com/accounts/TOS">Terms of Service</a>-<a href="http://www.google.com/google-d-s/terms.html">Additional Terms</a></div></div></div></div><div id="docs-aria-speakable" class="docs-a11y-ariascreenreader-speakable docs-offscreen" aria-live="assertive" role="region" aria-atomic="" aria-relevant="additions">Screen reader support enabled. </div></div><a class="ss-edit-link" href="https://docs.google.com/forms/d/1zvabN4vLza9aDKB5pytzsNsClyB6jmmha_4cfueb4AE/edit">Edit this form</a><script type="text/javascript" src="/static/forms/client/js/3675641127-formviewer_prd.js"></script><script type="text/javascript">H5F.setup(document.getElementById("ss-form")); _initFormViewer( "[100,,[]\n]\n");</script></div></body>'
}

function renderSurvey() {
	// Definations
	// var provinces = ["An Giang", "Bà Rịa - Vũng Tàu", "Bạc Liêu"];
	// var ethnics = ["Kinh", "Mường", "Tày"];
	// var $formSurvey = $('#formSurvey'),
	// 	$formTemp = $formSurvey.find('#ss-form'),
	// 	$tabHead = $('#tabHead'),
	// 	$tabContent = $('#tabContent');

	// // Render tabs and tab panes
	// for (var i = 0; i < 20; i++) {
	// 	$tabHead.append('<li><a data-toggle="tab" href="#page_'+i+'"></a></li>');
	// 	$tabContent.append('<div class="tab-pane fade in" id="page_'+i+'"></div>');
	// }
	// $tabHead.children().first().addClass('active');
	// $tabContent.children().first().addClass('active');

	// // Render tab panes' contents
	// var s = null;
 // 	s = renderTextQuestion({
 // 		question: "Họ, chữ đệm, tên thí sinh"
 // 	});
 // 	// Page 0
	// $('#page_0').append(s);
	// s = renderRadioQuestion({
	// 	question: "Giới",
	// 	choices: ["Nam", "Nữ"]
	// });
	// $('#page_0').append(s);
	// // Page 1
	// s = renderDateQuestion({
	// 	question: "Ngày, tháng, năm sinh"
	// });
	// $('#page_1').append(s);
	// // Page 2
	// s = renderSelectQuestion({
	// 	question: "Nơi sinh",
	// 	choices: provinces
	// });
	// $('#page_2').append(s);
	// s = renderSelectQuestion({
	// 	question: "Dân tộc",
	// 	choices: ethnics
	// });
	// $('#page_2').append(s);
	// // Page 3
	// s = renderTextQuestion({
	// 	question: "Số chứng minh nhân dân/Thẻ căn cước công dân",
	// });
	// $('#page_3').append(s);
	// // Page 4
	// $('#page_4').prepend('<h2>Hộ khẩu thường trú</h2>');
	// s = renderSelectQuestion({
	// 	question: "Tỉnh/thành",
	// 	choices: provinces
	// });
	// $('#page_4').append(s);
	// s = renderSelectQuestion({
	// 	question: "Quận/huyện",
	// 	choices: ["Quận 1", "Quận 2", "Quận 3"]
	// });
	// $('#page_4').append(s);
	// s = renderSelectQuestion({
	// 	question: "Xã/phường",
	// 	choices: ["Phường 1", "Phường 2", "Phường 3"]
	// });
	// $('#page_4').append(s);
	// // Page 5
	// s = renderSelectQuestion({
	// 	question: "Xã/phường",
	// 	choices: ["Phường 1", "Phường 2", "Phường 3"]
	// });
	// $('#page_5').append(s);

	// $tabContent.append($('.tab-control').show());
	// $('[aria-label*="Phone"]').attr('type', 'tel');
	// $('[aria-label*="Email"]').attr('type', 'email');
	// $('.required-message').html('Required question (Câu hỏi bắt buộc)');

	setDisplayStatus();
	restructureChoices();
}

function renderTextQuestion(data) {
	var template = $('#tplText').html();
	var result = $('<div/>').html(template).contents();
	result.find('.ss-q-title').html(data.question);
	return result;
}

function renderRadioQuestion(data) {
	var template = $('#tplRadio').html();
	var result = $('<div/>').html(template).contents();
	result.find('.ss-q-title').html(data.question);
	$.each(data.choices, function(i, e) {
		var tplItem = $('#tplRadioItem').html();
		var item = $('<div/>').html(tplItem).contents();
		item.find('.ss-choice-label').html(e);
		result.find('.ss-choices').append(item);	
	});
	return result;
}

function renderCheckboxQuestion(data) {
	var template = $('#tplCheckbox').html();
	var result = $('<div/>').html(template).contents();
	result.find('.ss-q-title').html(data.question);
	$.each(data.choices, function(i, e) {
		var tplItem = $('#tplCheckboxItem').html();
		var item = $('<div/>').html(tplItem).contents();
		item.find('.ss-choice-label').html(e);
		result.find('.ss-choices').append(item);	
	});
	return result;
}

function renderSelectQuestion(data) {
	var template = $('#tplSelect').html();
	var result = $('<div/>').html(template).contents();
	result.find('.ss-q-title').html(data.question);
	$.each(data.choices, function(i, e) {
		var tplItem = $('#tplSelectItem').html();
		var item = '<option>'+e+'</option>';
		result.find('.ss-choices').append(item);
	});
	return result;
}

function renderDateQuestion(data) {
	var template = $('#tplDate').html();
	var result = $('<div/>').html(template).contents();
	result.find('.ss-q-title').html(data.question);
	return result;
}