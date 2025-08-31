# MCP (Model Context Protocol) Integration

This project now includes MCP integration with Supabase, allowing you to access Supabase functionality through the Model Context Protocol.

## What is MCP?

MCP (Model Context Protocol) is a standard for AI models to interact with external tools and data sources. It provides a structured way for AI assistants to access databases, APIs, and other services.

## Setup

The MCP Supabase server is already installed globally:
```bash
npm install -g @supabase/mcp-server-supabase
```

## Usage

1. **Access MCP Test Component**: Navigate to the Dashboard page to see the MCP test component
2. **Connect to MCP**: Click "Connect to MCP" to establish connection
3. **Test Functions**: Use the test buttons to interact with Supabase through MCP

## Available MCP Functions

The Supabase MCP server provides access to:
- Database operations
- Table listing
- Data queries
- Authentication
- Storage operations

## Configuration

MCP client is configured with your Supabase credentials in `src/lib/mcp-client.ts`:
- URL: `https://ilsojnzuaaubvcwuaklo.supabase.co`
- Anonymous key: Configured automatically

## Benefits

- **AI Integration**: Enables AI assistants to directly interact with your database
- **Structured Access**: Provides standardized interface for database operations
- **Security**: Maintains proper authentication and authorization
- **Extensibility**: Easy to add more MCP servers for other services

## Testing

1. Start your development server: `npm run dev`
2. Navigate to Dashboard
3. Use the MCP test component to verify functionality
4. Check browser console for MCP communication logs
