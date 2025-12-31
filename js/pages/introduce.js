// Import CSS for Vite - this will be processed by Vite and injected automatically
console.log('📦 INTRODUCE JS: Attempting to import CSS...');
import '/css/styles.css';
console.log('✅ INTRODUCE JS: CSS import statement executed');

// Verify CSS loaded after a delay
setTimeout(() => {
  const stylesheets = Array.from(document.styleSheets);
  const cssLoaded = stylesheets.some(sheet => {
    try {
      return sheet.href && (sheet.href.includes('styles.css') || sheet.href.includes('vite'));
    } catch (e) {
      return false;
    }
  });
  console.log('📊 INTRODUCE JS: CSS verification:', {
    stylesheetsCount: stylesheets.length,
    cssFileFound: cssLoaded,
    stylesheets: stylesheets.map(s => {
      try {
        return { href: s.href || 'inline', disabled: s.disabled };
      } catch (e) {
        return { href: 'cross-origin', disabled: s.disabled };
      }
    })
  });
}, 100);

import { loadUser, saveUser } from '../storage.js';
import { isValidLettersOnly } from '../validators.js';

console.log('🔧 INTRODUCE PAGE: JavaScript module loaded');
console.log('  Document ready state:', document.readyState);
console.log('  Current URL:', window.location.href);

// Wait for DOM to be ready
function initializePage() {
  console.log('🔧 INTRODUCE PAGE: Initializing page elements...');
  
  const input = document.getElementById('name-input');
  const display = document.getElementById('name-display');
  const text = document.getElementById('name-text');
  const caret = document.getElementById('name-caret');
  const errorDiv = document.getElementById('error-message');
  const proceedBtn = document.getElementById('proceed-btn');
  const inputPage = document.querySelector('.input-page');
  const container = document.querySelector('.blinking-input-container');

  console.log('📋 Element Check:');
  console.log('  input:', input ? '✅ Found' : '❌ NOT FOUND');
  console.log('  display:', display ? '✅ Found' : '❌ NOT FOUND');
  console.log('  text:', text ? '✅ Found' : '❌ NOT FOUND');
  console.log('  caret:', caret ? '✅ Found' : '❌ NOT FOUND');
  console.log('  errorDiv:', errorDiv ? '✅ Found' : '❌ NOT FOUND');
  console.log('  proceedBtn:', proceedBtn ? '✅ Found' : '❌ NOT FOUND (button was removed)');
  console.log('  inputPage:', inputPage ? '✅ Found' : '❌ NOT FOUND');
  console.log('  container:', container ? '✅ Found' : '❌ NOT FOUND');
  
  // Check computed styles
  if (inputPage) {
    const styles = window.getComputedStyle(inputPage);
    console.log('\n📊 .input-page Computed Styles:');
    console.log('  display:', styles.display);
    console.log('  visibility:', styles.visibility);
    console.log('  opacity:', styles.opacity);
    console.log('  minHeight:', styles.minHeight);
    console.log('  paddingTop:', styles.paddingTop);
    console.log('  position:', styles.position);
  }
  
  if (container) {
    const styles = window.getComputedStyle(container);
    console.log('\n📊 .blinking-input-container Computed Styles:');
    console.log('  display:', styles.display);
    console.log('  visibility:', styles.visibility);
    console.log('  opacity:', styles.opacity);
    console.log('  flexDirection:', styles.flexDirection);
    console.log('  alignItems:', styles.alignItems);
  }
  
  if (display) {
    const styles = window.getComputedStyle(display);
    console.log('\n📊 .blinking-input-display Computed Styles:');
    console.log('  display:', styles.display);
    console.log('  visibility:', styles.visibility);
    console.log('  opacity:', styles.opacity);
    console.log('  fontSize:', styles.fontSize);
    console.log('  color:', styles.color);
  }
  
  // Check if CSS rules are applied
  console.log('\n📜 CSS Rules Check:');
  const allStylesheets = Array.from(document.styleSheets);
  let foundInputPageRule = false;
  let foundContainerRule = false;
  
  allStylesheets.forEach((sheet, index) => {
    try {
      if (sheet.cssRules) {
        Array.from(sheet.cssRules).forEach(rule => {
          if (rule.selectorText) {
            if (rule.selectorText.includes('.input-page')) {
              foundInputPageRule = true;
              console.log(`  ✅ Found .input-page rule in stylesheet ${index + 1}`);
            }
            if (rule.selectorText.includes('.blinking-input-container')) {
              foundContainerRule = true;
              console.log(`  ✅ Found .blinking-input-container rule in stylesheet ${index + 1}`);
            }
          }
        });
      }
    } catch (e) {
      // Cross-origin stylesheet
    }
  });
  
  if (!foundInputPageRule) {
    console.log('  ⚠️ .input-page CSS rule not found in any stylesheet');
  }
  if (!foundContainerRule) {
    console.log('  ⚠️ .blinking-input-container CSS rule not found in any stylesheet');
  }
  
  return { input, display, text, caret, errorDiv, proceedBtn };
}

// Initialize when DOM is ready
let pageElements;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    pageElements = initializePage();
    setupPageFunctionality(pageElements);
  });
} else {
  pageElements = initializePage();
  setupPageFunctionality(pageElements);
}

function setupPageFunctionality({ input, display, text, caret, errorDiv, proceedBtn }) {
  console.log('🔧 INTRODUCE PAGE: Setting up page functionality...');

  // Function to proceed to next page
  function proceedToNextPage() {
    console.log('🚀 PROCEED TO NEXT PAGE called');
    const name = input.value.trim();
    console.log('  Input value:', input.value);
    console.log('  Trimmed name:', name);
    console.log('  Name length:', name.length);
    
    if (!name) {
      console.log('  ⚠️ Name is empty');
      errorDiv.textContent = 'Please enter your name.';
      errorDiv.classList.remove('hidden');
      return;
    }
    
    if (!isValidLettersOnly(name)) {
      console.log('  ⚠️ Name validation failed');
      errorDiv.textContent = 'Enter a valid name (letters only).';
      errorDiv.classList.remove('hidden');
      return;
    }

    console.log('  ✅ Name is valid, proceeding...');
    errorDiv.classList.add('hidden');
    const prev = loadUser();
    console.log('  Previous user data:', prev);
    saveUser({ name: name, location: prev?.location ?? '' });
    console.log('  Saved user data, navigating to city.html');
    window.location.href = 'city.html';
  }

  // Load saved name
  const user = loadUser();
  console.log('👤 Loaded user:', user);
  if (user?.name) {
    console.log('  Setting saved name:', user.name);
    input.value = user.name;
    text.textContent = user.name;
    display.classList.add('has-value');
    caret.classList.add('hidden');
  } else {
    console.log('  No saved name found');
  }

  input.addEventListener('input', (e) => {
  const value = e.target.value;
  console.log('⌨️ INPUT EVENT:', {
    value: value,
    length: value.length,
    isEmpty: !value,
    hasValue: !!value,
    target: e.target,
    currentTarget: e.currentTarget,
    isTrusted: e.isTrusted
  });
  
  text.textContent = value || 'Introduce Yourself';
  if (value) {
    display.classList.add('has-value');
    caret.classList.add('hidden');
    console.log('  ✅ Text has value, hiding caret');
  } else {
    display.classList.remove('has-value');
    caret.classList.remove('hidden');
    console.log('  ✅ Text cleared, showing caret');
  }
  if (!errorDiv.classList.contains('hidden')) {
    errorDiv.classList.add('hidden');
    console.log('  ✅ Hiding error message');
  }
}, true); // Use capture phase

// Also add beforeinput for better tracking
input.addEventListener('beforeinput', (e) => {
  console.log('⌨️ BEFOREINPUT EVENT:', {
    inputType: e.inputType,
    data: e.data,
    value: input.value,
    isComposing: e.isComposing
  });
}, true);

input.addEventListener('keydown', (e) => {
  console.log('⌨️ KEYDOWN EVENT:', {
    key: e.key,
    code: e.code,
    keyCode: e.keyCode,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    shiftKey: e.shiftKey,
    altKey: e.altKey,
    target: e.target,
    currentTarget: e.currentTarget,
    isTrusted: e.isTrusted
  });
  
  // Handle Enter key
  if (e.key === 'Enter' || e.keyCode === 13) {
    console.log('  ✅ ENTER KEY PRESSED - Proceeding to next page');
    e.preventDefault();
    e.stopPropagation();
    proceedToNextPage();
    return false;
  }
  
  // Handle Backspace/Delete to clear
  if (e.key === 'Backspace' || e.key === 'Delete' || e.keyCode === 8 || e.keyCode === 46) {
    console.log('  ✅ BACKSPACE/DELETE KEY PRESSED');
    console.log('  Current value before key:', input.value);
    console.log('  Selection before:', {
      start: input.selectionStart,
      end: input.selectionEnd
    });
    // Let the default behavior happen, then check if cleared
    setTimeout(() => {
      console.log('  Value after key:', input.value);
      console.log('  Selection after:', {
        start: input.selectionStart,
        end: input.selectionEnd
      });
      if (!input.value) {
        console.log('  ✅ Input is now empty');
      }
    }, 10);
  }
  
  // Handle Ctrl+A or Cmd+A to select all (for clearing)
  if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
    console.log('  ✅ SELECT ALL (Ctrl/Cmd+A)');
    // Allow default select all behavior, then user can press Delete
  }
  
  // Handle Ctrl+X or Cmd+X to cut (clears if all selected)
  if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
    console.log('  ✅ CUT (Ctrl/Cmd+X)');
    setTimeout(() => {
      console.log('  Value after cut:', input.value);
    }, 10);
  }
}, true); // Use capture phase to ensure we catch it

input.addEventListener('keyup', (e) => {
  console.log('⌨️ KEYUP EVENT:', {
    key: e.key,
    code: e.code,
    value: input.value,
    length: input.value.length
  });
});

input.addEventListener('focus', (e) => {
  console.log('👁️ INPUT FOCUSED');
  console.log('  Current value:', input.value);
  console.log('  Selection:', {
    start: input.selectionStart,
    end: input.selectionEnd,
    selectedText: input.value.substring(input.selectionStart, input.selectionEnd)
  });
  console.log('  Event target:', e.target);
  console.log('  Event currentTarget:', e.currentTarget);
});

input.addEventListener('blur', (e) => {
  console.log('👁️ INPUT BLURRED');
  console.log('  Final value:', input.value);
  console.log('  Related target (what gained focus):', e.relatedTarget);
  console.log('  Event target:', e.target);
  
  // Check if something else is taking focus
  setTimeout(() => {
    const activeEl = document.activeElement;
    console.log('  Active element after blur:', activeEl);
    console.log('  Input still exists:', !!input);
    console.log('  Input value after blur:', input.value);
    
    // Don't refocus if user clicked on a button (like BACK button)
    const clickedElement = e.relatedTarget;
    const isButton = clickedElement && (clickedElement.tagName === 'BUTTON' || clickedElement.closest('button'));
    
    if (isButton) {
      console.log('  ℹ️ Focus moved to button - allowing blur (user clicked button)');
      return; // Allow blur if user clicked a button
    }
    
    // If input lost focus to body/document or nothing specific, refocus immediately
    if (activeEl === document.body || activeEl === document.documentElement || activeEl === null || !activeEl) {
      console.log('  ⚠️ Focus went to body/document/null - refocusing input');
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        input.focus();
        console.log('  ✅ Input refocused');
      });
    } else if (activeEl !== input && !input.contains(activeEl)) {
      // If focus went to another element (not input or its children), check if we should refocus
      console.log('  ⚠️ Focus went to another element:', activeEl);
      // Only refocus if it's not an interactive element we want to allow
      const isInteractive = activeEl.tagName === 'BUTTON' || activeEl.tagName === 'A' || activeEl.isContentEditable;
      if (!isInteractive) {
        console.log('  Refocusing input (target is not interactive)');
        requestAnimationFrame(() => {
          input.focus();
        });
      } else {
        console.log('  ℹ️ Allowing blur (target is interactive element)');
      }
    }
  }, 10);
}, true); // Use capture phase

// Focus on load
setTimeout(() => {
  console.log('🎯 Attempting to focus input...');
  if (input) {
    console.log('  Input element found');
    console.log('  Input computed styles:', {
      display: window.getComputedStyle(input).display,
      visibility: window.getComputedStyle(input).visibility,
      opacity: window.getComputedStyle(input).opacity,
      pointerEvents: window.getComputedStyle(input).pointerEvents,
      position: window.getComputedStyle(input).position,
      zIndex: window.getComputedStyle(input).zIndex
    });
    console.log('  Input rect:', input.getBoundingClientRect());
    
    try {
      input.focus();
      console.log('  ✅ Input focus() called');
      console.log('  Focused value:', input.value);
      console.log('  Document active element:', document.activeElement);
      console.log('  Input === active element:', input === document.activeElement);
      
      // Check again after a short delay
      setTimeout(() => {
        console.log('  🔍 Re-checking focus after 50ms:');
        console.log('    Active element:', document.activeElement);
        console.log('    Input === active element:', input === document.activeElement);
        if (input !== document.activeElement) {
          console.log('    ⚠️ WARNING: Input lost focus!');
          console.log('    Trying to focus again...');
          input.focus();
        }
      }, 50);
    } catch (error) {
      console.error('  ❌ Error focusing input:', error);
    }
  } else {
    console.log('  ❌ Input element not found, cannot focus');
  }
}, 100);

// Add proceed button click handler if button exists
if (proceedBtn) {
  console.log('✅ Proceed button found, adding click handler');
  proceedBtn.addEventListener('click', (e) => {
    console.log('🖱️ PROCEED BUTTON CLICKED');
    e.preventDefault();
    e.stopPropagation();
    proceedToNextPage();
  });
} else {
  console.log('⚠️ Proceed button not found (it was removed from HTML)');
  console.log('  Navigation will work via Enter key instead');
}

// Add click handler to input container for debugging
if (display) {
  display.addEventListener('click', (e) => {
    console.log('🖱️ DISPLAY CLICKED - focusing input');
    console.log('  Click target:', e.target);
    console.log('  Click currentTarget:', e.currentTarget);
    e.preventDefault();
    e.stopPropagation();
    
    // Force focus on the input immediately and keep it
    input.focus();
    console.log('  ✅ Input focused immediately');
    console.log('  Active element:', document.activeElement);
    
    // Also try after a short delay to ensure it stays
    setTimeout(() => {
      if (document.activeElement !== input) {
        console.log('  ⚠️ Input lost focus, refocusing...');
        input.focus();
      }
      console.log('  Active element after delay:', document.activeElement);
    }, 50);
  });
  
  // Also make display area focusable
  display.style.cursor = 'text';
  display.setAttribute('tabindex', '-1');
  
  // Prevent display from taking focus
  display.addEventListener('focus', (e) => {
    console.log('⚠️ Display tried to take focus, redirecting to input');
    e.preventDefault();
    input.focus();
  }, true);
}

// Make the container clickable too
const container = document.querySelector('.blinking-input-container');
if (container) {
  container.addEventListener('click', (e) => {
    if (e.target === container || e.target === display || display.contains(e.target)) {
      console.log('🖱️ CONTAINER CLICKED - focusing input');
      e.preventDefault();
      e.stopPropagation();
      input.focus();
    }
  });
}

// Prevent any other elements from stealing focus
document.addEventListener('click', (e) => {
  if (e.target !== input && !input.contains(e.target) && e.target !== display && !display.contains(e.target) && e.target !== container && !container?.contains(e.target)) {
    console.log('🖱️ Click detected outside input/display/container:', e.target);
    // Don't prevent default, just log it
  }
}, true);

// Also handle mousedown to ensure focus stays
input.addEventListener('mousedown', (e) => {
  console.log('🖱️ INPUT MOUSEDOWN');
  // Don't prevent default - let browser handle focus naturally
  // Just ensure focus if it somehow got lost
  setTimeout(() => {
    if (document.activeElement !== input) {
      console.log('  ⚠️ Input lost focus on mousedown, refocusing...');
      input.focus();
    }
  }, 0);
});

// Prevent the input from losing focus when clicking on display
display.addEventListener('mousedown', (e) => {
  console.log('🖱️ DISPLAY MOUSEDOWN - focusing input');
  e.preventDefault();
  e.stopPropagation();
  input.focus();
  // Also prevent blur by stopping the event
  return false;
}, true);

// Prevent blur when clicking anywhere in the container
if (container) {
  container.addEventListener('mousedown', (e) => {
    if (e.target === container || e.target === display || display.contains(e.target)) {
      console.log('🖱️ CONTAINER MOUSEDOWN - focusing input');
      e.preventDefault();
      e.stopPropagation();
      input.focus();
      return false;
    }
  }, true);
}

// Verify event listeners are attached
console.log('🔍 Verifying event listeners:');
console.log('  Input has keydown listener:', input.onkeydown !== null || input.getAttribute('onkeydown') ? 'YES (inline)' : 'Checking...');
console.log('  Input has input listener:', input.oninput !== null || input.getAttribute('oninput') ? 'YES (inline)' : 'Checking...');

// Test if we can programmatically trigger events
console.log('🧪 Testing event system:');
try {
  const testEvent = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true, cancelable: true });
  console.log('  Created test keyboard event:', testEvent);
  console.log('  Event can be dispatched:', true);
} catch (e) {
  console.log('  Error creating test event:', e);
}

// Add a global keydown listener as backup
document.addEventListener('keydown', (e) => {
  if (document.activeElement === input) {
    console.log('🌐 GLOBAL KEYDOWN (input is focused):', {
      key: e.key,
      keyCode: e.keyCode,
      target: e.target,
      activeElement: document.activeElement
    });
    
    // If Enter is pressed and input is focused, proceed
    if ((e.key === 'Enter' || e.keyCode === 13) && document.activeElement === input) {
      console.log('  ✅ GLOBAL: ENTER detected on focused input - proceeding');
      e.preventDefault();
      e.stopPropagation();
      proceedToNextPage();
    }
  }
}, true);

// Test keyboard input capability
console.log('🧪 Testing input capabilities:');
console.log('  Input readOnly:', input.readOnly);
console.log('  Input disabled:', input.disabled);
console.log('  Input tabIndex:', input.tabIndex);
console.log('  Input contentEditable:', input.contentEditable);
console.log('  Input isContentEditable:', input.isContentEditable);

// Make sure input is definitely focusable and editable
input.readOnly = false;
input.disabled = false;
input.setAttribute('tabindex', '0');
input.removeAttribute('readonly');
input.removeAttribute('disabled');

console.log('  ✅ Input set to editable and focusable');

// Add a test to verify input works
setTimeout(() => {
  console.log('🧪 Testing if input accepts programmatic value change:');
  const testValue = 'Test';
  const originalValue = input.value;
  input.value = testValue;
  console.log('  Set value to:', testValue);
  console.log('  Input value is now:', input.value);
  console.log('  Value matches:', input.value === testValue ? '✅ YES' : '❌ NO');
  
  // Reset to original value
  input.value = originalValue;
  if (originalValue) {
    text.textContent = originalValue;
  } else {
    text.textContent = 'Introduce Yourself';
  }
  console.log('  ✅ Reset to original value:', originalValue);
}, 500);

console.log('✅ INTRODUCE PAGE: Initialization complete');
console.log('💡 Tips:');
console.log('  - Press Enter to proceed to next page');
console.log('  - Use Backspace/Delete to clear text');
console.log('  - Check console for detailed event logs');
console.log('  - Try typing to see if input events are captured');
console.log('  - Try pressing Enter to see if keydown events are captured');
}
