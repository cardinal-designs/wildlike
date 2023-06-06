// Hack to get IE to mimic object-fit
// for page hero background images
const objectFitIE = () => {
  if (window.location.href.includes('pages')) {
    if('objectFit' in document.documentElement.style === false) {
      const hero = document.getElementsByClassName('hero');
      if (hero.length > 0) {
        const img = hero[0].getElementsByTagName('img');
        if (img) {
          const imgUrl = img[0].src;
          hero[0].style.backgroundImage = 'url(' + imgUrl + ')';
          hero[0].className += ' compat-object-fit';
        }
      }
    }
  }
}

document.addEventListener('ready', objectFitIE());
