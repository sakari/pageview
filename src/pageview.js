(function() {
    var apiRoot, imgRoot

    function relativeTo() {
        var url = arguments[0];
        for(var i = 1; i < arguments.length; i++) {
            url = url.replace(/[^\/]+$/, '') + arguments[i]
        }
        return url
    }

    function isExternalUrl(url) {
        return url.match(/^https?:\/\//)
    }

    function renameImgSrc(base, data) {
        var p = data.replace(/(<\s*img [^>]*)\bsrc="([^">]+)"/,
                             function(src, pre, url) {
                                 if(isExternalUrl(url))
                                     return src
                                 return pre + 'src="' + relativeTo(base, url) + '"'
                             })
        return p
    }

    function pageview(container) {
        var url = relativeTo(apiRoot,
                             document.location.hash.replace(/^#/, ''))
        var imgUrl = relativeTo(imgRoot,
                                document.location.hash.replace(/^#/, ''))

        $.getJSON(url + '?callback=?')
            .done(function(data) {
                var rendered
                if(url.match(/\.html$/))
                    rendered = $(renameImgSrc(imgUrl, data));
                if(url.match(/\.md/))
                    var rendered = $(renameImgSrc(imgUrl, marked(data)))

                rendered.find('a').each(function(ix, value) {
                    value = $(value)

                    if(isExternalUrl(value.attr('href')))
                        return;

                    var loadRelative = relativeTo(document.location.hash.replace(/^#/, ''),
                                                  value.attr('href'));
                    value.attr('href', '')
                    value.click(function(event) {
                        document.location.hash = loadRelative
                        event.preventDefault()
                    });
                });
                container.html(rendered)
            })
    }

    $(function() {
        var container = $('.pageview')
        apiRoot = 'https://api.github.com/repos/' +
            container.attr('data-pageview') + '/contents/'
        imgRoot = 'https://raw.github.com/' +
            container.attr('data-pageview') +
            '/master/'

        $(window).bind('hashchange', function() {
            pageview(container)
        })
        pageview(container)
    })
})()