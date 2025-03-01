package yc.ma.LearnTogether.content.application.dto.request.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import yc.ma.LearnTogether.common.application.validation.UniqueValue;

import java.util.Set;

public record QuestionCreateDTO(
        @NotBlank(message = "Title cannot be empty")
        @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
        @UniqueValue(schemaName = "content", tableName = "questions", fieldName = "title", message = "title should be unique")
        String title,

        @NotBlank(message = "Content cannot be empty")
        @Size(min = 10, message = "Content must be at least 10 characters")
        String content,

        Set<Long> tagIds
) {
}