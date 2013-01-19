(function() {
    function relativeTo(from, to) {
        var dirname = from.replace(/[^\/]+$/, '')
        return dirname + to
    }

    function pageview(container, url) {
        console.log('loading ' + url);
        $.get(url, function(data) {
            var document = $(marked(data))

            document.find('a').each(function(ix, value) {
                value = $(value)
                value.attr('href', relativeTo(url, value.attr('href')));
                value.click(function(event) {
                    pageview(container, value.attr('href'))
                    event.preventDefault()
                })
            });

            document.find('img').each(function(ix, img) {
                img = $(img);
                img.attr('src', relativeTo(url, img.attr('src')))
            });
            container.html(document)
        })
    }

    $(function() {
        $('.pageview').each(function(ix, value) {
            value = $(value);
            pageview(value, value.attr('data-pageview-url'))
        })
    })
})()