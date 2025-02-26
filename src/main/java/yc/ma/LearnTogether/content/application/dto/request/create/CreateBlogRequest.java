package yc.ma.LearnTogether.content.application.dto.request.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record CreateBlogRequest(
        @NotBlank(message = "Title cannot be empty")
        @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
        String title,

        @NotBlank(message = "Content cannot be empty")
        @Size(min = 10, message = "Content must be at least 10 characters")
        String content,

        Set<Long> tagIds
) {}