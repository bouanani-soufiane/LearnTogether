package yc.ma.LearnTogether.content.application.dto.response;

import yc.ma.LearnTogether.content.domain.model.ReviewStatus;

import java.time.LocalDateTime;

public record BlogSummaryDTO(
        Long id,
        Long userId,
        String authorName,
        String title,
        Integer views,
        ReviewStatus reviewStatus,
        int likeCount,
        LocalDateTime createdAt
) {
}
