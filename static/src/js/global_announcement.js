export default () => {
  const gaElement = document.querySelector('.global-announcement');
  if (gaElement) {
    const lsFlag = localStorage.getItem(
      `ga:dismissed:${gaElement.getAttribute('data-dismiss-key')}`
    );
    if (lsFlag !== 1) {
      gaElement.classList.add('global-announcement--visible');
    }
  }
};
