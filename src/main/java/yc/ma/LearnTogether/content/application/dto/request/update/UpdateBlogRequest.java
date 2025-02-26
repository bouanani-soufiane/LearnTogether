package yc.ma.LearnTogether.content.application.dto.request.update;

import jakarta.validation.constraints.Size;

import java.util.Set;

public record UpdateBlogRequest(
        @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
        String title,

        @Size(min = 10, message = "Content must be at least 10 characters")
        String content,

        Set<Long> tagIds
) {}