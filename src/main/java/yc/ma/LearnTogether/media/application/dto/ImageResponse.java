package yc.ma.LearnTogether.media.application.dto;

import java.time.LocalDateTime;

public record ImageResponse(
        Long id,
        String type,
        String url,
        String publicId,
        String referenceType,
        Long referenceId,
        LocalDateTime uploadedAt,
        Double size
) {

}
