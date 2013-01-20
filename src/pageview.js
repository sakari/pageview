(function() {
    var root

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
        var url = relativeTo(root,
                             document.location.hash.replace(/^#/, ''))

        $.ajax({headers: { Accept: 'application/vnd.github.v3.raw'}})
            .done(function(data) {
                var rendered
                if(url.match(/\.html$/))
                    rendered = $(renameImgSrc(url, data));
                if(url.match(/\.md/))
                    var rendered = $(renameImgSrc(url, marked(data)))

                rendered.find('a').each(function(ix, value) {
                    value = $(value)

                    if(isExternalUrl(value.attr('href')))
                        return;

                    var loadRelative = relativeTo(document.location.hash.replace(/^#/, ''),
                                                  value.attr('href'));
                    value.attr('href', relativeTo(root, loadRelative))
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
        root = container.attr('data-pageview-url')
        if(!root.match('/'))
            root = root + '/'
        $(window).bind('hashchange', function() {
            pageview(container)
        })
        pageview(container)
    })
})()