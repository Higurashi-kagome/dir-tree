/* eslint-disable no-undef */
const vscode = acquireVsCodeApi();
let treeTextContent = document.getElementById('treeTextContent');
let outer = document.getElementById('outer')
/* Generate relative path from DOM */
function getRelativePath(target){
    let relativePath = target.getElementsByClassName('basename')[0].textContent;
    if(target.className === 'folderName') relativePath += '/';
    let parentFolderNameEl = target.parentNode.previousSibling.previousSibling;
    while(parentFolderNameEl.className.indexOf('baseFolderName') < 0){
        relativePath = `${parentFolderNameEl.getElementsByClassName('basename')[0].textContent}/${relativePath}`;
        parentFolderNameEl = parentFolderNameEl.parentNode.previousSibling.previousSibling;
    }
    let baseFolderRelativePath = parentFolderNameEl.getAttribute('relativePath');
    if(baseFolderRelativePath) relativePath = `${baseFolderRelativePath}/${relativePath}`;
    return relativePath;
}

/* CheckBoxes onclick event */
let checkBoxes = document.getElementsByClassName('ignoreCheckBox');
Array.from(checkBoxes).forEach((checkBox)=>{
    checkBox.onchange = ()=>{
        outer.style.opacity="0.5";
        let ignore = Array.from(checkBoxes).reduce((ignore, el)=>{
            if(!el.checked && window.getComputedStyle(el).display != 'none'){
                ignore.push(getRelativePath(el.nextSibling));
            }
            return ignore;
        },[]);
        vscode.postMessage({command: 'updatePanel', ignore: ignore});
    }
});


/* Copybtn onclick event */
// eslint-disable-next-line no-undef
document.getElementById('copyTreeTextBtn').onclick = ()=>{
    vscode.postMessage({
        command: 'copy',
        content: treeTextContent.innerText,
    });
}

/* Handle messages from the extension */
window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
        case 'updatePanel':
            outer.style.opacity="1";
            treeTextContent.innerHTML = message.treeText;
            break;
    }
});