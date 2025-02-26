package yc.ma.LearnTogether.content.application.dto.response;

import yc.ma.LearnTogether.content.domain.model.ReviewStatus;

import java.util.Set;

public record BlogSummaryDTO(
        Long id,
        Long userId,
        String title,
        Integer views,
        ReviewStatus reviewStatus,
        int likeCount,
        Set<TagResponseDTO> tags
) {
}
