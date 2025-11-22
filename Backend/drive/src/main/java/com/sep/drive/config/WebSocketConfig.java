package com.sep.drive.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {



    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        //Präfix an den Nachrichten vom Backend ans Frontend gesendet werden
        config.enableSimpleBroker("/topic", "/user");
        //Präfix an den Nachrichten vom Frontend ans Backend gesendet werden
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");

    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        //Endpunkt an dem sich Frontend mit Websocket verbinden kann
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*");
    }


}
