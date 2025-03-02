package yc.ma.LearnTogether.media.domain.repository;

import org.springframework.data.repository.CrudRepository;
import yc.ma.LearnTogether.media.domain.model.Media;
import java.util.List;

public interface MediaRepository extends CrudRepository<Media, Long> {
    List<Media> findByReferenceTypeAndReferenceId(String referenceType, Long referenceId);
}
