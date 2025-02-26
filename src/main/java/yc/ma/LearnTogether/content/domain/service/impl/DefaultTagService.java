
package yc.ma.LearnTogether.content.domain.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import yc.ma.LearnTogether.common.domain.exception.NotFoundException;
import yc.ma.LearnTogether.common.infrastructure.security.SecurityUtils;
import yc.ma.LearnTogether.content.application.dto.request.create.TagCreateDTO;
import yc.ma.LearnTogether.content.application.dto.request.update.TagUpdateDTO;
import yc.ma.LearnTogether.content.application.dto.response.TagResponseDTO;
import yc.ma.LearnTogether.content.application.mapper.TagMapper;
import yc.ma.LearnTogether.content.domain.model.BlogTagReference;
import yc.ma.LearnTogether.content.domain.model.QuestionTagReference;
import yc.ma.LearnTogether.content.domain.model.Tag;
import yc.ma.LearnTogether.content.domain.repository.*;
import yc.ma.LearnTogether.content.domain.service.TagService;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DefaultTagService implements TagService {

    private final TagRepository tagRepository;
    private final BlogRepository blogRepository;
    private final QuestionRepository questionRepository;
    private final BlogTagReferenceRepository blogTagReferenceRepository;
    private final QuestionTagReferenceRepository questionTagReferenceRepository;
    private final TagMapper tagMapper;
    private final SecurityUtils securityUtils;

    @Override
    public List<TagResponseDTO> findAllTags() {
        return tagRepository.findAllByOrderByNameAsc().stream()
                .map(tagMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public TagResponseDTO findById(Long id) {
        Tag tag = getTagById(id);
        return tagMapper.toResponseDto(tag);
    }

    @Override
    public TagResponseDTO findByName(String name) {
        Tag tag = tagRepository.findByName(name.toLowerCase())
                .orElseThrow(() -> new NotFoundException("Tag with name", name));
        return tagMapper.toResponseDto(tag);
    }

    @Override
    public Set<TagResponseDTO> findByBlogId(Long blogId) {
        return tagMapper.toResponseDtoSet(tagRepository.findByBlogId(blogId));
    }

    @Override
    public Set<TagResponseDTO> findByQuestionId(Long questionId) {
        return tagMapper.toResponseDtoSet(tagRepository.findByQuestionId(questionId));
    }

    @Override
    @Transactional
    public TagResponseDTO createTag(TagCreateDTO dto) {
        validateAdminRole();

        Tag tag = Tag.create(dto.name());
        Tag savedTag = tagRepository.save(tag);
        log.info("Tag created: {}", savedTag.getId());

        return tagMapper.toResponseDto(savedTag);
    }

    @Override
    @Transactional
    public TagResponseDTO updateTag(Long id, TagUpdateDTO dto) {
        validateAdminRole();

        Tag tag = getTagById(id);

        tag.updateName(dto.name());
        Tag updatedTag = tagRepository.save(tag);
        log.info("Tag updated: {}", updatedTag.getId());

        return tagMapper.toResponseDto(updatedTag);
    }

    @Override
    @Transactional
    public void deleteTag(Long id) {
        validateAdminRole();

        Tag tag = getTagById(id);


        blogTagReferenceRepository.deleteAllByTagId(id);
        questionTagReferenceRepository.deleteAllByTagId(id);

        tagRepository.delete(tag);
        log.info("Tag deleted: {}", id);
    }

    @Override
    public List<TagResponseDTO> searchTags(String query, int limit) {
        return tagRepository.searchTags(query, limit).stream()
                .map(tagMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void addTagsToBlog(Long blogId, Set<Long> tagIds) {
        var blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new NotFoundException("Blog", blogId));

        Set<BlogTagReference> references = new HashSet<>();
        for (Long tagId : tagIds) {
            Tag tag = getTagById(tagId);
            references.add(BlogTagReference.create(blogId, tagId));
        }

        blog.setTagReferences(references);

        blogRepository.save(blog);

        Set<Tag> tags = tagRepository.findByBlogId(blogId);
        blog.setTags(tags);

        log.info("Tags added to blog: {}", blogId);
    }

    @Override
    @Transactional
    public void addTagsToQuestion(Long questionId, Set<Long> tagIds) {
        var question = questionRepository.findById(questionId)
                .orElseThrow(() -> new NotFoundException("Question", questionId));

        Set<Tag> tags = new HashSet<>();
        for (Long tagId : tagIds) {
            Tag tag = getTagById(tagId);
            tags.add(tag);

            if (questionTagReferenceRepository.findByQuestionIdAndTagId(questionId, tagId).isEmpty()) {
                QuestionTagReference reference = QuestionTagReference.create(questionId, tagId);
                questionTagReferenceRepository.save(reference);
            }
        }

        // Update the transient tags field for the returned entity
        question.setTags(tags);
        questionRepository.save(question);
        log.info("Tags added to question: {}", questionId);
    }

    @Override
    @Transactional
    public void removeTagFromBlog(Long blogId, Long tagId) {
        var blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new NotFoundException("Blog", blogId));

        blogTagReferenceRepository.findByBlogIdAndTagId(blogId, tagId)
                .ifPresent(reference -> {
                    blogTagReferenceRepository.delete(reference);
                    log.info("Tag {} removed from blog {}", tagId, blogId);
                });

        Set<Tag> tags = tagRepository.findByBlogId(blogId);
        blog.setTags(tags);
        blogRepository.save(blog);
    }

    @Override
    @Transactional
    public void removeTagFromQuestion(Long questionId, Long tagId) {
        var question = questionRepository.findById(questionId)
                .orElseThrow(() -> new NotFoundException("Question", questionId));

        questionTagReferenceRepository.findByQuestionIdAndTagId(questionId, tagId)
                .ifPresent(reference -> {
                    questionTagReferenceRepository.delete(reference);
                    log.info("Tag {} removed from question {}", tagId, questionId);
                });

        Set<Tag> tags = tagRepository.findByQuestionId(questionId);
        question.setTags(tags);
        questionRepository.save(question);
    }

    private Tag getTagById(Long id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tag", id));
    }

    private void validateAdminRole() {
        if (!isAdmin()) {
            throw new AccessDeniedException("Only administrators can manage tags");
        }
    }

    private boolean isAdmin() {
        try {
            var currentUser = securityUtils.getCurrentUser();
            return currentUser.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        } catch (Exception e) {
            return false;
        }
    }
}