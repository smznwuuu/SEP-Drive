package com.sep.drive.Chat;

import com.sep.drive.userprofile.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class ChatMessageController {

    @Autowired  //Nachrichten DB
    private MessageRepository messageRepository;
    @Autowired  //Benutzerdaten
    private UserProfileRepository userRepository;
    @Autowired  //Nachrichten WebSocket
    private SimpMessagingTemplate messagingTemplate;

    //Message Objekt in Dto
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

        //Name des Senders
        userRepository.findById(message.getSenderId()).ifPresent(user ->
                dto.setSenderUsername(user.getFirstname() + " " + user.getLastname())
        );
        return dto;
    }



    //Prozess beim Senden einer Nachricht
    @MessageMapping("/chat")
    public void processMessage(@Payload MessageDTO messageDTO) {
        System.out.println("[DEBUG] processMessage wurde aufgerufen");
        System.out.println("[DEBUG] empfangenes DTO: " + messageDTO);

        Message message = new Message();
        message.setSenderId(messageDTO.getSenderId());
        message.setReceiverId(messageDTO.getReceiverId());
        message.setContent(messageDTO.getContent());
        message.setTimestamp(LocalDateTime.now());
        message.setReadStatus(false);
        message.setEdited(false);
        message.setDeleted(false);

        Message savedMessage = messageRepository.save(message);
        System.out.println("[Backend] Nachricht gespeichert: " + savedMessage);

        MessageDTO savedDto = convertToDto(savedMessage);

        System.out.println("[Backend] Sende an Sender: " + savedMessage.getSenderId());
        System.out.println("[Backend] Sende an Empfänger: " + savedMessage.getReceiverId());

        messagingTemplate.convertAndSend("/topic/user-" + savedMessage.getSenderId(), savedDto);
        messagingTemplate.convertAndSend("/topic/user-" + savedMessage.getReceiverId(), savedDto);

    }

}
