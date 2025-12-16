import { NextResponse } from 'next/server';

interface Props {
  params: Promise<{
    companySlug: string;
  }>;
}

export async function GET(request: Request, { params }: Props) {
  const { companySlug } = await params;
  const { searchParams } = new URL(request.url);
  const formSlug = searchParams.get('form');

  // Get the app URL from environment or request
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ||
    `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('host')}`;

  // Build the iframe URL
  let iframeUrl = `${appUrl}/e/${companySlug}`;
  if (formSlug) {
    iframeUrl += `/${formSlug}`;
  }
  iframeUrl += '?embed=true';

  // Generate the widget JavaScript
  const widgetScript = `
(function() {
  'use strict';

  var IFRAME_URL = '${iframeUrl}';
  var COMPANY_SLUG = '${companySlug}';

  // Find the script tag to get any data attributes
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var formSlug = currentScript.getAttribute('data-form');
  var containerId = currentScript.getAttribute('data-container');
  var buttonText = currentScript.getAttribute('data-button-text') || 'Fa prisuppskattning';
  var buttonColor = currentScript.getAttribute('data-button-color') || '#0f172a';
  var mode = currentScript.getAttribute('data-mode') || 'modal'; // 'modal' or 'inline'

  // Update iframe URL if form slug is specified
  var finalIframeUrl = IFRAME_URL;
  if (formSlug) {
    finalIframeUrl = finalIframeUrl.replace('/e/' + COMPANY_SLUG, '/e/' + COMPANY_SLUG + '/' + formSlug);
  }

  // Create styles
  var style = document.createElement('style');
  style.textContent = \`
    .ie-widget-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: 600;
      color: white;
      background-color: \${buttonColor};
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: opacity 0.2s;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .ie-widget-button:hover {
      opacity: 0.9;
    }
    .ie-widget-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
    }
    .ie-widget-modal-overlay.active {
      opacity: 1;
      visibility: visible;
    }
    .ie-widget-modal {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow: hidden;
      position: relative;
    }
    .ie-widget-modal-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
    .ie-widget-modal-close:hover {
      background: rgba(0, 0, 0, 0.2);
    }
    .ie-widget-iframe {
      width: 100%;
      height: 600px;
      border: none;
    }
    .ie-widget-inline {
      width: 100%;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
    }
    .ie-widget-inline iframe {
      width: 100%;
      height: 600px;
      border: none;
    }
  \`;
  document.head.appendChild(style);

  function createModal() {
    // Create overlay
    var overlay = document.createElement('div');
    overlay.className = 'ie-widget-modal-overlay';
    overlay.id = 'ie-widget-modal';

    // Create modal
    var modal = document.createElement('div');
    modal.className = 'ie-widget-modal';

    // Create close button
    var closeBtn = document.createElement('button');
    closeBtn.className = 'ie-widget-modal-close';
    closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    closeBtn.onclick = closeModal;

    // Create iframe
    var iframe = document.createElement('iframe');
    iframe.className = 'ie-widget-iframe';
    iframe.src = finalIframeUrl;

    modal.appendChild(closeBtn);
    modal.appendChild(iframe);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.onclick = function(e) {
      if (e.target === overlay) {
        closeModal();
      }
    };

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    return overlay;
  }

  function openModal() {
    var modal = document.getElementById('ie-widget-modal') || createModal();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    var modal = document.getElementById('ie-widget-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function createInlineWidget(container) {
    var wrapper = document.createElement('div');
    wrapper.className = 'ie-widget-inline';

    var iframe = document.createElement('iframe');
    iframe.src = finalIframeUrl;

    wrapper.appendChild(iframe);
    container.appendChild(wrapper);
  }

  function createButton(container) {
    var button = document.createElement('button');
    button.className = 'ie-widget-button';
    button.textContent = buttonText;
    button.onclick = openModal;
    container.appendChild(button);
  }

  // Initialize widget
  function init() {
    if (mode === 'inline' && containerId) {
      var container = document.getElementById(containerId);
      if (container) {
        createInlineWidget(container);
      }
    } else if (containerId) {
      var container = document.getElementById(containerId);
      if (container) {
        createButton(container);
      }
    } else {
      // Auto-inject button after the script tag
      var wrapper = document.createElement('div');
      wrapper.style.display = 'inline-block';
      currentScript.parentNode.insertBefore(wrapper, currentScript.nextSibling);
      createButton(wrapper);
    }
  }

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API for programmatic control
  window.InstantEstimator = {
    open: openModal,
    close: closeModal
  };
})();
`;

  return new NextResponse(widgetScript, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
