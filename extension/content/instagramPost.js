const outerSpan = document.querySelector('span.wmtNn');
const saveButton = outerSpan.querySelector('.wpO6b');

let defaultCaption = '';
try {
    let capEl = document.querySelector('div.C4VMK').querySelector('span');
    if (!capEl) {
        capEl = document.querySelector('div.C4VMK').querySelector('h1');
    }
    defaultCaption = capEl.innerText;
} catch (e) {
    console.log('extension/content/instagramPost.js error getting default caption');
}
let captionTemplateMap;
let hashtagGroups;

const LABEL_TO_NUMBER = {
    CALI: '874715',
    monday: '1192542',
    tuesday: '1192544',
    wednesday: '1192545',
    thursday: '1192546',
    friday: '1192547',
    saturday: '1192548',
    sunday: '1192549',
    'no date': '1195586',
    calisthenicxelite: '1192555',
    streetworkoutsociety: '1192567'
};

chrome.storage.local.get(['captionTemplateMap', 'hashtagGroups'], function(result) {
    captionTemplateMap = result.captionTemplateMap;
    hashtagGroups = result.hashtagGroups;
});

function createHashtagGroupCheckbox(hashtagGroupsSelector, title) {
    const checkboxDiv = document.createElement('div');
    checkboxDiv.style = `display: flex; flex-direction: row; align-items: center; width: 150px`;
    hashtagGroupsSelector.appendChild(checkboxDiv);
    const checkbox = document.createElement('input');
    checkboxDiv.appendChild(checkbox);
    checkbox.setAttribute('id', title);
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('value', title);
    const label = document.createElement('label');
    label.style = `margin-left: 1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`
    checkboxDiv.appendChild(label);
    label.setAttribute('for', title);
    label.textContent = title;
}

saveButton.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    saveButton.style.border = '1px solid black';
    const url = location.href;
    const dialog = document.createElement('dialog');
    outerSpan.appendChild(dialog);

    const customizedCaptionTitle = document.createElement('h1');
    customizedCaptionTitle.style = `font-size: 2em; margin: 1em 0;`
    customizedCaptionTitle.textContent = 'Caption to Insert in Your Template';
    dialog.appendChild(customizedCaptionTitle);

    const textArea = document.createElement('textarea');
    textArea.value = defaultCaption;
    textArea.style = `display: block; margin: 0.5rem; width: 500px; height: 500px; border-radius:0.25rem`;
    dialog.appendChild(textArea);

    // const selectHashtagGroupsTitle = document.createElement('h1');
    // selectHashtagGroupsTitle.style = `font-size: 2em; margin: 1em 0;`
    // selectHashtagGroupsTitle.textContent = 'Select Hashtag Groups to Insert';
    // dialog.append(selectHashtagGroupsTitle);

    const hashtagGroupsSelector = document.createElement('div');
    hashtagGroupsSelector.style = `width: 500px; display: flex; flex-direction: row; flex-flow: wrap;`
    dialog.appendChild(hashtagGroupsSelector);

    // Object.keys(hashtagGroups).forEach(title => {
    //     createHashtagGroupCheckbox(hashtagGroupsSelector, title);
    // });

    const button = document.createElement('button');
    button.textContent = 'save';
    button.style = `padding: 0.375rem; border-radius:0.25rem; background-color: white; border: 1px solid black; margin: 1em 0; width: 100%`;
    button.addEventListener('click', function() {
        const customized = textArea.value;
        const selectedGroupBodies = Array.from(hashtagGroupsSelector.querySelectorAll('input'))
        .filter(checkbox => checkbox.checked).map(checkbox => checkbox.value).map(title => hashtagGroups[title]);
        
        function generateHashtags() {
            let hashtags;
            if (selectedGroupBodies.length === 0) {
                const groupNames = Object.keys(hashtagGroups);
                if (groupNames) {
                    const randomGroupName = groupNames[Math.floor(Math.random() * groupNames.length)];
                    hashtags = hashtagGroups[randomGroupName]
                } else {
                    hashtags = '';
                }
            } else {
                hashtags = selectedGroupBodies.join(' ');
            }

            return hashtags;
        }

        const dayLabels = generateDayLabel(customized);

        const captionObjects = Object.keys(captionTemplateMap).map(templateName => {
            const captionTemplate = captionTemplateMap[templateName];
            const templateLabel = LABEL_TO_NUMBER[templateName] || LABEL_TO_NUMBER['calisthenicxelite'];
            return {
                labels: [templateLabel, ...dayLabels],
                caption: captionTemplate.replace('{{customized}}', customized).replace('{{hashtags}}', generateHashtags())
            };
        });
        chrome.runtime.sendMessage({ type: 'savePost', url, captionObjects });
        chrome.runtime.sendMessage({ type: 'close' });
    });
    dialog.appendChild(button);
    dialog.showModal();
});

function generateDayLabel(customizedCaption) {
    if (customizedCaption.match(/monday/i)) {
        return [LABEL_TO_NUMBER['monday']];
    } else if (customizedCaption.match(/tuesday/i)) {
        return [LABEL_TO_NUMBER['tuesday']];
    } else if (customizedCaption.match(/wednesday/i)) {
        return [LABEL_TO_NUMBER['wednesday']];
    } else if (customizedCaption.match(/thursday/i)) {
        return [LABEL_TO_NUMBER['thursday']];
    } else if (customizedCaption.match(/friday/i)) {
        return [LABEL_TO_NUMBER['friday']];
    } else if (customizedCaption.match(/saturday/i)) {
        return [LABEL_TO_NUMBER['saturday']];
    } else if (customizedCaption.match(/sunday/i)) {
        return [LABEL_TO_NUMBER['sunday']];
    } else {
        return [LABEL_TO_NUMBER['no date']];
    };
}