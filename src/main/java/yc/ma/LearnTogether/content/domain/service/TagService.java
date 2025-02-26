package yc.ma.LearnTogether.content.domain.service;

import org.springframework.transaction.annotation.Transactional;
import yc.ma.LearnTogether.content.application.dto.request.create.TagCreateDTO;
import yc.ma.LearnTogether.content.application.dto.request.update.TagUpdateDTO;
import yc.ma.LearnTogether.content.application.dto.response.TagResponseDTO;

import java.util.List;
import java.util.Set;

public interface TagService {
    List<TagResponseDTO> findAllTags ();

    TagResponseDTO findById ( Long id );

    TagResponseDTO findByName ( String name );

    Set<TagResponseDTO> findByBlogId ( Long blogId );

    Set<TagResponseDTO> findByQuestionId ( Long questionId );

    @Transactional
    TagResponseDTO createTag ( TagCreateDTO dto );

    @Transactional
    TagResponseDTO updateTag ( Long id, TagUpdateDTO dto );

    @Transactional
    void deleteTag ( Long id );

    List<TagResponseDTO> searchTags ( String query, int limit );

    @Transactional
    void addTagsToBlog ( Long blogId, Set<Long> tagIds );

    @Transactional
    void addTagsToQuestion ( Long questionId, Set<Long> tagIds );

    @Transactional
    void removeTagFromBlog ( Long blogId, Long tagId );

    @Transactional
    void removeTagFromQuestion ( Long questionId, Long tagId );
}