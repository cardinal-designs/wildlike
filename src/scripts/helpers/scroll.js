// Used to scroll page so that the top of the window is flush with the next element below the target
// provide the element class/id/data attribute (whatever you want that querySelector supports) that you
// wish to scroll to the bottom of.
import cssVars from '../../styles/variables.scss';

const scrollBelowElement = (element) => {
  const el = element instanceof Element ? element : document.querySelector(element);
  const boundRect = el.getBoundingClientRect();
  window.scrollTo({
    top: boundRect.bottom,
    left: 0,
    behavior: 'smooth',
  });
};

// scrolls to top or bottom of document. Specify 'top' or 'bottom'

const scrollToTopBottom = (position) => {
  if (position === 'top') {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  if (position === 'bottom') {
    const documentHeight = document.body.scrollHeight;
    window.scrollTo({
      top: documentHeight,
      left: 0,
      behavior: 'smooth',
    });
  }
};

/**
 * @desc scroll to an element with ID. smoothly if supported.
 * @param {Event} e
 * @param {String} id
 */
export const scrollToId = (e, id) => {
  const target = document.querySelector(id);
  if (!target) return;

  const desktopUp = matchMedia(`(min-width: ${cssVars.breakDesktop})`).matches;
  const position = window.pageYOffset + target.getBoundingClientRect().top;
  let header = document.querySelector('.header-search-bar');
  let offset = 0;
  if (header || !desktopUp) {
    if (!header) {
      header = document.querySelector('.navbar');
    }
    const headerRect = header.getBoundingClientRect();
    offset = -(headerRect.top + headerRect.height);
  }

  if (e) {
    e.preventDefault();
  }

  window.scrollTo({
    behavior: 'smooth',
    top: position + offset,
  });
};

export { scrollBelowElement, scrollToTopBottom };
