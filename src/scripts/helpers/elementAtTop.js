// Detects if an element is at top of screen and adds class

export const elementAtTop = (element) => {
  const el = document.querySelector(element);
  const boundRect = el.getBoundingClientRect();
  if(boundRect.top < 1 && ![...el.classList].includes('is-at-top')) {
    el.classList.add('is-at-top');
  }
  else if (document.documentElement.scrollTop < 570) {
    el.classList.remove('is-at-top');
  }
};