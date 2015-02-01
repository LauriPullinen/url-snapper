$(document).ready(function() {
	$("form").submit(function() {
		var formData = $(this).serialize();
		$.ajax({
			url: "/",
			method: "POST",
			data: formData,
			success: function(data) {
				$("#short-url-container input").val(window.location.protocol + 
					"//" + window.location.host + "/" + data);
				$("#short-url-container").show();
				$("#short-url-container input").select();
			},
			error: function() {
			}
		});
		return false;
	});
});