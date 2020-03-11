const saveCaptionTemplateButton = document.querySelector('#save-caption-template-button');
const templateSelector = document.querySelector('#template-selector');
const addTemplateToggleButton = document.querySelector('#toggle-add-template-section');
const deleteTemplateButton = document.querySelector('#delete-template');
const addTemplateInput = document.querySelector('#add-template-input');
const addTemplateSection = document.querySelector('#add-template-section');
const addTemplateButton = document.querySelector('#add-template-button');
const captionTemplateInput = document.querySelector('#caption-template-input');
captionTemplateInput.setAttribute('placeholder', `Example:\n{{customized}}. You can follow me at @my_profile. Credit for content goes to {{credit}}.\n{{hashtags}}`);
const viewAllHashtagGroupModalBody = document.querySelector('#view-all-hashtag-groups-modal-body');
const newHashtagGroupNameInput = document.querySelector('#new-hashtag-group-name');
const newHashtagGroupNameError = document.querySelector('#new-hashtag-group-name-error');
const newHashtagGroupBodyInput = document.querySelector('#new-hashtag-group-body');
const addNewHashtagGroupButton = document.querySelector('#add-new-hashtag-group-button');



function createHashtagGroupElement(props) {
    const { title, body } = props;
    const row = document.createElement('div');
    row.classList.add('row');
    viewAllHashtagGroupModalBody.appendChild(row);
    const col = document.createElement('div');
    col.classList.add('col-12');
    row.appendChild(col);
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('d-flex', 'justify-content-between');
    col.appendChild(titleDiv);
    const titleSpan = document.createElement('span')
    titleSpan.classList.add('h5');
    titleSpan.textContent = title;
    titleDiv.appendChild(titleSpan);

    const titleDeleteSpan = document.createElement('span');
    titleDeleteSpan.addEventListener('click', () => {
        const newHashtagGroups = { ...App.data.hashtagGroups }
        delete newHashtagGroups[title];
        chrome.storage.local.set({ hashtagGroups: newHashtagGroups }, function () {
            App.data.hashtagGroups = newHashtagGroups;
        });
    });
    titleDiv.appendChild(titleDeleteSpan);
    const titleDeleteIcon = document.createElement('i');
    titleDeleteSpan.appendChild(titleDeleteIcon);
    titleDeleteIcon.classList.add('icon-h5', 'icon-red');
    titleDeleteIcon.setAttribute('data-feather', 'trash-2');

    const p = document.createElement('p');
    p.textContent = body;
    col.appendChild(p);
}

function createTemplateSelectOption(name) {
    const option = document.createElement('option');
    option.setAttribute('value', name);
    option.textContent = name;
    templateSelector.appendChild(option);
}

const App = new Seer({
    data: {
        captionTemplateMap: {},
        templates: [],
        newTemplate: '',
        selectedTemplate: '',
        captionTemplate: '',
        newCaptionTemplate: '',
        newHashtagGroupName: '',
        newHashtagGroupBody: '',
        hashtagGroups: {},
        // isViewingAllHashtagGroups: false,
        hasCaptionTemplateChanged() {
            return this.captionTemplate !== this.newCaptionTemplate;
        },
        isValidNewTemplate() {
            console.log(App.data);
            const isNotEmpty = this.newTemplate.length !== 0;
            const doesNotExist = this.captionTemplateMap[this.newTemplate] === undefined;
            return isNotEmpty && doesNotExist;
        },
        isValidNewHashtagGroup() {
            return this.newHashtagGroupName && this.newHashtagGroupBody && !this.doesNewHashtagGroupNameAlreadyExist;
        },
        doesNewHashtagGroupNameAlreadyExist() {
            return this.newHashtagGroupName in this.hashtagGroups;
        }
    },
    watch: {
        hasCaptionTemplateChanged() {
            saveCaptionTemplateButton.toggleAttribute('disabled', !App.data.hasCaptionTemplateChanged);
        },
        isValidNewHashtagGroup() {
            addNewHashtagGroupButton.toggleAttribute('disabled', !App.data.isValidNewHashtagGroup);
        },
        isValidNewTemplate() {
            addTemplateButton.toggleAttribute('disabled', !App.data.isValidNewTemplate);
        },
        doesNewHashtagGroupNameAlreadyExist() {
            newHashtagGroupNameError.toggleAttribute('hidden', !App.data.doesNewHashtagGroupNameAlreadyExist);
        },
        selectedTemplate() {
            const { captionTemplateMap, selectedTemplate } = App.data;
            App.data.captionTemplate = captionTemplateMap[selectedTemplate];
            App.data.newCaptionTemplate = captionTemplateMap[selectedTemplate];
        },
        captionTemplateMap() {
            App.data.templates = Object.keys(App.data.captionTemplateMap).sort();
        },
        templates() {
            while (templateSelector.firstChild) {
                templateSelector.removeChild(templateSelector.firstChild);
            }

            App.data.templates.forEach((templateName) => {
                createTemplateSelectOption(templateName);
            });
        },
        hashtagGroups() {
            while (viewAllHashtagGroupModalBody.firstChild) {
                viewAllHashtagGroupModalBody.removeChild(viewAllHashtagGroupModalBody.firstChild);
            }
            Object.keys(App.data.hashtagGroups).sort().forEach((title) => {
                const body = App.data.hashtagGroups[title];
                createHashtagGroupElement({ title, body });
            });
            feather.replace();
        }
    }
});

// INIT 
feather.replace();
saveCaptionTemplateButton.toggleAttribute('disabled', !App.data.hasCaptionTemplateChanged);
newHashtagGroupNameError.toggleAttribute('hidden', !App.data.doesNewHashtagGroupNameAlreadyExist);
addNewHashtagGroupButton.toggleAttribute('disabled', !App.data.isValidNewHashtagGroup);
chrome.storage.local.get(['captionTemplateMap', 'hashtagGroups'], function (result) {
    console.log(result)
    const captionTemplateMap = !result.captionTemplateMap || Object.keys(result.captionTemplateMap).length === 0 ? { default: '' } : result.captionTemplateMap;
    const templates = Object.keys(captionTemplateMap).sort();
    const selectedTemplate = templates[0];
    App.data.templates = templates;
    App.data.newTemplate = '';
    App.data.selectedTemplate = selectedTemplate;
    App.data.captionTemplateMap = captionTemplateMap;
    App.data.captionTemplate = captionTemplateMap[selectedTemplate];
    App.data.newCaptionTemplate = captionTemplateMap[selectedTemplate] || '';
    App.data.hashtagGroups = result.hashtagGroups || {};
});

// EVENT LISTENERS
function onCaptionTemplateSave() {
    const { newCaptionTemplate, selectedTemplate, captionTemplateMap } = App.data;
    captionTemplateMap[selectedTemplate] = newCaptionTemplate;

    chrome.storage.local.set({ captionTemplateMap: captionTemplateMap }, function () {
        App.data.captionTemplate = newCaptionTemplate;
    });
}

function onAddNewHashtagGroup() {
    const { newHashtagGroupName, newHashtagGroupBody } = App.data;
    const newHashtagGroups = { ...App.data.hashtagGroups, [newHashtagGroupName]: newHashtagGroupBody };

    chrome.storage.local.set({ hashtagGroups: newHashtagGroups }, function () {
        App.data.hashtagGroups = newHashtagGroups;
        App.data.newHashtagGroupName = '';
        App.data.newHashtagGroupBody = '';
    });
}

function onInputChange(e) {
    const { name, value } = e.target;
    App.data[name] = value;
}

// function onToggleAddTemplateSection() {
//     addTemplateSection.toggle('hidden');
// }

function onAddTemplate() {
    const { newTemplate, captionTemplateMap } = App.data;
    captionTemplateMap[newTemplate] = '';
    chrome.storage.local.set({ captionTemplateMap: captionTemplateMap }, function() {
        location.reload();
    });
}

function onDeleteTemplate() {
    const { selectedTemplate, captionTemplateMap } = App.data;
    delete captionTemplateMap[selectedTemplate];
    chrome.storage.local.set({ captionTemplateMap: captionTemplateMap }, function() {
        location.reload();
    });
}

function onSelectedTemplateChange(e) {
    const { value } = e.target;
    App.data.selectedTemplate = value;
}

templateSelector.addEventListener('change', onSelectedTemplateChange);
// addTemplateToggleButton.addEventListener('click', onToggleAddTemplateSection);
deleteTemplateButton.addEventListener('click', onDeleteTemplate)
addTemplateInput.addEventListener('input', onInputChange);
addTemplateButton.addEventListener('click', onAddTemplate);
captionTemplateInput.addEventListener('input', onInputChange);
saveCaptionTemplateButton.addEventListener('click', onCaptionTemplateSave);

newHashtagGroupNameInput.addEventListener('input', onInputChange);
newHashtagGroupBodyInput.addEventListener('input', onInputChange);
addNewHashtagGroupButton.addEventListener('click', onAddNewHashtagGroup);
