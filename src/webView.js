
const vscode = require('vscode');

function getWebviewContent(treeText, treeHtml, scriptSrc, cssSrc){
	let dirTreeConfig = vscode.workspace.getConfiguration().get('dirTree');
	let checked = 'checked';
	if(!dirTreeConfig.addIcon) checked = '';
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Dir Tree</title>
	<link rel="stylesheet" type="text/css" href="${cssSrc}">
</head>
<body>
	<div id='outer'>
		<div id='treeView'>${treeHtml}</div>
		<br>
		<div id='treeTextView'><span>Icon </span><input id='iconTrigger' type='checkbox' ${checked}><label> Style </label><select id="treeStyle">
                <option id="bold">bold</option>
                <option id="thin">thin</option>
				<option id="boldplus">boldplus</option>
				<option id="thinplus">thinplus</option></select><p></p><span id='treeTextContent'>${treeText}</span>
		</div>
		<br>
		<button id='copyTreeTextBtn'>Copy</button>
	</div>
</body>
<script type="text/javascript" src="${scriptSrc}"></script>
</html>`.replace(new RegExp(`(id="${dirTreeConfig.treeStyle})`), '$1 selected');

}

module.exports = getWebviewContent;