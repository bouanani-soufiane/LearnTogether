package yc.ma.LearnTogether.content.application.dto.request.update;

import jakarta.validation.constraints.Size;
import yc.ma.LearnTogether.common.application.validation.UniqueValue;

import java.util.Set;

public record UpdateBlogRequest(
        @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
        @UniqueValue(schemaName = "content", tableName = "blogs", fieldName = "title", message = "title should be unique")

        String title,

        @Size(min = 10, message = "Content must be at least 10 characters")
        String content,

        Set<Long> tagIds
) {}