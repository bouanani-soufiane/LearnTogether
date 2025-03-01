package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.annotation.Transient;
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
public class Question {

    @Id
    private Long id;
    private Long userId;
    private String title;
    private String content;

    @MappedCollection(idColumn = "question_id")
    private Set<Answer> answers = new HashSet<>();

    @MappedCollection(idColumn = "question_id")
    private Set<Vote> votes = new HashSet<>();

    @MappedCollection(idColumn = "question_id")
    private Set<QuestionTagReference> tagReferences = new HashSet<>();

    @Transient
    private Set<Tag> tags = new HashSet<>();

    @PersistenceCreator
    public Question(Long id,
                    Long userId,
                    String title,
                    String content,
                    Set<Answer> answers,
                    Set<Vote> votes,
                    Set<QuestionTagReference> tagReferences) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.answers = answers != null ? answers : new HashSet<>();
        this.votes = votes != null ? votes : new HashSet<>();
        this.tagReferences = tagReferences != null ? tagReferences : new HashSet<>();
        this.tags = new HashSet<>();
    }

    public static Question create(String title, String content, Long userId) {
        return new Question(null, userId, title, content, new HashSet<>(), new HashSet<>(), new HashSet<>());
    }

    public void addTag(Tag tag) {
        if (tag.getId() == null) {
            throw new IllegalArgumentException("Tag must be persisted before adding to question");
        }
        this.tagReferences.add(QuestionTagReference.create(this.id, tag.getId()));
        if (this.tags == null) {
            this.tags = new HashSet<>();
        }
        this.tags.add(tag);
    }

    public void removeTag(Long tagId) {
        this.tagReferences.removeIf(ref -> ref.getTagId().equals(tagId));
        if (this.tags != null) {
            this.tags.removeIf(tag -> tag.getId().equals(tagId));
        }
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public void setTagReferences(Set<QuestionTagReference> tagReferences) {
        this.tagReferences = tagReferences;
    }

    public Answer addAnswer(Long userId, String content) {
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

    public void updateDetails(String title, String content) {
        if (title != null) {
            this.title = title;
        }
        if (content != null) {
            this.content = content;
        }
    }
}