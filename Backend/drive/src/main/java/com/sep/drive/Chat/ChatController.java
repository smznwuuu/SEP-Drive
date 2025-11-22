package com.sep.drive.Chat;

import com.sep.drive.userprofile.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired   //Nachrichten in der DB
    private MessageRepository messageRepository;

    @Autowired   //Benutzerdaten in der DB
    private UserProfileRepository userprofileRepository;

    @Autowired   //Nachrichten send über WebSocket
    private SimpMessagingTemplate messagingTemplate;

    //Message Objekt aus der DB in eine Dto
    private MessageDTO convertToDto(Message message) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSenderId());
        dto.setReceiverId(message.getReceiverId());
        dto.setContent(message.getContent());
        dto.setTimestamp(message.getTimestamp().toString());
        dto.setRead(message.isReadStatus());
        dto.setEdited(message.isEdited());
        dto.setDeleted(message.isDeleted());

        //Name des Absenders
        String senderName = userprofileRepository.findById(message.getSenderId())
                .map(user -> user.getFirstname() + " " + user.getLastname())
                .orElse("Unbekannt");

        dto.setSenderUsername(senderName);
        return dto;
    }

    //Chat Historie vonn Zwei Benutztern + sortieren und umwandeln in Dto
    @GetMapping("/history/{userId1}/{userId2}")
    public ResponseEntity<List<MessageDTO>> getChatHistory(@PathVariable Long userId1, @PathVariable Long userId2) {
        List<Message> messages1 = messageRepository.findBySenderIdAndReceiverIdOrderByTimestampAsc(userId1, userId2);
        List<Message> messages2 = messageRepository.findBySenderIdAndReceiverIdOrderByTimestampAsc(userId2, userId1);

        List<Message> combinedMessages = Stream.concat(messages1.stream(), messages2.stream())
                .sorted(Comparator.comparing(Message::getTimestamp))
                .collect(Collectors.toList());

        List<MessageDTO> messageDTOs = combinedMessages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(messageDTOs);
    }

    //ungelesene Nachrichten werden als gelesen makiert
    @PostMapping("/read/{senderId}/{receiverId}")
    public ResponseEntity<Void> markMessagesAsRead(@PathVariable Long senderId, @PathVariable Long receiverId) {
        List<Message> unreadMessages = messageRepository.findBySenderIdAndReceiverIdAndReadStatusFalse(senderId, receiverId);

        for (Message msg : unreadMessages) {
            msg.setReadStatus(true);
            messageRepository.save(msg);
            System.out.println("[READ] Nachricht als gelesen markiert: ID=" + msg.getId());

            MessageDTO dto = convertToDto(msg);
            messagingTemplate.convertAndSend("/topic/user-" + msg.getSenderId(), dto);
        }

        return ResponseEntity.ok().build();
    }

    //bearbeiten der Nachricht
    @PutMapping("/edit/{messageId}")
    public ResponseEntity<MessageDTO> editMessage(@PathVariable Long messageId, @RequestBody EditMessageDTO editDto) {
        Optional<Message> messageOptional = messageRepository.findById(messageId);
        if (messageOptional.isEmpty()) return ResponseEntity.notFound().build();

        Message message = messageOptional.get();
        if (message.isReadStatus() || message.isDeleted()) {
            return ResponseEntity.status(403).body(null);
        }

        message.setContent(editDto.getContent());
        message.setEdited(true);
        Message updatedMessage = messageRepository.save(message);

        MessageDTO updatedDto = convertToDto(updatedMessage);
        messagingTemplate.convertAndSend("/topic/user-" + updatedMessage.getSenderId(), updatedDto);
        messagingTemplate.convertAndSend("/topic/user-" + updatedMessage.getReceiverId(), updatedDto);

        return ResponseEntity.ok(updatedDto);
    }

    //löschen einer Nachricht
    @DeleteMapping("/delete/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long messageId) {
        Optional<Message> messageOptional = messageRepository.findById(messageId);
        if (messageOptional.isEmpty()) return ResponseEntity.notFound().build();

        Message message = messageOptional.get();
        if (message.isReadStatus() || message.isDeleted()) {
            return ResponseEntity.status(403).build();
        }

        message.setDeleted(true);
        message.setContent("[Nachricht gelöscht]");
        messageRepository.save(message);

        MessageDTO deletedDto = convertToDto(message);
        messagingTemplate.convertAndSend("/topic/user-" + message.getSenderId(), deletedDto);
        messagingTemplate.convertAndSend("/topic/user-" + message.getReceiverId(), deletedDto);

        return ResponseEntity.ok().build();
    }
}
