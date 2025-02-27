package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Embedded;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Table(name = "blogs", schema = "content")
@Getter
@ToString
@NoArgsConstructor
public class Blog {
    @Id
    private Long id;
    private Long userId;
    private String title;
    private String content;
    private Integer views;

    private ReviewStatus reviewStatus;

    private LocalDate reviewedAt;

    @MappedCollection(idColumn = "blog_id")
    private Set<Like> likes;

    @MappedCollection(idColumn = "blog_id")
    private Set<BlogTagReference> tagReferences;

    @MappedCollection(idColumn = "blog_id")
    private Set<Comment> comments;


    @Transient
    private Set<Tag> tags;



    @PersistenceCreator
    public Blog(Long id, Long userId, String title, String content, Integer views,
                ReviewStatus reviewStatus, LocalDate reviewedAt, Set<Like> likes,
                Set<BlogTagReference> tagReferences, Set<Comment> comments) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.views = views != null ? views : 0;
        this.reviewStatus = reviewStatus;
        this.reviewedAt = reviewedAt;
        this.likes = likes != null ? likes : new HashSet<>();
        this.tagReferences = tagReferences != null ? tagReferences : new HashSet<>();
        this.comments = comments != null ? comments : new HashSet<>();
        this.tags = new HashSet<>();
    }


    public static Blog create(Long userId, String title, String content) {
        Blog blog = new Blog();
        blog.userId = userId;
        blog.title = title;
        blog.content = content;
        blog.views = 0;
        blog.reviewStatus = ReviewStatus.PENDING;
        blog.likes = new HashSet<>();
        blog.tagReferences = new HashSet<>();
        blog.comments = new HashSet<>();
        blog.tags = new HashSet<>();
        return blog;
    }

    public void addTag(Tag tag) {
        if (tag.getId() == null) {
            throw new IllegalArgumentException("Tag must be persisted before adding to blog");
        }
        this.tagReferences.add(BlogTagReference.create(this.id, tag.getId()));
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

    public void incrementViews() {
        this.views = this.views + 1;
    }

    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public void approve() {
        this.reviewStatus = ReviewStatus.APPROVED;
        this.reviewedAt = LocalDate.now();
    }

    public void reject() {
        this.reviewStatus = ReviewStatus.REJECTED;
        this.reviewedAt = LocalDate.now();
    }

    public void addLike(Long userId) {
        Like newLike = Like.create(userId, this.id);
        this.likes.add(newLike);
    }

    public void removeLike(Long userId) {
        this.likes.removeIf(like -> like.getUserId().equals(userId));
    }

    public Comment addComment(Long userId, String content) {
        Comment newComment = Comment.create(userId, content, this.id);
        this.comments.add(newComment);
        return newComment;
    }

    public boolean removeComment(Long commentId, Long userId) {
        // Only allow comment removal by the comment author or blog owner
        boolean isAuthorized = this.comments.stream()
                .anyMatch(comment -> comment.getId().equals(commentId) &&
                        (comment.getUserId().equals(userId) || this.userId.equals(userId)));

        if (isAuthorized) {
            this.comments.removeIf(comment -> comment.getId().equals(commentId));
            return true;
        }
        return false;
    }


    @Transient
    public int getLikeCount() {
        return likes != null ? likes.size() : 0;
    }

    @Transient
    public int getCommentCount() {
        return comments != null ? comments.size() : 0;
    }

    @Transient
    public boolean isLikedBy(Long userId) {
        return likes != null && likes.stream().anyMatch(like -> like.getUserId().equals(userId));
    }
    public void setTagReferences(Set<BlogTagReference> tagReferences) {
        this.tagReferences = tagReferences;
    }
}