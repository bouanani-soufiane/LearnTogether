package yc.ma.LearnTogether.media.application.dto;

import java.time.LocalDateTime;

public record UploadImageRequest(
        String referenceType,
        Long referenceId
) {

}