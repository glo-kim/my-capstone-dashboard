<template>
  <v-container fluid class="pa-6">
    <div class="text-h5 font-weight-bold mb-1">Messages</div>
    <div class="text-body-2 text-medium-emphasis mb-6">Communicate with your patients</div>

    <v-tabs v-model="tab" color="primary" class="mb-4">
      <v-tab value="active">
        Active
        <v-badge v-if="unreadCount > 0" :content="unreadCount" color="error" inline class="ml-2" />
      </v-tab>
      <v-tab value="archived">Archived</v-tab>
    </v-tabs>

    <v-row>
      <!-- Conversation list -->
      <v-col cols="4">
        <v-card variant="flat" style="background: rgb(var(--v-theme-surface-light)); border: 1px solid rgba(var(--v-theme-outline-variant), 0.5)">
          <v-list lines="three" class="py-0" bg-color="white">
            <template v-for="(msg, index) in filteredMessages" :key="msg.id">
              <v-list-item
                :class="{ 'bg-primary-container': selectedMessage?.id === msg.id }"
                @click="selectConversation(msg)"
                class="px-4"
              >
                <template #prepend>
                  <v-avatar color="primary" size="40" class="mr-3">
                    <span class="text-caption font-weight-bold text-white">{{ getInitials(msg.patientName) }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">
                  {{ msg.patientName }}
                  <v-badge v-if="msg.unread" dot inline color="primary" class="ml-1" />
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption mt-1" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  {{ msg.lastMessage }}
                </v-list-item-subtitle>
                <template #append>
                  <span class="text-caption text-medium-emphasis">{{ formatTime(msg.lastMessageTime) }}</span>
                </template>
              </v-list-item>
              <v-divider v-if="index < filteredMessages.length - 1" />
            </template>
            <v-list-item v-if="filteredMessages.length === 0">
              <v-list-item-title class="text-center text-medium-emphasis py-8">
                No {{ tab }} messages
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Conversation detail -->
      <v-col cols="8">
        <v-card variant="flat" class="d-flex flex-column" style="height: 600px; background: rgb(var(--v-theme-surface-light)); border: 1px solid rgba(var(--v-theme-outline-variant), 0.5)">
          <template v-if="selectedMessage">
            <!-- Header -->
            <v-card-title class="d-flex align-center pa-4 border-b">
              <v-avatar color="primary" size="40" class="mr-3">
                <span class="text-caption font-weight-bold text-white">{{ getInitials(selectedMessage.patientName) }}</span>
              </v-avatar>
              <div>
                <div class="text-body-2 font-weight-medium">{{ selectedMessage.patientName }}</div>
                <div class="text-medium-emphasis" style="font-size: 14px;">Patient ID: {{ selectedMessage.patientId }}</div>
              </div>
              <v-spacer />
              <div class="d-flex" style="gap: 8px;">
                <v-btn icon="mdi-archive-outline" variant="text" size="small" v-if="tab === 'active'" />
                <v-btn icon="mdi-dots-vertical" variant="text" size="small" />
              </div>
            </v-card-title>

            <!-- Messages -->
            <div class="flex-grow-1 overflow-y-auto pa-4" ref="messageContainer">
              <div
                v-for="m in selectedMessage.messages"
                :key="m.id"
                class="d-flex mb-3"
                :class="m.sender === 'coordinator' ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="message-bubble pa-3 rounded-lg"
                  :class="m.sender === 'coordinator' ? 'bg-primary text-white' : 'bg-surface-variant'"
                  style="max-width: 70%;"
                >
                  <div class="text-body-2">{{ m.text }}</div>
                  <div class="text-caption mt-1" :class="m.sender === 'coordinator' ? 'text-white' : 'text-medium-emphasis'" style="opacity: 0.7;">
                    {{ formatMessageTime(m.timestamp) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Input -->
            <div class="pa-4 border-t" v-if="tab === 'active'">
              <v-text-field
                v-model="newMessage"
                placeholder="Type a message..."
                variant="outlined"
                density="comfortable"
                rounded="lg"
                hide-details
                append-inner-icon="mdi-send"
                @click:append-inner="sendMessage"
                @keyup.enter="sendMessage"
              />
            </div>

            <!-- Archived indicator -->
            <div class="pa-4 border-t d-flex align-center justify-center" v-if="tab === 'archived'" style="background-color: rgb(var(--v-theme-surface-variant));">
              <v-icon icon="mdi-archive-outline" size="18" class="mr-2 text-medium-emphasis" />
              <span class="text-body-2 text-medium-emphasis">This conversation has been archived on {{ formatArchivedDate(selectedMessage.lastMessageTime) }}</span>
            </div>
          </template>

          <template v-else>
            <div class="d-flex flex-column align-center justify-center flex-grow-1 text-medium-emphasis">
              <v-icon icon="mdi-message-text-outline" size="64" class="mb-4" />
              <div class="text-body-1">Select a conversation to view messages</div>
            </div>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMessages } from '../composables/useMessages'

interface Message {
  id: string
  sender: string
  text: string
  timestamp: string
}

interface Conversation {
  id: string
  patientId: string
  patientName: string
  status: string
  unread: boolean
  lastMessage: string
  lastMessageTime: string
  sender: string
  messages: Message[]
}

const { conversations, unreadCount, markAsRead } = useMessages()

const tab = ref('active')
const selectedMessage = ref<Conversation | null>(null)
const newMessage = ref('')

const filteredMessages = computed(() => {
  return conversations.value
    .filter(m => m.status === tab.value)
    .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())
})

function selectConversation(msg: Conversation) {
  selectedMessage.value = msg
  if (msg.unread) {
    markAsRead(msg.id)
  }
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('')
}

function formatTime(timestamp: string): string {
  const now = new Date()
  const d = new Date(timestamp)
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  const diffHr = Math.floor(diffMs / 3_600_000)

  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHr < 24) return `${diffHr} hr ago`

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function formatArchivedDate(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function sendMessage() {
  if (!newMessage.value.trim() || !selectedMessage.value) return

  const msg: Message = {
    id: `m${Date.now()}`,
    sender: 'coordinator',
    text: newMessage.value.trim(),
    timestamp: new Date().toISOString()
  }

  selectedMessage.value.messages.push(msg)
  selectedMessage.value.lastMessage = msg.text
  selectedMessage.value.lastMessageTime = msg.timestamp
  selectedMessage.value.sender = 'coordinator'
  newMessage.value = ''
}
</script>

<style scoped>
.message-bubble {
  word-break: break-word;
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

:deep(.v-list-item) {
  border-radius: 0 !important;
}
</style>
