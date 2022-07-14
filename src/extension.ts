import * as vscode from 'vscode';

let extensionOutputChannel: vscode.OutputChannel;
let searching: string | number | NodeJS.Timeout | undefined;

let group0Highlighter: vscode.TextEditorDecorationType;
let group1Highlighter: vscode.TextEditorDecorationType;
let group2Highlighter: vscode.TextEditorDecorationType;
let group3Highlighter: vscode.TextEditorDecorationType;
let group4Highlighter: vscode.TextEditorDecorationType;

export function activate(context: vscode.ExtensionContext) {
	extensionOutputChannel = vscode.window.createOutputChannel('RegExp highlighter');
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-regexp-highlighter.search', searchRegexp));
	context.subscriptions.push(vscode.commands.registerTextEditorCommand('vscode-regexp-highlighter.clear-highlights', clearHighlights));

	group0Highlighter = vscode.window.createTextEditorDecorationType({
		borderWidth: '4px',
		light: {
			// this color will be used in light color themes
			backgroundColor: 'rgb(219, 80, 135)',
			color: 'black'
		},
		dark: {
			// this color will be used in dark color themes
			backgroundColor: 'rgb(249, 205, 172)',
			color: 'black'
		}
	});

	group1Highlighter = vscode.window.createTextEditorDecorationType({
		borderWidth: '4px',
		light: {
			// this color will be used in light color themes
			backgroundColor: 'rgb(233, 106, 141)',
			color: 'black'
		},
		dark: {
			// this color will be used in dark color themes
			backgroundColor: 'rgb(243, 172, 162)',
			color: 'black'
		}
	});

	group2Highlighter = vscode.window.createTextEditorDecorationType({
		borderWidth: '4px',
		light: {
			// this color will be used in light color themes
			backgroundColor: 'rgb(238, 139, 151)',
			color: 'black'
		},
		dark: {
			// this color will be used in dark color themes
			backgroundColor: 'rgb(238, 139, 151)',
			color: 'black'
		}
	});

	group3Highlighter = vscode.window.createTextEditorDecorationType({
		borderWidth: '4px',
		light: {
			// this color will be used in light color themes
			backgroundColor: 'rgb(243, 172, 162)',
			color: 'black'
		},
		dark: {
			// this color will be used in dark color themes
			backgroundColor: 'rgb(233, 106, 141)',
			color: 'black'
		}
	});

	group4Highlighter = vscode.window.createTextEditorDecorationType({
		borderWidth: '4px',
		light: {
			// this color will be used in light color themes
			backgroundColor: 'rgb(249, 205, 172)',
			color: 'black'
		},
		dark: {
			// this color will be used in dark color themes
			backgroundColor: 'rgb(219, 80, 135)',
			color: 'black'
		}
	});
}

async function searchRegexp(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) {
	const regexp = await vscode.window.showInputBox({
		placeHolder: 'Enter regexp for search',
		validateInput: validateRegExp.bind(textEditor)
	});

	if (!regexp) {
		// User used escape
		clearHighlights();
	}
}

function validateRegExp(maybeRegExp: string): string {
	try {
		new RegExp(maybeRegExp);
		if (maybeRegExp.trim().length > 0) {
			startSearchUsingRegExp(maybeRegExp);
		}
		return '';
	} catch {
		clearSearch();
		clearHighlights();
		return `Invalid regexp: ${maybeRegExp}`;
	}
}

async function startSearchUsingRegExp(regExp: string) {
	clearSearch();
	// Start over
	searching = setTimeout(() => {
		searching = undefined;
		const activeTextEditor = vscode.window.activeTextEditor;
		if (activeTextEditor) {
			// extensionOutputChannel.appendLine(`Searching using regExp: ${regExp}`);
			const text = activeTextEditor.document.getText();
			if (text.trim().length > 0) {
				let re = new RegExp(regExp);
				let match = re.exec(text);
				if (match) {
					const group0HighlightRanges: vscode.DecorationOptions[] = [];
					const group1HighlightRanges: vscode.DecorationOptions[] = [];
					const group2HighlightRanges: vscode.DecorationOptions[] = [];
					const group3HighlightRanges: vscode.DecorationOptions[] = [];
					const group4HighlightRanges: vscode.DecorationOptions[] = [];
					// recreate RegExp
					re = new RegExp(regExp, 'gd');
					while ((match = re.exec(text)) !== null) {
						const indices = (match as any).indices;
						if (indices && indices.length > 0) {
							extensionOutputChannel.appendLine(`Indices ${indices}`);
							group0HighlightRanges.push(
							{
								range: new vscode.Range(
									activeTextEditor.document.positionAt(indices[0][0]),
									activeTextEditor.document.positionAt(indices[0][1])
								)
							});
							if (indices.length > 1) {
								group1HighlightRanges.push(
									{
										range: new vscode.Range(
											activeTextEditor.document.positionAt(indices[1][0]),
											activeTextEditor.document.positionAt(indices[1][1])
										),
										hoverMessage: new vscode.MarkdownString('Group 1')
									});
								if (indices.length > 2) {
									group2HighlightRanges.push(
										{
											range: new vscode.Range(
												activeTextEditor.document.positionAt(indices[2][0]),
												activeTextEditor.document.positionAt(indices[2][1])
											),
											hoverMessage: new vscode.MarkdownString('Group 2')
										});
									if (indices.length > 3) {
										group3HighlightRanges.push(
											{
												range: new vscode.Range(
													activeTextEditor.document.positionAt(indices[3][0]),
													activeTextEditor.document.positionAt(indices[3][1])
												),
												hoverMessage: new vscode.MarkdownString('Group 3')
											});
										if (indices.length > 4) {
											group4HighlightRanges.push(
												{
													range: new vscode.Range(
														activeTextEditor.document.positionAt(indices[4][0]),
														activeTextEditor.document.positionAt(indices[4][1])
													),
													hoverMessage: new vscode.MarkdownString('Group 4')
												});
										}
									}
								}
							}
							// extensionOutputChannel.appendLine(`Matched ${JSON.stringify(match)} ${(match as any).indices}. Next starts at ${re.lastIndex}.`);
						} else {
							clearHighlights();
						}
					}
					activeTextEditor.setDecorations(group0Highlighter, group0HighlightRanges);
					activeTextEditor.setDecorations(group1Highlighter, group1HighlightRanges);
					activeTextEditor.setDecorations(group2Highlighter, group2HighlightRanges);
					activeTextEditor.setDecorations(group3Highlighter, group3HighlightRanges);
					activeTextEditor.setDecorations(group4Highlighter, group4HighlightRanges);
				} else {
					// extensionOutputChannel.appendLine(`None match: ${regExp}`);
					clearHighlights();
				}
			}

		}
	}, 1000);
}

function clearHighlights() {
	if (vscode.window.activeTextEditor) {
		vscode.window.activeTextEditor.setDecorations(group0Highlighter, []);
		vscode.window.activeTextEditor.setDecorations(group1Highlighter, []);
		vscode.window.activeTextEditor.setDecorations(group2Highlighter, []);
		vscode.window.activeTextEditor.setDecorations(group3Highlighter, []);
		vscode.window.activeTextEditor.setDecorations(group4Highlighter, []);
	}
}
function clearSearch() {
	// debounce
	// extensionOutputChannel.appendLine('Cancelling...');
	if (searching) {
		clearTimeout(searching);
		searching = undefined;
	}
}

export function deactivate() {}
