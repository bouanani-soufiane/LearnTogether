package yc.ma.LearnTogether.media.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Table(name = "medias", schema = "media")
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class Media {

    @Id
    private Long id;

    private String type;

    private String url;

    @Column("public_id")
    private String publicId;

    @Column("reference_type")
    private String referenceType;

    @Column("reference_id")
    private Long referenceId;

    @Column("uploaded_at")
    private LocalDateTime uploadedAt;

    private Double size;
}
