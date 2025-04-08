import * as vscode from 'vscode';

export class ScrollitSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'scrollit.chatSidebar';

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this.getHtmlForWebview();

    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.type === 'prompt') {
        const text = message.text || '';
        const response = `🤖 Echo: ${text}`; // Placeholder for now
        webviewView.webview.postMessage({ type: 'response', text: response });
      }
    });
  }

  private getHtmlForWebview(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <body style="font-family:sans-serif;padding:1rem">
          <h2>🧠 Scrollit Agent</h2>
          <textarea id="input" rows="5" style="width:100%"></textarea><br/>
          <button onclick="send()">Send</button>
          <pre id="output" style="margin-top:10px;white-space:pre-wrap;"></pre>

          <script>
            const vscode = acquireVsCodeApi();

            function send() {
              const text = document.getElementById('input').value;
              vscode.postMessage({ type: 'prompt', text });
            }

            window.addEventListener('message', event => {
              const msg = event.data;
              if (msg.type === 'response') {
                document.getElementById('output').textContent += '\n' + msg.text;
              }
            });
          </script>
        </body>
      </html>
    `;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const provider = new ScrollitSidebarProvider(context);
  console.log("✅ Scrollit Agent Activated");

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      ScrollitSidebarProvider.viewType,
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true
        }
      }
    )
  );

  vscode.commands.executeCommand('setContext', 'scrollit.isDevMode', true);

  context.subscriptions.push(
    vscode.commands.registerCommand('scrollit.newTask', () => {
      vscode.window.showInformationMessage('🧠 New Scrollit task triggered!');
    })
  );
}

export function deactivate() {}