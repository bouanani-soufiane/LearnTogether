package yc.ma.LearnTogether.media.application.mapper;

import org.mapstruct.Mapper;
import yc.ma.LearnTogether.common.application.mapper.BaseMapper;
import yc.ma.LearnTogether.media.application.dto.ImageResponse;
import yc.ma.LearnTogether.media.application.dto.UploadImageRequest;
import yc.ma.LearnTogether.media.domain.model.Media;

import java.util.List;

@Mapper(config = BaseMapper.class)
public interface MediaMapper extends BaseMapper<Media , UploadImageRequest , ImageResponse> {
    List<ImageResponse> toResponseDtoList( List<Media> entities);
}
