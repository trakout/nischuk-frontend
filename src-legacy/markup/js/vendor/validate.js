// wait for the DOM to be loaded  
   $(document).ready(function() {
		// bind form using ajaxForm
		$('.err-msg').hide();
		$('.load').hide();
		$('#register').ajaxForm({
		beforeSubmit: validate,
			// success identifies the function to invoke when the server response
			// has been received; here we apply a fade-in effect to the new content
			success: function() {
				$('#success_box').fadeIn('slow');
				$('#register').fadeOut('slow');
			}
		});

		$('input[name=FullName]').keypress(function() {
			$("#Name_error").hide();
		});
		$('input[name=emailAddress]').keypress(function() {
			$("#emailAddress_error").hide();
			$("#emailAddress_error2").hide();
		});
		$('input[name=Subject]').keypress(function() {
			$("#Subject_error").hide();
		});
		$('textarea[name=comments]').keypress(function() {
			$("#comment_error").hide();
		});

   }); 

	function isValidEmailAddress(emailAddress) {
		var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		return pattern.test(emailAddress);
	}

	function validate(formData, jqForm, options) {
		$(".load").show();

		var firstnamevalue = $('input[name=FullName]').fieldValue();
		var emailvalue = $('input[name=emailAddress]').fieldValue();
		var phonenumbervalue = $('input[name=Subject]').fieldValue(); 
		var howdidyouhear = $('textarea[name=comments]').fieldValue();

		var errors = 0;

		// First Name
		if (firstnamevalue == "") {
			$("#Name_error").show();
			$("input#FullName").focus();
			$('.load').hide();
			errors++;
		} else {
			$("#Name_error").hide();
		}	

		// email Validation		
		if (emailvalue == "") {		
			$("#emailAddress_error").hide();
			$("#emailAddress_error2").show();
				$("input#emailAddress").focus();
				$('.load').hide();
				errors++;
		}else{
			if (isValidEmailAddress(emailvalue)) {
				$("#emailAddress_error").hide();
				$("#emailAddress_error2").hide();
			}else{
				$("#emailAddress_error").hide();
				$("#emailAddress_error2").show();
				$("input#emailAddress").focus();
				$('.load').hide();
				errors++;
			}
		}
		// Phone Number
		if (phonenumbervalue == "") {
			$("#Subject_error").show();
			$("input#Subject").focus();
			$('.load').hide();
			errors++;
		} else {
			$("#Subject_error").hide();
		}			
		// Phone Number
		if (howdidyouhear == "") {
			$("#comment_error").show();
			$("textarea#comments").focus();
			$('.load').hide();
			errors++;
		} else {
			$("#comment_error").hide();
		}
		if (errors > 0) {
			return false;
		}
	}