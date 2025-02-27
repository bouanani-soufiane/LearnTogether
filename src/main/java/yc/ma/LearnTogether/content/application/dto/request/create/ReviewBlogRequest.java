package yc.ma.LearnTogether.content.application.dto.request.create;

import lombok.NonNull;
import yc.ma.LearnTogether.content.domain.model.ReviewStatus;

public record ReviewBlogRequest(
        @NonNull
        ReviewStatus status
) {
}
