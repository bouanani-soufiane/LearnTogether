package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Table(name = "answers", schema = "content")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
public class Answer {

    private @Id Long id;

    private Long userId;

    private String content;

    @Column("is_valid")
    private boolean valid;

    @MappedCollection(idColumn = "answer_id")
    private Set<Vote> votes = new HashSet<>();

    public static Answer create(Long userId, String content) {
        Objects.requireNonNull(userId, "User ID must not be null");
        Objects.requireNonNull(content, "Content must not be null");
        return new Answer(null, userId, content, false, new HashSet<>());
    }

    public Vote addVote(Long userId, int value) {
        validateVote(userId);
        Vote vote = Vote.forAnswer(userId, this.id, value);
        votes.add(vote);
        return vote;
    }
    public void markAsValid() {
        this.valid = true;
    }

    private void validateVote(Long userId) {
        Objects.requireNonNull(userId, "User ID must not be null");
        if (votes.stream().anyMatch(v -> v.getUserId().equals(userId))) {
            throw new IllegalStateException("User has already voted on this answer");
        }
    }
}