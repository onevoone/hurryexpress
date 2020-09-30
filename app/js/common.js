var $trackForm = $('#track-form');


function makeRequst(data) {
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: '/response.json',
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
		makeRequst({ trackNumber: form_values[0].value });

	})
}
