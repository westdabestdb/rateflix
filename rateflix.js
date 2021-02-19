window.onload = function () {
  const view = document.querySelector('.focus-trap-wrapper')
  if (view) {
    getData();
  }
}
const observer = new MutationObserver(onMutation);
observer.observe(document, {
  childList: true,
  subtree: true,
});
function onMutation(mutations) {
  for (const { addedNodes } of mutations) {
    for (const node of addedNodes) {
      if (node.tagName && (node.classList.contains('detail-modal-container') || node.classList.contains('video-metadata--adBadge-container') || node.classList.contains('previewModal--player-titleTreatment-logo'))) {
        getData();
        return false;
      }
    }
  }
}
function getData() {
  let moviename;
  const arr = ['.previewModal--boxart', '.playerModel--player__storyArt', '.previewModal--player-titleTreatment-logo'];
  arr.forEach(a => {
    let image = document.querySelector(a);
    if (image) {
      let name = image.getAttribute('alt');
      if (name) {
        moviename = name;
        return;
      }
    }
  })
  fetch(`https://www.omdbapi.com/?apikey=7b1f0f9b&t=${moviename}`)
    .then(data => data.json())
    .then(async data => {
      const container = document.querySelector('.previewModal--detailsMetadata-right');
      if (!container.innerHTML.toString().includes('previewModal--tags-rate-imdb')) {
        let elem = '';
        if (data.Error != undefined || data.Error != null || data.Ratings.length == 0) {
          elem += `<div class="previewModal--tags previewModal--tags-rate-imdb"><span class="previewModal--tags-label">No rating data found. </span></div>`;
          container.innerHTML = elem + container.innerHTML;
          return false;
        }
        data.Ratings.forEach(rating => {
          elem += `<div class="previewModal--tags previewModal--tags-rate-imdb" data-uia="previewModal--tags-rate-imdb"><span class="previewModal--tags-label">${rating.Source == 'Internet Movie Database' ? 'IMDB' : rating.Source}: </span><span class="tag-item" data-uia="tag-item">${rating.Value}</span></div>`
        })

        container.innerHTML = elem + container.innerHTML;
      }

    })
}