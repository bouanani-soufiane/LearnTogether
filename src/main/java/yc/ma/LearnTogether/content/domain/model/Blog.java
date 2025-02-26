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
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
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

    public static Blog create(Long userId, String title, String content) {
        Blog blog = new Blog();
        blog.userId = userId;
        blog.title = title;
        blog.content = content;
        blog.views = 0;
        blog.reviewStatus = ReviewStatus.PENDING;
        blog.likes = new HashSet<>();
        return blog;
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

    @Transient
    public int getLikeCount() {
        return likes != null ? likes.size() : 0;
    }

    @Transient
    public boolean isLikedBy(Long userId) {
        return likes != null && likes.stream().anyMatch(like -> like.getUserId().equals(userId));
    }
}