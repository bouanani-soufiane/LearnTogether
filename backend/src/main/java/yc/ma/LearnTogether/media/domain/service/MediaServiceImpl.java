package yc.ma.LearnTogether.media.domain.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import yc.ma.LearnTogether.common.domain.exception.NotFoundException;
import yc.ma.LearnTogether.media.application.dto.ImageResponse;
import yc.ma.LearnTogether.media.application.dto.UploadImageRequest;
import yc.ma.LearnTogether.media.application.mapper.MediaMapper;
import yc.ma.LearnTogether.media.domain.model.Media;
import yc.ma.LearnTogether.media.domain.repository.MediaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {

    private final MediaRepository mediaRepository;
    private final CloudinaryService cloudinaryService;
    private final MediaMapper mediaMapper;

    @Override
    public ImageResponse addImage(MultipartFile file, UploadImageRequest request) {
        try {
            Map<String, Object> uploadResult = cloudinaryService.uploadImage(file);
            String url = (String) uploadResult.get("url");
            String publicId = (String) uploadResult.get("public_id");
            Double size = (double) file.getSize();

            Media media = Media.builder()
                    .type("image")
                    .url(url)
                    .publicId(publicId)
                    .referenceType(request.referenceType())
                    .referenceId(request.referenceId())
                    .uploadedAt(LocalDateTime.now())
                    .size(size)
                    .build();

            Media savedMedia = mediaRepository.save(media);
            return mediaMapper.toResponseDto(savedMedia);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    @Override
    public ImageResponse updateImage(Long mediaId, MultipartFile file) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new NotFoundException("Media", mediaId));

        try {
            cloudinaryService.deleteImage(media.getPublicId());

            Map<String, Object> uploadResult = cloudinaryService.uploadImage(file);
            String url = (String) uploadResult.get("url");
            String publicId = (String) uploadResult.get("public_id");
            Double size = (double) file.getSize();

            Media updatedMedia = Media.builder()
                    .id(media.getId())
                    .type(media.getType())
                    .url(url)
                    .publicId(publicId)
                    .referenceType(media.getReferenceType())
                    .referenceId(media.getReferenceId())
                    .uploadedAt(LocalDateTime.now())
                    .size(size)
                    .build();

            Media savedMedia = mediaRepository.save(updatedMedia);
            return mediaMapper.toResponseDto(savedMedia);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update image: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteImage(Long mediaId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new NotFoundException("Media", mediaId));

        try {
            cloudinaryService.deleteImage(media.getPublicId());

            mediaRepository.delete(media);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete image: " + e.getMessage(), e);
        }
    }

    @Override
    public ImageResponse getImage(Long mediaId) {
        Media image = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new NotFoundException("image", mediaId));
        return mediaMapper.toResponseDto(image);
    }

    @Override
    public List<ImageResponse> getImagesByReference(String referenceType, Long referenceId) {
        List<Media> mediaList = mediaRepository.findByReferenceTypeAndReferenceId(referenceType, referenceId);
        return mediaMapper.toResponseDtoList(mediaList);
    }
}