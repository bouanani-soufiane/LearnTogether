package yc.ma.LearnTogether.media.web;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import yc.ma.LearnTogether.media.application.dto.ImageResponse;
import yc.ma.LearnTogether.media.application.dto.UploadImageRequest;
import yc.ma.LearnTogether.media.domain.service.MediaService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
@Slf4j
@Validated
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/upload")
    public ResponseEntity<ImageResponse> uploadMedia (
            @RequestParam("file") MultipartFile file,
            @RequestParam("referenceType") String referenceType,
            @RequestParam("referenceId") Long referenceId ) {

        ImageResponse response = mediaService.addImage(file, new UploadImageRequest(referenceType, referenceId));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImageResponse> updateMedia ( @PathVariable("id") Long id,
                                                @RequestParam("file") MultipartFile file ) {

        ImageResponse response = mediaService.updateImage(id, file);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ImageResponse> deleteMedia ( @PathVariable("id") Long id ) {
        mediaService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImageResponse> getMedia ( @PathVariable("id") Long id ) {
        ImageResponse image = mediaService.getImage(id);
        return ResponseEntity.ok(image);
    }


    @GetMapping
    public ResponseEntity<List<ImageResponse>> getMediaByReference (
            @RequestParam("referenceType") String referenceType,
            @RequestParam("referenceId") Long referenceId ) {
        List<ImageResponse> mediaList = mediaService.getImagesByReference(referenceType, referenceId);
        return ResponseEntity.ok(mediaList);
    }
}
