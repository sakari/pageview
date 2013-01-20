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

    function pageview(container) {
        var url = relativeTo(root,
                             document.location.hash.replace(/^#/, ''))
        $.get(url,
              function(data, status, jqxhr) {
                  var rendered
                  var contentType = jqxhr.getResponseHeader('content-type');
                  if(contentType.match(/text\/html/) || url.match(/\.html$/))
                      rendered = $(data);
                  if(url.match(/\.md/))
                      var rendered = $(marked(data))

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

                  rendered.find('img').each(function(ix, img) {
                      img = $(img);
                      if(isExternalUrl(img.attr('src')))
                          return;
                      img.attr('src',
                               relativeTo(root,
                                          document.location.hash.replace(/^#/, ''),
                                          img.attr('src')))
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