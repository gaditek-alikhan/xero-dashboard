$(function() {

    $("#topic_title").autocomplete({
        source: "/blog/inc/2013/07/jquery-ui-autocomplete-step-by-step/post/ajax_autocomplete.php",
        minLength: 2,
        select: function(event, ui) {
            var url = ui.item.id;
            if(url != '#') {
                location.href = '/blog/' + url;
            }
        },
        html: true,
        // optional
        open: function(event, ui) {
            $(".ui-autocomplete").css("z-index", 1000);
        }
    });

});
