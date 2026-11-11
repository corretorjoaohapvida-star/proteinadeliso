(function () {
  'use strict';
  const filterButtons = Array.from(document.querySelectorAll('[data-recipe-filter]'));
  const recipeCards = Array.from(document.querySelectorAll('[data-recipe-type]'));
  const filterStatus = document.querySelector('.recipe-filter-status');
  filterButtons.forEach(button => button.addEventListener('click', function () {
    const choice = button.dataset.recipeFilter;
    filterButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    let visible = 0;
    recipeCards.forEach(card => {
      card.hidden = choice !== 'todos' && card.dataset.recipeType !== choice;
      if (!card.hidden) visible += 1;
    });
    if (filterStatus) filterStatus.textContent = visible === 1 ? '1 ideia em exibição' : visible + ' ideias em exibição';
  }));
  const reviews = document.querySelector('.reviews');
  if (reviews) {
    const group = reviews.querySelector('.reviews-group');
    const track = reviews.querySelector('.reviews-track');
    const toggle = reviews.querySelector('.reviews-toggle');
    const viewport = reviews.querySelector('.reviews-viewport');
    if (group && track && toggle && viewport) {
      const duplicate = group.cloneNode(true);
      duplicate.setAttribute('aria-hidden', 'true');
      duplicate.setAttribute('inert', '');
      track.appendChild(duplicate);
      toggle.hidden = false;
      reviews.classList.add('is-running');
      toggle.addEventListener('click', function () {
        const paused = reviews.classList.toggle('is-paused');
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.textContent = paused ? 'Continuar comentários' : 'Pausar comentários';
        if (!paused) viewport.scrollLeft = 0;
      });
    }
  }
  const trigger = document.getElementById('sticky-trigger');
  const sticky = document.querySelector('.mobile-offer');
  if (!trigger || !sticky) return;
  function updateSticky() {
    sticky.classList.toggle('is-visible', trigger.getBoundingClientRect().top < 0);
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(updateSticky, { threshold: [0, 1] });
    observer.observe(trigger);
    window.addEventListener('resize', updateSticky, { passive: true });
  } else {
    let pending = false;
    window.addEventListener('scroll', function () {
      if (!pending) {
        pending = true;
        requestAnimationFrame(function () { pending = false; updateSticky(); });
      }
    }, { passive: true });
    window.addEventListener('resize', updateSticky, { passive: true });
  }
  window.addEventListener('pageshow', updateSticky);
  updateSticky();
}());
