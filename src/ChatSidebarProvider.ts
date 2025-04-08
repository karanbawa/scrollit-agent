import * as vscode from 'vscode';

export class ChatSidebarProvider implements vscode.WebviewViewProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this.getHtmlForWebview();

    webviewView.webview.onDidReceiveMessage((message) => {
      console.log('Received message:', message);
    });
  }

  private getHtmlForWebview() {
    return `
      <!DOCTYPE html>
      <html>
        <body>
          <h3>🧠 Scrollit Agent</h3>
          <textarea id="input" rows="4" style="width:100%"></textarea>
          <br />
          <button onclick="send()">Send</button>
          <pre id="output" style="margin-top:10px;"></pre>
          <script>
            const vscode = acquireVsCodeApi();
            function send() {
              const text = document.getElementById('input').value;
              vscode.postMessage({ type: 'prompt', text });
            }
          </script>
        </body>
      </html>
    `;
  }
}
