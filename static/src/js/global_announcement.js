
export default () => {
  const gaElement = document.querySelector('.global-announcement')

  if (gaElement && localStorage.getItem(`ga:dismissed:${gaElement.getAttribute('data-dismiss-key')}`) != 1) {
    gaElement.classList.add('global-announcement--visible')
  }
}
