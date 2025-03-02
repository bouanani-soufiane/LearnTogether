package yc.ma.LearnTogether.media.domain.service;

import org.springframework.web.multipart.MultipartFile;
import yc.ma.LearnTogether.media.application.dto.ImageResponse;
import yc.ma.LearnTogether.media.application.dto.UploadImageRequest;


import java.util.List;
import java.util.Optional;

public interface MediaService {
    ImageResponse addImage( MultipartFile file, UploadImageRequest request) ;
    ImageResponse updateImage(Long mediaId, MultipartFile file) ;
    void deleteImage(Long mediaId) ;
    ImageResponse getImage(Long mediaId);
    List<ImageResponse> getImagesByReference(String referenceType, Long referenceId);
}