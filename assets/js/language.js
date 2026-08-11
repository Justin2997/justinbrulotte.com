(function () {
  'use strict';

  var supportedLanguages = ['en', 'fr'];
  var currentLanguage = document.documentElement.dataset.language || 'en';
  var storedLanguage;

  try {
    storedLanguage = window.localStorage.getItem('site-language');
  } catch (error) {
    storedLanguage = null;
  }

  var browserLanguage = (navigator.language || 'en').toLowerCase().split('-')[0];
  var preferredLanguage = supportedLanguages.indexOf(storedLanguage) !== -1
    ? storedLanguage
    : (supportedLanguages.indexOf(browserLanguage) !== -1 ? browserLanguage : 'en');

  if (preferredLanguage !== currentLanguage) {
    var destination = new URL(window.location.href);
    var lastSlash = destination.pathname.lastIndexOf('/') + 1;
    destination.pathname = destination.pathname.slice(0, lastSlash) + (preferredLanguage === 'fr' ? 'fr.html' : 'index.html');
    window.location.replace(destination.toString());
    return;
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-language-option]').forEach(function (link) {
      link.addEventListener('click', function () {
        try {
          window.localStorage.setItem('site-language', link.dataset.languageOption);
        } catch (error) {
          // Navigation still works when storage is unavailable.
        }
      });
    });
  });
})();
