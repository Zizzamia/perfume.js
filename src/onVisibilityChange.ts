export const visibility = {
  isHidden: false,
  didChange: false,
};

/**
 * From visibilitychange listener it saves only when
 * the page gets hidden, because it's important to not
 * use the wrong "hidden" value when send timing or logging.
 */
export const didVisibilityChange = function() {
  visibility.isHidden = false;
  if (document.hidden) {
    visibility.isHidden = document.hidden;
    visibility.didChange = true;
  }
};
