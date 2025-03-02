package yc.ma.LearnTogether.media.application.mapper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import yc.ma.LearnTogether.media.application.dto.ImageResponse;
import yc.ma.LearnTogether.media.application.dto.UploadImageRequest;
import yc.ma.LearnTogether.media.domain.model.Media;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor"
)
@Component
public class MediaMapperImpl implements MediaMapper {

    @Override
    public Media toEntity(UploadImageRequest dto) {
        if ( dto == null ) {
            return null;
        }

        Media.MediaBuilder media = Media.builder();

        media.referenceType( dto.referenceType() );
        media.referenceId( dto.referenceId() );

        return media.build();
    }

    @Override
    public ImageResponse toResponseDto(Media entity) {
        if ( entity == null ) {
            return null;
        }

        Long id = null;
        String type = null;
        String url = null;
        String publicId = null;
        String referenceType = null;
        Long referenceId = null;
        LocalDateTime uploadedAt = null;
        Double size = null;

        id = entity.getId();
        type = entity.getType();
        url = entity.getUrl();
        publicId = entity.getPublicId();
        referenceType = entity.getReferenceType();
        referenceId = entity.getReferenceId();
        uploadedAt = entity.getUploadedAt();
        size = entity.getSize();

        ImageResponse imageResponse = new ImageResponse( id, type, url, publicId, referenceType, referenceId, uploadedAt, size );

        return imageResponse;
    }

    @Override
    public List<ImageResponse> toResponseDtoList(List<Media> entities) {
        if ( entities == null ) {
            return null;
        }

        List<ImageResponse> list = new ArrayList<ImageResponse>( entities.size() );
        for ( Media media : entities ) {
            list.add( toResponseDto( media ) );
        }

        return list;
    }
}
