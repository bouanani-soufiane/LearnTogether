package yc.ma.LearnTogether.content.application.dto.response;

import yc.ma.LearnTogether.content.domain.model.ReviewStatus;

import java.time.LocalDate;
import java.util.Set;

public record BlogResponseDTO(
        Long id,
        Long userId,
        String title,
        String content,
        Integer views,
        ReviewStatus reviewStatus,
        LocalDate reviewedAt,
        int likeCount,
        boolean likedByCurrentUser,
        Set<TagResponseDTO> tags

) {
}
