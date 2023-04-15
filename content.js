
let isSelectionModeActive = false;
let lastHoveredElement = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleDivSelection') {
        toggleDivSelection();
    }
});

function toggleDivSelection() {
    isSelectionModeActive = !isSelectionModeActive;

    if (isSelectionModeActive) {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('click', onClick);
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    } else {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('click', onClick);
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
        if (lastHoveredElement) {
            lastHoveredElement.classList.remove('selected-element');
        }
    }
}
function onMouseMove(event) {
    if (lastHoveredElement) {
        lastHoveredElement.classList.remove('selected-element');
    }
    const targetElement = event.target;
    targetElement.classList.add('selected-element');
    lastHoveredElement = targetElement;
    event.stopPropagation();
}


function captureScreenshot(element, filename) {
    // const element = document.body;

    if (!element) {
        console.error('Element not found');
        return;
    }

    html2canvas(element, { scrollY: -window.scrollY, useCORS: true })
        .then((canvas) => {

            // window.open(canvas.toDataURL('image/png'), '_blank');

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.target = '_blank'
            link.download = filename || 'screenshot.png';
            link.click();
            link.remove();
        })
        .catch((err) => {
            console.error('Error capturing screenshot:', err);
        });
}

function onClick(event) {
    if (isSelectionModeActive && lastHoveredElement) {
        console.log(lastHoveredElement.outerHTML);
        try {
            captureScreenshot(lastHoveredElement, 'screenshot.png');
        } finally {
            toggleDivSelection();
            event.preventDefault();
            event.stopPropagation();
        }

    }
}


function onKeyDown(event) {
    if (event.key === 'Control') {
    }
}

function onKeyUp(event) {
    if (event.key === 'Control') {
        if (lastHoveredElement && lastHoveredElement.parentElement) {
            lastHoveredElement.classList.remove('selected-element');
            lastHoveredElement = lastHoveredElement.parentElement
            lastHoveredElement.classList.add('selected-element');
        }
    }
}