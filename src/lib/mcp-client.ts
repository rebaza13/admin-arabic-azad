import { spawn, ChildProcess } from 'child_process';

export interface MCPMessage {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params?: any;
  result?: any;
  error?: any;
}

export class MCPClient {
  private process: ChildProcess | null = null;
  private messageId = 1;

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.process = spawn('npx', ['@supabase/mcp-server-supabase'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          SUPABASE_URL: 'https://ilsojnzuaaubvcwuaklo.supabase.co',
          SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsc29qbnp1YWF1YnZjd3Vha2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNzY3NzksImV4cCI6MjA2OTk1Mjc3OX0.G1FCYPwc76zTQZuWoRbhMw5RqTwwVdVf0wJQe_MJd_A'
        }
      });

      this.process.stdout?.on('data', (data) => {
        console.log('MCP Response:', data.toString());
      });

      this.process.stderr?.on('data', (data) => {
        console.error('MCP Error:', data.toString());
      });

      this.process.on('close', (code) => {
        console.log(`MCP Server closed with code ${code}`);
      });

      setTimeout(() => resolve(), 1000);
    });
  }

  async sendMessage(method: string, params?: any): Promise<any> {
    if (!this.process) {
      throw new Error('MCP client not connected');
    }

    const message: MCPMessage = {
      jsonrpc: '2.0',
      id: this.messageId++,
      method,
      params
    };

    this.process.stdin?.write(JSON.stringify(message) + '\n');
    
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 100);
    });
  }

  disconnect(): void {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }
}

export const mcpClient = new MCPClient();
