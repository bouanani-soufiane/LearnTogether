package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;
import yc.ma.LearnTogether.common.domain.exception.NotFoundException;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Table(name = "questions", schema = "content")
@NoArgsConstructor
@ToString
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
public class Question {

    private @Id
    @With Long id;

    private Long userId;

    private String title;

    private String content;

    @MappedCollection(idColumn = "question_id")
    private Set<Answer> answers = new HashSet<>();

    @MappedCollection(idColumn = "question_id")
    private Set<Vote> votes = new HashSet<>();

    public static Question create(String title, String content, Long userId) {
        Objects.requireNonNull(title, "Title must not be null");
        Objects.requireNonNull(content, "Content must not be null");
        Objects.requireNonNull(userId, "User ID must not be null");
        return new Question(null, userId, title, content, new HashSet<>(), new HashSet<>());
    }

    public Answer addAnswer ( Long userId, String content ) {
        Answer answer = Answer.create(userId, content);
        answers.add(answer);
        return answer;
    }

    public Vote addVoteToQuestion(Long userId, int value) {
        validateVote(userId, votes, "question");
        Vote vote = Vote.forQuestion(userId, this.id, value);
        votes.add(vote);
        return vote;
    }

    public Vote addVoteToAnswer(Long answerId, Long userId, int value) {
        Answer answer = answers.stream()
                .filter(a -> a.getId().equals(answerId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Answer", answerId));
        return answer.addVote(userId, value);
    }

    private void validateVote(Long userId, Set<Vote> voteSet, String target) {
        Objects.requireNonNull(userId, "User ID must not be null");
        if (voteSet.stream().anyMatch(v -> v.getUserId().equals(userId))) {
            throw new IllegalStateException("User has already voted on this " + target);
        }
    }
}
