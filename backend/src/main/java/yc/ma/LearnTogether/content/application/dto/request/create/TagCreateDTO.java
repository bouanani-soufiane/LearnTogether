package yc.ma.LearnTogether.content.application.dto.request.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import yc.ma.LearnTogether.common.application.validation.UniqueValue;

public record TagCreateDTO(
        @NotBlank(message = "Tag name cannot be empty")
        @Size(min = 2, max = 50, message = "Tag name must be between 2 and 50 characters")
        @UniqueValue(schemaName = "content", tableName = "tags", fieldName = "name", message = "name should be unique")
        String name)
{
}
