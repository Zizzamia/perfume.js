export const visibility = {
  isHidden: false,
};

/**
 * From visibilitychange listener it saves only when
 * the page gets hidden, because it's important to not
 * use the wrong "hidden" value when send timing or logging.
 */
export const didVisibilityChange = function(cb: Function) {
  if (document.hidden) {
    cb();
    visibility.isHidden = document.hidden;
  }
};
