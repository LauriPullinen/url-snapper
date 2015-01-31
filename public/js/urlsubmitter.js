$(document).ready(function() {
	$("form").submit(function() {
		var formData = $(this).serialize();
		$.ajax({
			url: "/",
			method: "POST",
			data: formData,
			success: function(data) {
				$("#short-url").attr("href",data).html(data);
				$("#short-url-container").show();
			},
			error: function() {
			}
		});
		return false;
	});
});