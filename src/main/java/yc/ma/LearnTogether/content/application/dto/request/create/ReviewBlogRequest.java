package yc.ma.LearnTogether.content.application.dto.request.create;

import yc.ma.LearnTogether.content.domain.model.ReviewStatus;

public record ReviewBlogRequest(
        ReviewStatus status
) {
}
