
import { ChatMessage } from '../types';
import { fetchAccountMetrics } from './ghl';

// Simulating an API call to OpenAI or an internal proxy
export const sendMessageToAI = async (
  messages: ChatMessage[]
): Promise<ChatMessage> => {
  
  // IN PRODUCTION: Replace this with a fetch to your backend (e.g., /api/chat)
  // The backend would use the GHL Token to fetch real data before sending to OpenAI
  // const response = await fetch('/api/chat', { ... });
  
  // 1. Simulate Fetching Context from GHL (This would happen on backend)
  const ghlContext = await fetchAccountMetrics();

  return new Promise((resolve) => {
    setTimeout(() => {
      const lastUserMessage = messages[messages.length - 1].content.toLowerCase();
      let responseContent = "I can help with that. Could you provide more details?";
      let actions: ChatMessage['suggestedActions'] = [];

      // Logic incorporating GHL Technical Context
      
      // Case: SMS / A2P Issues
      if (lastUserMessage.includes('text') || lastUserMessage.includes('sms') || lastUserMessage.includes('deliver')) {
        if (ghlContext.a2pStatus !== 'verified') {
             responseContent = `I noticed your A2P 10DLC registration is currently '${ghlContext.a2pStatus}'. This is the most common reason for SMS failure. Carriers require this verification for all businesses.`;
             actions = [{ type: 'navigate', payload: '/settings/phone', label: 'Go to Trust Center' }];
        } else {
             responseContent = "Your A2P registration looks good. If texts are failing, it might be a credit balance issue or a specific carrier filter. Shall I guide you to the logs?";
             actions = [{ type: 'open_guide', payload: 'troubleshoot-sms', label: 'SMS Troubleshooting Guide' }];
        }
      } 
      // Case: Calendar Integration
      else if (lastUserMessage.includes('calendar') || lastUserMessage.includes('booking')) {
        const googleCal = ghlContext.integrations.find(i => i.id === 'google');
        if (googleCal && !googleCal.connected) {
            responseContent = "I see your Google Calendar integration is currently disconnected. This prevents appointments from syncing. Please reconnect it.";
            actions = [{ type: 'navigate', payload: '/settings/integrations', label: 'Reconnect Calendar' }];
        } else {
            responseContent = "Your calendar integration is active. To adjust your availability, you should check the specific Calendar Settings.";
        }
      }
      // Case: General Help
      else if (lastUserMessage.includes('setup') || lastUserMessage.includes('start')) {
        responseContent = "Welcome to CentriWeb! To get started, ensure your Domain and Phone systems are compliant. I have a checklist ready for you.";
        actions = [{ type: 'open_guide', payload: 'account-setup', label: 'Open Setup Checklist' }];
      } 
      // Case: Support Escalation
      else if (lastUserMessage.includes('support') || lastUserMessage.includes('broken')) {
        responseContent = "I'm sorry to hear you're having trouble. Since this sounds like a technical issue, I can help you submit a ticket with your system diagnostics attached.";
        actions = [{ type: 'navigate', payload: '/support', label: 'Open Support Ticket' }];
      }

      resolve({
        id: Date.now().toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
        suggestedActions: actions
      });
    }, 1200); // Simulate network latency
  });
};
