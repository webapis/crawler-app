function getFaviconUrl() {
    // Get all the link elements on the page.
    const linkElements = document.querySelectorAll('link');
  
    // Find the link element with the rel attribute set to "icon" or "shortcut icon".
    const faviconLinkElement = linkElements.find(linkElement => {
      return linkElement.getAttribute('rel') === 'icon' || linkElement.getAttribute('rel') === 'shortcut icon';
    });
  
    // If a favicon link element is found, return the href attribute. Otherwise, return null.
    return faviconLinkElement ? faviconLinkElement.getAttribute('href') : null;
  }

  module.exports={getFaviconUrl}