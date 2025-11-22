package com.sep.drive.Chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    //Ausgabe von Nachrichten in sortierter Reihenfolge
    List<Message> findBySenderIdAndReceiverIdOrderByTimestampAsc(Long senderId, Long receiverId);

    //Ungelesene Nachrichten eines Absenders zu einem bestimmten Empfänger
    List<Message> findBySenderIdAndReceiverIdAndReadStatusFalse(Long senderId, Long receiverId);

}