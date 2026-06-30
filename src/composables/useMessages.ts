import { ref, computed } from 'vue'
import messagesData from '../data/messages.json'

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

const conversations = ref<Conversation[]>(messagesData.messages)

export function useMessages() {
  const unreadCount = computed(() => {
    return conversations.value.filter(m => m.status === 'active' && m.unread).length
  })

  function markAsRead(conversationId: string) {
    const convo = conversations.value.find(m => m.id === conversationId)
    if (convo) {
      convo.unread = false
    }
  }

  return {
    conversations,
    unreadCount,
    markAsRead
  }
}
