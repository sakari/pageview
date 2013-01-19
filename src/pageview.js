(function() {
    function pageview(container, url) {
        console.log('loading ' + url);
        $.get(url, function(data) {
            container.html(marked(data))
        })
    }

    $(function() {
        $('.pageview').each(function(ix, value) {
            value = $(value);
            pageview(value, value.attr('data-pageview-url'))
        })
    })
})()