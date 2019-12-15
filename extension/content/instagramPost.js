const outerSpan = document.querySelector('span.wmtNn');
const saveButton = outerSpan.querySelector('.dCJp8.afkep');

const defaultCaption = document.querySelector('div.C4VMK').querySelector('span').innerText;

saveButton.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    saveButton.style.border = '1px solid black';
    const url = location.href;
    const dialog = document.createElement('dialog');
    outerSpan.appendChild(dialog);

    const textArea = document.createElement('textarea');
    textArea.value = defaultCaption;
    textArea.style = `display: block; margin: 0.5rem; width: 500px; height: 500px; border-radius:0.25rem`;
    dialog.appendChild(textArea);

    const button = document.createElement('button');
    button.textContent = 'save';
    button.style = `padding: 0.375rem; border-radius:0.25rem; background-color: white; border: 1px solid black`;
    button.addEventListener('click', function() {
        const caption = textArea.value;
        chrome.runtime.sendMessage({ type: 'savePost', url, caption });
        chrome.runtime.sendMessage({ type: 'close' });
    });
    dialog.appendChild(button);
    dialog.showModal();
});
