const vscode = require('vscode');
const DirTreeGenerator = require('./generator');
const getWebviewContent = require('./webView');
const path =  require('path');
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let scriptSrc = undefined;
	let cssSrc = undefined;

	const conmmand = 'dir-tree.generateDirTree';
	const commandHandler = (uri) => {
		let workspaceFolders = vscode.workspace.workspaceFolders;
		if(!workspaceFolders[0]) return vscode.window.showInformationMessage('Please open a folder first.');
		/* When run by command */
		if(!uri){
			if (workspaceFolders.length === 1) {
				uri = workspaceFolders[0].uri;
			} else {
				//TODO
				uri = workspaceFolders[0].uri;
			}
		}
		/* Init a generator and get dir tree */
		let dirTreeConfig = vscode.workspace.getConfiguration().get('dirTree');
		let dirTreeGenerator = new DirTreeGenerator(dirTreeConfig, uri);
		let treeText = dirTreeGenerator.getTreeText();
		let treeHtml = dirTreeGenerator.getTreeHtml();
		/* Generate webview */
		let webPanel = vscode.window.createWebviewPanel(
			'DirTree',
			'Dir tree',
			{viewColumn: vscode.ViewColumn.Active},
			{enableScripts: true}
		);
		const scriptPath = vscode.Uri.file(
			path.join(context.extensionPath, 'media', 'main.js')
		);
		const cssPath = vscode.Uri.file(
			path.join(context.extensionPath, 'media', 'main.css')
		);
		scriptSrc = webPanel.webview.asWebviewUri(scriptPath);
		cssSrc = webPanel.webview.asWebviewUri(cssPath);
		webPanel.webview.html = getWebviewContent(treeText, treeHtml, scriptSrc, cssSrc);
		webPanel.onDidDispose(() => {webPanel = undefined;}, null, context.subscriptions);
		// Handle messages from the panel
		webPanel.webview.onDidReceiveMessage(message => {
			switch (message.command) {
				case 'updateIgnore':
					dirTreeConfig.ignore = message.ignore;
					dirTreeConfig.loadGitignore = false;
					dirTreeGenerator.setConfig(dirTreeConfig);
					treeText = dirTreeGenerator.getTreeText();
					webPanel.webview.postMessage({ command: message.command, treeText: treeText });
					return;
				case 'changeTreeStyle':
					dirTreeConfig.treeStyle = message.treeStyle;
					dirTreeGenerator.setConfig(dirTreeConfig);
					treeText = dirTreeGenerator.getTreeText();
					webPanel.webview.postMessage({ command: message.command, treeText: treeText });
					return;
				case 'copy':
					vscode.env.clipboard.writeText(message.content);
					vscode.window.setStatusBarMessage(`已复制✔️`, 1500);
					return;
			}
		}, undefined, context.subscriptions);
	}

	let disposable = vscode.commands.registerCommand(conmmand, commandHandler);

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}