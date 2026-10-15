(() => {
  'use strict';
  const publications = [...document.querySelectorAll('.publication')];
  const controls = document.querySelector('.publication-controls');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const search = document.querySelector('#publication-search');
  const toggle = document.querySelector('#show-publications');
  const count = document.querySelector('#publication-count');
  const empty = document.querySelector('#no-results');
  const limit = 6;
  let selectedYear = 'all';
  let expanded = false;
  const searchable = new Map(publications.map(p => [p, p.textContent.toLowerCase()]));
  function updatePublications() {
    const query = search.value.trim().toLowerCase();
    const filtered = publications.filter(p => {
      const year = p.dataset.year;
      const matchesYear = selectedYear === 'all' || (selectedYear === 'earlier' ? Number(year) <= 2024 : year === selectedYear);
      return matchesYear && searchable.get(p).includes(query);
    });
    const filtering = selectedYear !== 'all' || query.length > 0;
    const visible = filtering || expanded ? filtered : filtered.slice(0, limit);
    const visibleSet = new Set(visible);
    publications.forEach(p => { p.hidden = !visibleSet.has(p); });
    count.textContent = `Showing ${visible.length} of ${filtered.length} publication${filtered.length === 1 ? '' : 's'}`;
    empty.hidden = filtered.length !== 0;
    toggle.hidden = filtering || filtered.length <= limit;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.innerHTML = expanded ? 'Show fewer publications <span aria-hidden="true">↑</span>' : `View all ${publications.length} publications <span aria-hidden="true">↓</span>`;
  }
  controls.hidden = false;
  count.hidden = false;
  filters.forEach(button => button.addEventListener('click', () => {
    selectedYear = button.dataset.filter;
    filters.forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    updatePublications();
  }));
  search.addEventListener('input', updatePublications);
  toggle.addEventListener('click', () => {
    expanded = !expanded;
    updatePublications();
    if (!expanded) {
      // Keep focus and scroll near the collapsed bibliography after shortening it.
      toggle.scrollIntoView({block:'center', behavior:'instant'});
    }
  });
  updatePublications();
  const navLinks = [...document.querySelectorAll('.top-nav a')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const setActive = id => navLinks.forEach(link => {
    const active = link.hash === `#${id}`;
    link.classList.toggle('active', active);
    if(active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
  });
  let scheduled = false;
  function updateNavigation() {
    let current = sections[0];
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= 170) current = section;
    });
    if (current) setActive(current.id);
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); }
  }, {passive:true});
  updateNavigation();
})();
