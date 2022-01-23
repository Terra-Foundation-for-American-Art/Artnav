var hasClass = function (el, className) {
  if (el.classList) {
    return el.classList.contains(className)
  }
  return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

var addClass = function (el, className) {
  if (el.classList) {
    el.classList.add(className)
  } else if (!hasClass(el, className)) {
    el.className += ' ' + className
  }
}

var removeClass = function (el, className) {
  if (el.classList) {
    el.classList.remove(className)
  } else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className = el.className.replace(reg, ' ')
  }
}

module.exports = {
  hasClass,
  addClass,
  removeClass
}
