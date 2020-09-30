var $trackForm = $('#track-form');


function makeSuccessfulRequest(data) {
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: '/success.json',
		data : JSON.stringify(data),
		success: function(data) {
			alert(data.response);
		}  
	});
}


function makeFailedRequest(data) {
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: '/error.json',
		data : JSON.stringify(data),
		success: function(data) {
			alert(data.response);
		}  
	});
}


if ($trackForm.length > 0) {
	$('form button[type="submit"]').bind('click', function (event) {
		if (event) event.preventDefault()

		var form_values = $trackForm.serializeArray();

		if (form_values[0].value.length > 0) {
			makeSuccessfulRequest({ trackNumber: form_values[0].value });
		} else {
			makeFailedRequest()
		}
	})
}
