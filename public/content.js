if(location.host.indexOf('meituan.com') > -1){
  /* eslint-disable */
  console.log('welcome to meituan')
  /* eslint-enable */
  setInterval(function () {
    let cookie = document.cookie && document.cookie.split(';') || [],
    cookies = {}
    cookie.forEach(function(c) {
      let result = c.split('=').map(function(r){
        return r.trim()
      })
      cookies[result[0]] = result[1]
    })
    let new_cookie = ''
    Object.keys(cookies).concat(['uuid']).forEach(function (key) {
      console.log(key)
      new_cookie += key + '=' + (key === 'uuid' ? Math.random() * 1000000 : cookies[key]) + '; max-age= '+ (new Date()).toUTCString() +'; domain=.meituan.com; path=/; expires=' + (new Date()).toUTCString() + '; '
    })
    if(new_cookie){
      document.cookie = new_cookie
    }
    setTimeout(() => {
      let frame = document.getElementById('refresh'),
        links = document.getElementsByTagName('a'),
        link = ''
      if(!frame){
        frame = document.createElement('iframe')
        frame.style.display = 'none'
        frame.id = 'refresh'
        document.body.append(frame)
      }
      while (link.indexOf('.meituan.com') === -1){
        link = links[Math.floor(Math.random() * links.length)].href
      }
      frame.src = link
    }, 1000)
  }, 9000)
}