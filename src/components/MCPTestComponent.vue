<template>
  <div class="mcp-test">
    <q-card class="q-pa-md">
      <q-card-section>
        <h5>MCP Supabase Test</h5>
        <q-btn 
          :loading="connecting" 
          @click="connectMCP" 
          color="primary"
          class="q-mb-md"
        >
          {{ isConnected ? 'Disconnect' : 'Connect to MCP' }}
        </q-btn>
        
        <div v-if="isConnected" class="q-mt-md">
          <q-btn @click="testMCP" color="secondary" class="q-mr-sm">
            Test MCP
          </q-btn>
          <q-btn @click="listTables" color="info">
            List Tables
          </q-btn>
        </div>
        
        <div v-if="logs.length > 0" class="q-mt-md">
          <h6>MCP Logs:</h6>
          <div class="logs">
            <div v-for="log in logs" :key="log.id" class="log-entry">
              <span class="timestamp">{{ log.timestamp }}</span>
              <span class="message">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { mcpClient } from '../lib/mcp-client'

const connecting = ref(false)
const isConnected = ref(false)
const logs = ref<Array<{id: number, timestamp: string, message: string}>>([])

const addLog = (message: string) => {
  logs.value.push({
    id: Date.now(),
    timestamp: new Date().toLocaleTimeString(),
    message
  })
}

const connectMCP = async () => {
  if (isConnected.value) {
    mcpClient.disconnect()
    isConnected.value = false
    addLog('Disconnected from MCP')
    return
  }

  try {
    connecting.value = true
    await mcpClient.connect()
    isConnected.value = true
    addLog('Connected to MCP Supabase server')
  } catch (error) {
    addLog(`Connection failed: ${error}`)
  } finally {
    connecting.value = false
  }
}

const testMCP = async () => {
  try {
    const result = await mcpClient.sendMessage('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'vue-client', version: '1.0.0' }
    })
    addLog(`MCP test result: ${JSON.stringify(result)}`)
  } catch (error) {
    addLog(`MCP test failed: ${error}`)
  }
}

const listTables = async () => {
  try {
    const result = await mcpClient.sendMessage('mcp_supabase_list_tables', {
      random_string: 'test'
    })
    addLog(`Tables result: ${JSON.stringify(result)}`)
  } catch (error) {
    addLog(`List tables failed: ${error}`)
  }
}

onUnmounted(() => {
  if (isConnected.value) {
    mcpClient.disconnect()
  }
})
</script>

<style scoped>
.mcp-test {
  max-width: 800px;
  margin: 0 auto;
}

.logs {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  background: #f5f5f5;
}

.log-entry {
  margin-bottom: 4px;
  font-family: monospace;
  font-size: 12px;
}

.timestamp {
  color: #666;
  margin-right: 8px;
}

.message {
  color: #333;
}
</style>
