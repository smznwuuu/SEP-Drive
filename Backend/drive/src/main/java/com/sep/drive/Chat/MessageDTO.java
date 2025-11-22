package com.sep.drive.Chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {

    private Long id;
    private Long senderId;
    private Long receiverId;
    private String content;
    private String timestamp;
    private boolean read;
    private boolean edited;
    private boolean deleted;
    private String senderUsername;
}